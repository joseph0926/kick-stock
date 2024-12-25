import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

const healthRoute = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.get("/health", async (request, reply) => {
    return { status: "ok" };
  });
};

export default fp(healthRoute);
