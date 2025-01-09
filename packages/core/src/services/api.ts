import axios from "axios";
import { isProd } from "@kickstock/shared/src/lib/env-util";

export const ssrCdnAxios = axios.create({
  baseURL:
    "https://cdn.jsdelivr.net/gh/joseph0926/kick-stock/packages/data-cdn",
});

export const apiAxios = axios.create({
  baseURL: isProd
    ? "https://api.kick-stock.onrender.com/api/v1"
    : "http://localhost:4000/api/v1",
});
