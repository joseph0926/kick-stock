import axios from "axios";

export const stockAxios = axios.create({
  baseURL: `https://www.alphavantage.co/query?&apikey=${process.env.STOCK_API_KEY}`,
});
