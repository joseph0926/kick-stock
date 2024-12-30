import { FastifyInstance } from "fastify";
import { renderToPipeableStream } from "react-dom/server";
import { createWebRequest } from "@kickstock/ssr/utils/create-request.ts";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router";
import { routes } from "@kickstock/core/src/router/routes.tsx";
import { ThemeProvider } from "@kickstock/core/src/providers/theme.provider";
import { entryBottom, entryHeader } from "../components/entry";
import { parseCookies } from "../utils/parse-cookies";

const { query, dataRoutes } = createStaticHandler(routes);

export const rootSteam = (fastify: FastifyInstance) => {
  fastify.get("*", async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const userTheme = cookies.theme ?? "system";

    const request = createWebRequest(req);
    const context = await query(request);
    if (context instanceof Response) {
      return context;
    }

    const router = createStaticRouter(dataRoutes, context);

    const { pipe } = renderToPipeableStream(
      <ThemeProvider
        attribute="class"
        defaultTheme={userTheme}
        enableSystem
        disableTransitionOnChange
      >
        <StaticRouterProvider router={router} context={context} />
      </ThemeProvider>,
      {
        bootstrapModules: ["/dist/index.js"],
        onShellReady() {
          res.raw.write(entryHeader);
          pipe(res.raw);
          res.raw.write(entryBottom);
          res.raw.end();
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
