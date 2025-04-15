

import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { usePopupStateContext } from "../../../providers/popup/usePopupStateContext";
import { bindDialog } from "material-ui-popup-state/hooks";
import React from "react";





export function AddListDialog() {

    const {popupState} = usePopupStateContext()

 return(
    <Dialog {...bindDialog(popupState)}
    onClose={(event: React.MouseEvent<HTMLElement>)=>{bindDialog(popupState).onClose(event)}}
    maxWidth="sm"
    fullWidth
    scroll="body">
        <DialogTitle
       >
        Aggiungi lista
        </DialogTitle>
        <DialogContent>
            <TextField/>
        </DialogContent>
  
    </Dialog>
 )



}



