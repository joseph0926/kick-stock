import { isServer } from "@tanstack/react-query";
import axios from "axios";

export const cdnCachePurge = axios.create({
  baseURL:
    "https://purge.jsdelivr.net/gh/joseph0926/kick-stock/packages/data-cdn",
});

export const ssrCdnAxios = axios.create({
  baseURL:
    "https://cdn.jsdelivr.net/gh/joseph0926/kick-stock/packages/data-cdn",
});

export const apiAxios = axios.create({
  baseURL: isServer ? "http://localhost:4000/api/v1" : "/api",
});
