import { isServer } from "@tanstack/react-query";
import axios from "axios";
import { isProd } from "@kickstock/shared/src/lib/env-util";

export const ssrCdnAxios = axios.create({
  baseURL:
    "https://cdn.jsdelivr.net/gh/joseph0926/kick-stock/packages/data-cdn",
});

export const apiAxios = axios.create({
  baseURL: isProd
    ? "https://kick-stock.onrender.com/api/v1"
    : // : isServer
      //   ? "http://localhost:4000/api/v1"
      //   : "/api",
      "http://localhost:4000/api/v1",
});
