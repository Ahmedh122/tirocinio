import { Box, Paper } from "@mui/material";
import { githubLightTheme, JsonEditor } from "json-edit-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const JsonViewer = ({ data }: { data: any }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        height: "95%",
        padding: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "95%",
          overflow: "auto",
        }}
      >
        <JsonEditor
          data={data || {}}
          onUpdate={() => {}}
          theme={githubLightTheme}
          searchDebounceTime={300}
          restrictEdit={false}
          showErrorMessages={true}
        />
      </Box>
    </Paper>
  );
};

export default JsonViewer;
