import { FastifyInstance } from "fastify";
import { renderToPipeableStream } from "react-dom/server";
import { createWebRequest } from "@kickstock/ssr/utils/create-request.ts";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router";
import App from "@kickstock/ssr/components/App.tsx";
import { routes } from "@kickstock/core/src/router/routes.tsx";
import { ThemeProvider } from "@kickstock/core/src/providers/theme.provider";

const { query, dataRoutes } = createStaticHandler(routes);

export const rootSteam = (fastify: FastifyInstance) => {
  fastify.get("*", async (req, res) => {
    const request = createWebRequest(req);
    const context = await query(request);
    if (context instanceof Response) {
      return context;
    }

    const router = createStaticRouter(dataRoutes, context);

    const { pipe } = renderToPipeableStream(
      <App>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StaticRouterProvider router={router} context={context} />
        </ThemeProvider>
      </App>,
      {
        bootstrapModules: ["/dist/index.js"],
        onShellReady() {
          res.raw.setHeader("content-type", "text/html");
          pipe(res.raw);
        },
        onError(err) {
          fastify.log.error(err);
        },
        onShellError(err) {
          fastify.log.error(err);
        },
      },
    );
    res.sendFile("index.js");
  });
};
