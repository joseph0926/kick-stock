import { createContext, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

type NewSearchParamsType = {
  [key: string]: string;
};
type UpdateMode = "replace" | "update";

type UrlContextProps = {
  searchParams: URLSearchParams;
  onUpdateSearchParams: (
    payload: NewSearchParamsType,
    mode?: UpdateMode,
  ) => void;
};

const UrlContext = createContext<UrlContextProps | null>(null);

export const UrlContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * searchParams 업데이트 함수
   * @param payload 새로운 searchParams
   * @param mode "replace" | "update"
   */
  const onUpdateSearchParams = useCallback(
    (payload: NewSearchParamsType, mode: UpdateMode = "replace") => {
      // 빈 객체면 리턴
      if (Object.keys(payload).length === 0) {
        console.warn("[UrlContext] payload가 제공되지 않았습니다.");
        return;
      }

      // 객체가 {[key: string]: string} 타입인지 체크
      const isValidPayload = Object.entries(payload).every(
        ([key, value]) => typeof key === "string" && typeof value === "string",
      );
      if (!isValidPayload) {
        console.warn(
          "[UrlContext] payload 타입은 { [key: string]: string } 이어야 합니다.",
        );
        return;
      }

      // 현재 searchParams 객체로 변환
      const currentParams = Object.fromEntries(searchParams.entries());

      if (mode === "replace") {
        setSearchParams(payload);
      } else {
        const updateParams = {
          ...currentParams,
          ...payload,
        };
        setSearchParams(updateParams);
      }
    },
    [searchParams, setSearchParams],
  );

  const initialValue = useMemo(() => {
    return {
      searchParams,
      onUpdateSearchParams,
    };
  }, [searchParams, onUpdateSearchParams]);

  return (
    <UrlContext.Provider value={initialValue}>{children}</UrlContext.Provider>
  );
};

export default UrlContext;
