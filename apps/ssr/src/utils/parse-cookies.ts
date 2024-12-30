export function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader.split(";").reduce(
    (acc, item) => {
      const [key, val] = item.split("=").map((str) => str.trim());
      if (key && val) acc[key] = decodeURIComponent(val);
      return acc;
    },
    {} as Record<string, string>,
  );
}
