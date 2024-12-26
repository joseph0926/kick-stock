import { FastifyInstance } from "fastify";
import { renderToPipeableStream } from "react-dom/server";
import { App } from "@/server/index.ts";
import { createWebRequest } from "src/utils/create-request.ts";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router";
import { routes } from "@/shared/routes/index.tsx";

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
      }
    );
    res.sendFile("index.js");
  });
};
