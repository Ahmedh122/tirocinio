import { Box, Paper, TextField } from "@mui/material";


const TextViewer = ({ text , setText}: { text: string, setText: (value: string) => void; }) => {
  
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
        rows={32}
          value={text}
          sx={{ width: "100%", height: "100%" }}
          onChange={(
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            setText(event.target.value);
          }}
        />
      </Box>
    </Paper>
  );
};

export default TextViewer;
