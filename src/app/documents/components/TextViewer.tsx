import { Box, Button, Paper, Stack, TextField } from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
//import { useModifyFileText } from "../../../lib/@tanstack/react-query/mutations/edit-file-text-mutation";
const TextViewer = ({
  //fileId,
  text,
  setText,
}: {
  fileId: string,
  text: string;
  setText: (value: string) => void;
}) => {

  //const saveText= useSaveFIleText(fileId)


  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        height: "95%",

        overflow: "auto",
      }}
    >
      <Stack direction={"column"} gap={2}>
        <Stack
          direction={"row"}
          height={56}
          alignItems={"center"}
          justifyContent={"end"}
          gap={2}
          paddingX={4}
          sx={{
            backgroundColor: "#1976d2",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        >
          <Button
          onClick={()=>{/*saveText.mutate(text)*/}}
            sx={{
              width: 30,
              height: 30,
              minWidth: 0,
              borderRadius: "50%",
              boxShadow: 3,
              backgroundColor:'white',
              "& svg": {
                color: "#1976d2",
              },
              "&:hover svg": {
                color: "white",
              },
              "&:hover": {
                backgroundColor: "#1976d2",
              },
            }}
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
          </Button>
        </Stack>
        <Box paddingX={1}>
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
      </Stack>
    </Paper>
  );
};

export default TextViewer;
