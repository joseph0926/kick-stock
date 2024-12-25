export type ApiResponse<T = any[]> = {
  data: T | null;
  success: boolean;
  message?: string;
};
