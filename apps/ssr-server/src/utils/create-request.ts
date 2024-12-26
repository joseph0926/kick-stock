import { FastifyRequest } from "fastify";

export function createWebRequest(fastifyRequest: FastifyRequest) {
  const baseUrl = `${fastifyRequest.protocol}://${fastifyRequest.hostname}`;
  const url = new URL(fastifyRequest.url, baseUrl);

  const headers = new Headers();
  for (const [key, value] of Object.entries(fastifyRequest.headers)) {
    if (value) {
      const headerValue = Array.isArray(value) ? value.join(", ") : value;
      headers.append(key, headerValue);
    }
  }

  let body: BodyInit | null = null;
  if (fastifyRequest.body) {
    body =
      typeof fastifyRequest.body === "string"
        ? fastifyRequest.body
        : JSON.stringify(fastifyRequest.body);
  }

  const init: RequestInit = {
    method: fastifyRequest.method,
    headers,
    body,
  };

  return new Request(url.toString(), init);
}
