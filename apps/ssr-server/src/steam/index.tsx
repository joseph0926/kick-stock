import { FastifyInstance } from "fastify";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router";
import { App } from "@/entry.js";

export const rootSteam = (fastify: FastifyInstance) => {
  fastify.get("/", (req, res) => {
    let didError = false;

    const stream = renderToPipeableStream(
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>,
      {
        bootstrapScripts: ["/src/main.tsx"],
        onShellReady() {
          res.raw.setHeader("content-type", "text/html");
          res.raw.write("<!DOCTYPE html>");
          stream.pipe(res.raw);
        },
        onError(error) {
          didError = true;
          console.error("Error:", error);
          res.raw.statusCode = 500;
          res.raw.end("Internal Server Error");
        },
      }
    );
  });
};
