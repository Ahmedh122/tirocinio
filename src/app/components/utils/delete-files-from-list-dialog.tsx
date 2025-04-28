import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
  } from "@mui/material";
  import { usePopupStateContext } from "../../../providers/popup/usePopupStateContext";
  import { bindDialog } from "material-ui-popup-state/hooks";

  
  

import { useDeleteFileList } from "../../../lib/@tanstack/react-query/mutations/delete-file-from-list-mutation";
  
  type DeleteFileFromListDialogProps = {
    id: string ;
    fileIds: string[]
  };
  
  export function DeleteFileFromListDialog({
    id,
   fileIds
  }: DeleteFileFromListDialogProps) {

    const deleteFilesLista = useDeleteFileList(id, {  
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
            height: "22vh",
            maxHeight: "none",
            borderRadius: "20px !important",
            
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", position: "relative",  justifyContent: "center"}}><Typography variant="h5" sx={{fontWeight: "bold"}} >{fileIds.length === 1 ?"Sicuro di cancellare il file dalla lista?": "Sicuro di cancellare i files dalla lista?"}</Typography></DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            position: "relative",
  
            height: "calc(100% - 20px)",
            overflowY: "auto",
          }}
        >
          <Stack
            direction={"column"}
            height={"100%"}
            width={"100%"}
    
          >
            <Stack direction={"row"} justifyContent={"center"} height={"40%"}>
              <Typography variant="h6" sx={{color: "grey.700", textAlign:"center"}} justifyContent={"center"}>{fileIds.length === 1?"Eliminando questo file, verra rimosso definitivamente dalla lista. Questa azione non può essere annullata." :"Eliminando questi files, verranno rimossi definitivamente dalla lista. Questa azione non può essere annullata." }  </Typography>
            </Stack>
            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"end"}
              
              gap={4}
              height={"60%"}
            >
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  deleteFilesLista.mutate({fileIds});
                }}
                sx={{ width: "30%", height: "60%", marginBottom:4 ,  backgroundColor:"#776BB2",  borderRadius: "14px !important", "&:hover":{backgroundColor:"#ad5cd1"}}}
              >
                {" "}
                <Typography sx={{ fontWeight: "bold" , color: 'white'}}>Cancella</Typography>
              </Button>
              <Button
                onClick={() => {
                  popupState.close();
                }}
                sx={{ width: "30%", height: "60%" , marginBottom:4, backgroundColor:"#c3c6d1",  borderRadius: "14px !important",  "&:hover":{backgroundColor:"#858ead"} }}
              >
                <Typography sx={{ fontWeight: "bold" , color: 'white'}}>Annulla</Typography>
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    );
  }
  