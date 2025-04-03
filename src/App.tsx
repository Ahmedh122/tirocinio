import "./App.css";
import Home from "./Pages/Home";
import Document from "./Pages/Document/Document";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
const theme = createTheme();
function App() {
  const Layout = () => {
    const queryClient = new QueryClient();
    return (
      <QueryClientProvider client={queryClient}>
        <Box
          sx={{
            display: "flex",
            flexDirection:'column',
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
           
          }}
        >
          <Outlet />
        </Box>
      </QueryClientProvider>
    );
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/document/:id", element: <Document url="" extension="" /> },
      ],
    },
  ]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
