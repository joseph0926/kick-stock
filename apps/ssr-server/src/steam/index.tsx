import { FastifyInstance } from "fastify";
import { renderToPipeableStream } from "react-dom/server";
import { App, routes } from "@/entry.server.ts";
import { createWebRequest } from "src/utils/create-request.ts";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router";

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
        <StaticRouterProvider router={router} context={context} />
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
      }
    );
    res.sendFile("index.js");
  });
};
