import "./App.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/@tanstack/react-query/query-client";
import { RouterProvider } from "./lib/react-router-dom/router-provider";
import { ThemeProvider,} from "./lib/@mui/theme-provider";
import { themeOptions } from "./lib/@mui/theme-options";
import { Suspense } from "react";
import { GlobalSpinner } from "./components/spinners/global-spinner";
import { StrictMode } from "react";
import { SnackbarProvider } from "notistack";

export function App() {
  return(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
      <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={3000}
          preventDuplicate
        >
        <ThemeProvider themeOptions={themeOptions } >
           <Suspense fallback={<GlobalSpinner />}>
         <RouterProvider/>
        
         </Suspense>
        </ThemeProvider>
        </SnackbarProvider>
      </QueryClientProvider >
    </StrictMode>
  )
}


