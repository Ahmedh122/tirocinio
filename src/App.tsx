import "./App.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/@tanstack/react-query/query-client";
import { RouterProvider } from "./lib/react-router-dom/router-provider";
import { ThemeProvider,} from "./lib/@mui/theme-provider";
import { themeOptions } from "./lib/@mui/theme-options";
import { Suspense } from "react";
import { GlobalSpinner } from "./components/spinners/global-spinner";
import { StrictMode } from "react";


export function App() {
  return(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider themeOptions={themeOptions}>
           <Suspense fallback={<GlobalSpinner />}>
         <RouterProvider/>
         </Suspense>
        </ThemeProvider>
      </QueryClientProvider >
    </StrictMode>
  )
}


