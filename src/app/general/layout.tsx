import { Stack, Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";

function GeneralLayout() {
  return (
    <Box sx={{ padding: 1, height: "100vh", overflow: "hidden" , backgroundColor:'#1e293b'}}>
      <Stack direction="row">
        <Box sx={{ width: "20%", height: "100vh" }}>
          <Sidebar />
        </Box>
        <Box sx={{ width: "80%", height: "100vh", overflowY: "auto" }}>
          <Outlet />
        </Box>
      </Stack>
    </Box>
  );
}

export { GeneralLayout as Component };
