interface Window {
  __staticRouterHydrationData:
    | Partial<Pick<RouterState, "loaderData" | "actionData" | "errors">>
    | undefined;
}
