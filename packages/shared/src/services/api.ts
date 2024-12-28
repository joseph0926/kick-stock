import axios from "axios";

export const ssrCdnAxios = axios.create({
  baseURL:
    "https://cdn.jsdelivr.net/gh/joseph0926/kick-stock/packages/data-cdn",
});
