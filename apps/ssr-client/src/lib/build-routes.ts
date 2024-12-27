import {
  routeDefinitions,
  type RouteMeta,
} from "@kickstock/router/src/routes.config";
import { RouteObject } from "react-router";
import { getSsrElementKey } from "./get-ssr-element-key";

function buildRoutes(metaList: RouteMeta[]): RouteObject[] {
  return metaList.map((meta) => {
    if (meta.index) {
      return {
        index: true,
        element: getSsrElementKey(meta.routeKey),
      };
    } else {
      return {
        path: meta.path,
        element: getSsrElementKey(meta.routeKey),
        children: meta.children ? buildRoutes(meta.children) : undefined,
      };
    }
  });
}

export const ssrRoutes: RouteObject[] = buildRoutes(routeDefinitions);
