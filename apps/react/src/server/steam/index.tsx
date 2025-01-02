import { FastifyInstance } from "fastify";
import { renderToPipeableStream } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router";
import { ThemeProvider } from "next-themes";
import App from "@/client/app";
import { routes } from "@kickstock/core/src/router/routes.tsx";
import { QueryProvider } from "@kickstock/core/src/providers/query.provider";
import { parseCookies } from "@/server/lib/parse-cookies";
import { createWebRequest } from "@/server/lib/create-request";
import { getHtmlFooter, getHtmlHeader } from "@/server/steam/header";

const { query, dataRoutes } = createStaticHandler(routes);

export const rootSteam = (fastify: FastifyInstance) => {
  fastify.get("*", async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const userTheme = cookies.theme ?? "dark";

    const request = createWebRequest(req);
    const context = await query(request);
    if (context instanceof Response) {
      return context;
    }

    const router = createStaticRouter(dataRoutes, context);

    res.type("text/html");

    const { pipe } = renderToPipeableStream(
      <App>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            <StaticRouterProvider router={router} context={context} />
          </QueryProvider>
        </ThemeProvider>
      </App>,
      {
        onShellReady() {
          const header = getHtmlHeader(userTheme);
          const footer = getHtmlFooter();

          res.raw.write(header);
          pipe(res.raw);
          res.raw.write(footer);
        },
        onError(err) {
          fastify.log.error(err);
        },
        onShellError(err) {
          fastify.log.error(err);
        },
      },
    );
  });
};
