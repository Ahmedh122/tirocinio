import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Button } from "@mui/material";
 import { usePopupStateContext } from "../../../providers/popup/usePopupStateContext";
import { bindTrigger } from "material-ui-popup-state/hooks";
export function AddListButton() {

   
   
    const { popupState } = usePopupStateContext();

   
  return (
    
     <Button
     variant="text"
    
  {...bindTrigger(popupState)}
  sx={{
    minWidth: 0,
    height: 35,
    width: 35,
    borderRadius: "50%",
    backgroundColor: "white",
    "& svg": { 
      color: "#1e293b",
      fontSize: "24px" 
    },
    "&:hover": {
      backgroundColor: "#e1e3e8",
      color: "#141a21",
    },
  }}
>
  <AddRoundedIcon />
</Button>
    
  );
}
