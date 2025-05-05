import {
  Box,
  FormControlLabel,
  FormGroup,
  IconButton,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { githubLightTheme, JsonEditor } from "json-edit-react";
import { Result } from "../../../api/types/result";
import { Redo as RedoIcon, Undo as UndoIcon } from "@mui/icons-material";
import { useEditorHistory } from "../hooks/use-history";
import "./utils/JsonEditor.css";
import { useState } from "react";
//import { useModifyFile } from "../../../lib/@tanstack/react-query/mutations/edit-file-mutation";

const JsonViewer = ({
  json,
  newJson,
}: //fileId

{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newJson: any;
  fileId: string;
}) => {
  //const modFile = useModifyFile(fileId)

  const {
    currentData,
    handleUpdate,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
  } = useEditorHistory<Result>({
    initialData: json,
    onUpdate: async (updatedData) => {
      console.log(updatedData);
      {
        /** await modFile.mutateAsync({
       
       ...updatedData
      }); */
      }
    },
  });

  const [isNewJson, setIsNewJson] = useState<boolean>(false);

  const handleSwitchJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsNewJson(event.target.checked);
  };

  const handleJsonUpdate = ({
    newData,
  }: {
    newData: object | string | boolean | number | unknown[];
  }) => {
    if (typeof newData === "object" && newData !== null) {
      handleUpdate(newData as Result);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        height: "95%",
       
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Stack
        direction={"column"}
        sx={{
          width: "100%",
          height: "100%",
          overflow: "auto",
        }}
      >
        <Stack direction={"row"} height={50} alignItems={"center"} justifyContent={"space-between"} gap={2} paddingX={4} sx={{backgroundColor:"#1976d2", borderTopLeftRadius: '12px',borderTopRightRadius: '12px'}}>
          <Box>
           
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  backgroundColor: "#1976d2",
                  paddingX: 2,
                  borderRadius: 4,
                  width: 200,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: !isNewJson ? "bold" : "normal",
                    color: "white",
                    marginRight: 2,
                  }}
                >
                  Old
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isNewJson}
                        disabled={newJson === null}
                        onChange={(event) => {
                          handleSwitchJson(event);
                        }}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "white",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "lightgray",
                            },
                          "& .MuiSwitch-track": {
                            backgroundColor: "lightgray",
                          },
                        }}
                      />
                    }
                    label=""
                  />
                </FormGroup>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isNewJson ? "bold" : "normal",
                    fontStyle: newJson === null ? "italic": "normal",
                    marginLeft: -2,
                    color: newJson===null ?"grey":"white",
                  }}
                >
                  New
                </Typography>
              </Box>
         
          </Box>
          <Box>
            {isNewJson ? (
              <></>
            ) : (
              <>
                {" "}
                <IconButton
                  onClick={handleUndo}
                  disabled={!canUndo}
                  size="small"
                >
                  <UndoIcon />
                </IconButton>
                <IconButton
                  onClick={handleRedo}
                  disabled={!canRedo}
                  size="small"
                >
                  <RedoIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Stack>
        <Box
          sx={{
            width: "100%",
            height: "95%",
            overflow: "auto",
          }}
        >
          {isNewJson ? (
            <JsonEditor
              data={json}
              onUpdate={() => {}}
              theme={githubLightTheme}
              searchDebounceTime={300}
              restrictEdit={true}
              restrictDelete={true}
              restrictAdd={true}
              showErrorMessages={true}
            />
          ) : (
            <JsonEditor
              data={currentData}
              onUpdate={handleJsonUpdate}
              theme={githubLightTheme}
              searchDebounceTime={300}
              restrictEdit={false}
              showErrorMessages={true}
            />
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default JsonViewer;
