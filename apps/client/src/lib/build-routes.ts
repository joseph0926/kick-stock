import {
  routeDefinitions,
  RouteMeta,
} from "@kickstock/router/src/routes.config";
import { RouteObject } from "react-router";
import { getClientElementByKey } from "@kickstock/client/src/lib/get-client-element-key";

function buildRoutes(metaList: RouteMeta[]): RouteObject[] {
  return metaList.map((meta) => {
    if (meta.index) {
      return {
        index: true,
        element: getClientElementByKey(meta.routeKey),
      };
    } else {
      return {
        path: meta.path,
        element: getClientElementByKey(meta.routeKey),
        children: meta.children ? buildRoutes(meta.children) : undefined,
      };
    }
  });
}

export const clientRoutes: RouteObject[] = buildRoutes(routeDefinitions);
