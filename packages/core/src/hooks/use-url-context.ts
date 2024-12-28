import { useContext } from "react";
import UrlContext from "../providers/url.context";

export const useUrlContext = () => {
  const context = useContext(UrlContext);
  if (!context) {
    throw new Error(
      "[UrlContext] useUrlContext은 반드시 UrlContextProvider 내부에서 사용되어야합니다."
    );
  }
  return context;
};
