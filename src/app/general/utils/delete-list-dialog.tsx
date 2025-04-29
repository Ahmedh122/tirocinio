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
import { useNavigate } from "react-router";


import { useDeleteList } from "../../../lib/@tanstack/react-query/mutations/delete-list-mutation";

type DeleteListDialogProps = {
  id: string;
  setSelectedItemId: (id: string) => void;
};

export function DeleteListDialog({
  id,
  setSelectedItemId,
}: DeleteListDialogProps) {
  const navigate = useNavigate();
  const cancellaLista = useDeleteList(id, {
    onSuccess: () => {
      popupState.close();
      setSelectedItemId("Home");
      sessionStorage.setItem("selectedItemId", "Home");
      navigate("/AllFiles");
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
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", position: "relative",  justifyContent: "center"}}><Typography variant="h5" sx={{fontWeight: "bold"}} >Sicuro di cancellare la lista?</Typography></DialogTitle>
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
            <Typography variant="h6" sx={{color: "grey.700", textAlign:"center"}} justifyContent={"center"}>Eliminando questa lista, verrà rimossa definitivamente dalla tua raccolta. Questa azione non può essere annullata.  </Typography>
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
                cancellaLista.mutate();
              }}
              sx={{ width: "30%", height: "60%", marginBottom:4 ,  backgroundColor:"#776BB2",  "&:hover":{backgroundColor:"#8338ec"}}}
            >
              {" "}
              <Typography sx={{ fontWeight: "bold" }}>Cancella</Typography>
            </Button>
            <Button
              onClick={() => {
                popupState.close();
              }}
              sx={{ width: "30%", height: "60%" , marginBottom:4, backgroundColor:"#adb5bd",  "&:hover":{backgroundColor:"#6c757d"} }}
            >
              <Typography sx={{ fontWeight: "bold" }}>Annulla</Typography>
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
