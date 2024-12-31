import { FastifyInstance } from "fastify";
import { renderToPipeableStream } from "react-dom/server";
import { createWebRequest } from "@kickstock/ssr/utils/create-request.ts";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router";
import { routes } from "@kickstock/core/src/router/routes.tsx";
// import { parseCookies } from "../utils/parse-cookies";
import App from "../components/app";
import QueryProvider from "../components/query-client";

const { query, dataRoutes } = createStaticHandler(routes);

export const rootSteam = (fastify: FastifyInstance) => {
  fastify.get("*", async (req, res) => {
    // const cookies = parseCookies(req.headers.cookie);
    // const userTheme = cookies.theme ?? "dark";

    const request = createWebRequest(req);
    const context = await query(request);
    if (context instanceof Response) {
      return context;
    }

    const router = createStaticRouter(dataRoutes, context);

    const { pipe } = renderToPipeableStream(
      <App>
        <QueryProvider>
          <StaticRouterProvider router={router} context={context} />
        </QueryProvider>
      </App>,
      {
        onShellReady() {
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
  });
};
