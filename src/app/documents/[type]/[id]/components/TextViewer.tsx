import { Box, Paper, TextField } from "@mui/material";
import React, { useState } from "react";

const TextViewer = ({ text }: { text: string }) => {
  const [inputText, setInputText] = useState<string>(text);
  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        height: "95%",
        padding: 1,
        overflow: "auto",
      }}
    >
      <Box sx={{ padding: 1 }}>
        <TextField
          id="outlined-multiline-static"
          label="Text response"
          multiline
          rows={22}
          value={inputText}
          sx={{ width: "100%", height: "100%" }}
          onChange={(
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            setInputText(event.target.value);
          }}
        />
      </Box>
    </Paper>
  );
};

export default TextViewer;
