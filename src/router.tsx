import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    lazy: () => import("./app/layout"),
    children: [
      { path: "/", lazy: () => import("./app/page") },
      {
        lazy: () => import("./app/documents/[type]/[id]/layout"),
        children: [
          {
            path: "/documents/:type/:id",
            index: true,
            lazy: () => import("./app/documents/[type]/[id]/page"),
          },
        ],
      },
    ],
  },
]);
