import axios from "axios";

export const cdnAxiosInstance = axios.create({
  baseURL: "/cdn",
});
