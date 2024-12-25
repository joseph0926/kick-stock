import { FastifyInstance, FastifyPluginOptions } from "fastify";

export const healthRoute = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.get("/", async (request, reply) => {
    return { status: "ok" };
  });
};
