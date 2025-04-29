import { Box, Popover, Stack, Typography } from "@mui/material";
import { bindMenu } from "material-ui-popup-state/hooks";

import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { PopupStateProvider } from "../../../providers/popup/PopupStateProvider";
import { EditListName } from "../../general/utils/edit-list-name-dialog";
import { bindTrigger } from "material-ui-popup-state/hooks";
import { DeleteListDialog } from "../../general/utils/delete-list-dialog";
import { useState, useEffect } from "react";
type ListMenuProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  popupState: any;
  id: string ;
  setSelectedItemId: (id : string)=>void;
  anchorEl: HTMLButtonElement | null;
};
export function ListMenu({ popupState , id, setSelectedItemId, anchorEl }: ListMenuProps) {


  
    const [openUpward, setOpenUpward] = useState(false);

    useEffect(() => {
      if (popupState.isOpen && anchorEl) {
        const rect = anchorEl.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setOpenUpward(spaceBelow < 200);
      }
    }, [popupState.isOpen, anchorEl]);
  




  return (
    <Popover
      {...bindMenu(popupState)}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: openUpward ? "top" : "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: openUpward ? "bottom" : "top",
        horizontal: "center",
      }}
      PaperProps={{
        sx: {
          backgroundColor: "transparent",
          boxShadow: "none",
          overflow: "visible",
          border: "none",
        },
      }}
    >
      <Box   sx={{ position: "relative", mt: 2 }}>
        {/* Arrow */}
        <Box
          sx={{
            position: "absolute",
            top: openUpward ? "auto" : -10,
            bottom: openUpward ? -10 : "auto",
            left: "calc(50% - 10px)",
            width: 20,
            height: 20,
            backgroundColor: "white",
            transform: "rotate(45deg)",
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            py: 2,
            paddingBottom: 3,
            borderRadius: 2,
            backgroundColor: "white",
            boxShadow: 3,
            width: 200,
          }}
        >
          <Stack direction={"column"} sx={{ marginTop: 1 }}>
            <PopupStateProvider variant="dialog">
              {({ popupState }) => (
                <>
                  <Stack
                    {...bindTrigger(popupState)}
                    direction={"row"}
                    sx={{
                      alignItems: "center",
                      gap: 3,
                      height: 60,
                      paddingLeft: 2,
                      "&:hover": {
                        backgroundColor: "#c3c6d1",
                      },
            
                    }}
                  >
                    {" "}
                    <FontAwesomeIcon icon={faPen} />{" "}
                    <Typography sx={{ fontWeight: "bold" }}>
                      Edit name
                    </Typography>
                  </Stack>
                  <EditListName id={id}/>
                </>
              )}
            </PopupStateProvider>
            <PopupStateProvider variant="dialog">
              {({ popupState }) => (
                <>
                  <Stack
                    {...bindTrigger(popupState)}
                    direction={"row"}
                    sx={{
                      alignItems: "center",
                      gap: 3,
                      height: 60,
                      paddingLeft: 2,
                      "&:hover": {
                        backgroundColor: "#c3c6d1",
                      },
                    
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    <Typography sx={{ fontWeight: "bold" }}>
                      Delete list
                    </Typography>
                  </Stack>
                  <DeleteListDialog  id={id} setSelectedItemId={setSelectedItemId}/>
                </>
              )}
            </PopupStateProvider>
          </Stack>
        </Box>
      </Box>
    </Popover>
  );
}
