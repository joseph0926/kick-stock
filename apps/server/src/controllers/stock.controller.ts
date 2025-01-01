import { stockAxios } from "@/lib/api.js";
import { ApiResponse } from "@/types/api.type.js";
import { FastifyReply, FastifyRequest, RouteHandler } from "fastify";

export const getStockData: RouteHandler<{
  Reply: ApiResponse<any[]>;
}> = async (req: FastifyRequest, res: FastifyReply) => {
  const { fn, symbol } = req.query as { fn: string; symbol: string };

  try {
    const { data } = await stockAxios.get("", {
      params: {
        function: fn,
        symbol,
      },
    });

    return res.send({
      data,
      success: true,
      message: "데이터를 불러왔습니다.",
    });
  } catch (error) {
    req.log.error("[getStockData error]: ", error);
    return {
      data: null,
      success: false,
      message: "데이터를 불러오는데 실패하였습니다.",
    };
  }
};
