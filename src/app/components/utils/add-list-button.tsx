import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Button } from "@mui/material";
 import { usePopupStateContext } from "../../../providers/popup/usePopupStateContext";
import { bindTrigger } from "material-ui-popup-state/hooks";
export function AddListButton() {

   
   
    const { popupState } = usePopupStateContext();

   
  return (
    <>
      <Button
        size="small"
        startIcon={<AddRoundedIcon sx={{ position: "relative", top: "-1px" }}/>}
        {...bindTrigger(popupState)}
        sx={{
          display:'flex',
          textAlign:'start',
          backgroundColor: "transparent",
          color: "primary.main",
          "&:hover": {
            backgroundColor: "transparent",
            color: "darkblue",
          },
        }}

      >
        Nuova lista
      </Button>
    </>
  );
}
