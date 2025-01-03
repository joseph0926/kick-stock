import { FastifyInstance } from "fastify";
import { renderToPipeableStream } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router";
import { ThemeProvider } from "next-themes";
import { routes } from "@kickstock/core/src/router/routes.tsx";
import { QueryProvider } from "@kickstock/core/src/providers/query.provider";
import { createWebRequest } from "@/server/lib/create-request";
import { getHtmlFooter, getHtmlHeader } from "@/server/steam/header";
import { HydrationBoundary } from "@tanstack/react-query";
import { leagueDataPrefetch } from "../query/leagues.query";

const { query, dataRoutes } = createStaticHandler(routes);

export const rootSteam = (fastify: FastifyInstance) => {
  fastify.get("*", async (req, res) => {
    const { leaguesQuery } = await leagueDataPrefetch();

    const request = createWebRequest(req);
    const context = await query(request);
    if (context instanceof Response) {
      return context;
    }

    const router = createStaticRouter(dataRoutes, context);

    const { pipe } = renderToPipeableStream(
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <QueryProvider>
          <HydrationBoundary state={leaguesQuery}>
            <StaticRouterProvider router={router} context={context} />
          </HydrationBoundary>
        </QueryProvider>
      </ThemeProvider>,
      {
        onShellReady() {
          res.raw.setHeader("content-type", "text/html");

          try {
            const header = getHtmlHeader();
            res.raw.write(header);

            const stream = pipe(res.raw);

            stream.on("end", () => {
              const footer = getHtmlFooter();
              res.raw.write(footer);
              res.raw.end();
            });
          } catch (error) {
            console.error("Streaming error:", error);
            res.raw.statusCode = 500;
            res.raw.end("Internal Server Error");
          }
        },
        onShellError(error) {
          console.error("Shell error:", error);
          res.raw.statusCode = 500;
          res.raw.setHeader("content-type", "text/html");
          res.raw.end("<h1>Something went wrong</h1>");
        },
        onError(error) {
          console.error("Rendering error:", error);
        },
      },
    );
  });
};
