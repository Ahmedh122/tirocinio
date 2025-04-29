import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";
  import { usePopupStateContext } from "../../../providers/popup/usePopupStateContext";
  import { bindDialog } from "material-ui-popup-state/hooks";
  import React, { useState } from "react";
 
  import CloseIcon from "@mui/icons-material/Close";
import { useModifyList } from "../../../lib/@tanstack/react-query/mutations/modify-list-mutation";
  
type EditListNameProps ={
    id : string 
}


  export function EditListName({id}: EditListNameProps) {
    const [nomeLista, setNomeLista] = useState<string>();
    const modifyLista = useModifyList(id, {
       onSuccess: () => {
         popupState.close();
       },
     });
    const { popupState } = usePopupStateContext();
  
    return (
      <Dialog
        {...bindDialog(popupState)}
        onClose={(event: React.MouseEvent<HTMLElement>) => {
          bindDialog(popupState).onClose(event);
        }}
        maxWidth="sm"
        fullWidth
        scroll="body"
        sx={{
          "& .MuiDialog-paper": {
            overflow: "visible", 
            position: "relative",
            height: "20vh", 
            maxHeight: "none", 
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", position: "relative" }}>
         <Typography  variant="h5"
                component="h1"
                sx={{
                  color: "grey.700",
                  fontStyle: "italic",
                }}>Cambia nome lista</Typography> 
          <Button
          onClick={()=>{popupState.close()}}
            sx={{
              position: "absolute",
              top: -12,
              right: -12,
              zIndex: 1,
              minWidth: "auto",
              padding: 0.5,
              borderRadius: "50%",
              backgroundColor: "white",
              boxShadow: 3,
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
              "& svg": {
                color: "grey",
              },
              "&:hover svg": {
                color: "red",
              },
            }}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            position: "relative",
            
            height: "calc(100% - 66px)",
            overflowY: "auto",
          }}
        >
          <Stack display="flex" direction="column" marginTop={3}>
            <Typography variant="h6" sx={{fontWeight: 'semibold'}}>Nome: </Typography>
            <TextField
            sx={{width: '30vh'}}
              onChange={(
                event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => {
                setNomeLista(event.target.value);
              }}
            />
          </Stack>
          <Button
            sx={{ display: "flex", position: "absolute", bottom: 0, right: 4 }}
            onClick={(event) => {
              event.preventDefault();
              if (!nomeLista) return;
              modifyLista.mutate({ name: nomeLista , fileIds:[]});
            }}
          >
            {" "}
           <Typography sx={{fontWeight: 'bold'}}>Cambia</Typography> 
          </Button>
        </DialogContent>
      </Dialog>
    );
  }
  