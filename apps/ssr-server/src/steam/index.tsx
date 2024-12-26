import { FastifyInstance } from "fastify";
import { renderToPipeableStream } from "react-dom/server";

export const rootSteam = (fastify: FastifyInstance) => {
  fastify.get("/", (req, res) => {
    const { pipe } = renderToPipeableStream(<App />, {
      bootstrapModules: ["/dist/index.js"],
      onShellReady() {
        res.raw.setHeader("content-type", "text/html");
        pipe(res.raw);
      },
    });
    res.sendFile("index.js");
  });
};

function App() {
  return (
    <html lang="ko">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Test!!!</title>
      </head>
      <body>
        <div id="root">
          <div>
            <button>Test2</button>
          </div>
        </div>
      </body>
    </html>
  );
}
