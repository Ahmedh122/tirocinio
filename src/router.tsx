// router.ts
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    
    path: "/",
    lazy: () => import("./app/layout"), // RootLayout 
    children: [
      {
        path: "/",
        lazy: () => import("./app/general/layout"), // GeneralLayout con la sidebar
        children: [
          {
            index: true,
            lazy: () => import("./app/general/page"), // Home page fa navigare per default alla lista di tutti i files
          },
          {
            path: "/AllFiles",
            lazy: () =>
              import("./app/general/components/tables/ListaPrincipale"), //lista di tutti i files
          },
          {
            path: "/List/:nome/:id",
            lazy: () =>
              import("./app/general/components/tables/ListaCustom"),// sottoliste customizzate della lista di tutti i files
          },
        ],
      },
    ],
  },
  {
    
    path: "documents/:type/:id",
    lazy: () => import("./app/documents/layout"),
    children: [
      {
        index: true,
        lazy: () => import("./app/documents/page"),
      },
    ],
  },
]);


