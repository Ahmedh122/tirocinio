import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import React, { useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  Menu,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { PopupStateProvider } from "../../../providers/popup/PopupStateProvider"; // Ensure correct import
import { AddListButton } from "../../components/utils/add-list-button";
import { AddListDialog } from "../../components/utils/add-list-dialog";
import { SimpleTreeView, TreeItem2 } from "@mui/x-tree-view";
import { bindMenu, bindTrigger } from "material-ui-popup-state/hooks";
import { useNavigate } from "react-router";

const data = [
  {
    id: 1,
    nome: "List1",
  },
  {
    id: 2,
    nome: "List2",
  },
  {
    id: 3,
    nome: "List3",
  },
  {
    id: 4,
    nome: "List4",
  },
  {
    id: 5,
    nome: "6",
  },
  {
    id: 7,
    nome: "7",
  },
  {
    id: 8,
    nome: "8",
  },
  {
    id: 9,
    nome: "9",
  },
  {
    id: 10,
    nome: "10",
  },
];

export function Sidebar() {
  const navigate = useNavigate();

  const [selectedItemId, setSelectedItemId] = useState<string>(() => {
    return sessionStorage.getItem("selectedItemId") || "";
  });

  return (
    <Paper
      sx={{
        overflow: "hidden",
        marginTop: 0,       
        height: "96vh",
      }}
    >
      <Box
        sx={(theme) => ({
          paddingBlock: 1.5,
          paddingInline: "0px",
          borderBottom: `1px solid ${theme.palette.grey[200]}`,
        })}
      >
        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-start"
          height={40}
        >
          <PopupStateProvider variant="dialog">
            <AddListButton />
            <AddListDialog />
          </PopupStateProvider>
        </Stack>

        <SimpleTreeView<false>
          selectedItems={selectedItemId}
          sx={{
            overflow: "auto",
            maxHeight: "calc(100vh - 95px)",
            direction: "rtl", // This moves the scrollbar to the left
            "&::-webkit-scrollbar": {
              width: "8px", // Optional, adjust the width of the scrollbar
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0, 0, 0, 0.3)", // Optional, scrollbar thumb style
              borderRadius: "10px",
            },
          }}
        >
          <Divider />
          <TreeItem2
            itemId="lista-principale"
            sx={{
              backgroundColor:
                selectedItemId === "lista-principale"
                  ? "rgba(25, 118, 210, 0.2)" // Slightly darker blue
                  : "transparent",
            }}
            label={
              <Stack
                spacing={2}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  direction: "ltr",
                  cursor: "pointer", // show it's clickable
                  paddingBlock: 1.5,
                  paddingInline: 2,
                }}
                onClick={() => {
                  setSelectedItemId("lista-principale");
                  sessionStorage.setItem("selectedItemId", "lista-principale");
                  navigate("/AllFiles");
                }}
              >
                <Typography>Tutti i files</Typography>
              </Stack>
            }
            slotProps={{
              content: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                // TODO: investigate
                sx: {
                  padding: 0,
                  borderRadius: 0,
                  "&.Mui-selected": {
                    backgroundColor: "transparent",
                  },
                },
              },
              label: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                // TODO: investigate
                sx: {
                  paddingBlock: 1.5,
                  paddingInline: 2,
                },
              },
              iconContainer: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                // TODO: investigate
                sx: {
                  display: "none",
                },
              },
            }}
          />
          <Divider />
          <Typography sx={{direction:'ltr'}}>Liste:</Typography>
          <Divider/>
          

          {data.map((list, index) => (
            <React.Fragment key={list.id}>
              <TreeItem2
                itemId={list.id.toString()}
                sx={{
                  backgroundColor:
                    selectedItemId === list.id.toString()
                      ? "rgba(25, 118, 210, 0.2)"
                      : "transparent",
                }}
                label={
                  <Stack
                    spacing={2}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      direction: "ltr",
                      cursor: "pointer",
                      paddingBlock: 1.5,
                      paddingInline: 2,
                    }}
                    onClick={() => {
                      setSelectedItemId(list.id.toString());
                      sessionStorage.setItem(
                        "selectedItemId",
                        list.id.toString()
                      );
                      navigate(`/List/${list.nome}/${list.id}`);
                    }}
                  >
                    <Typography>{list.nome}</Typography>
                    <PopupStateProvider variant="popover">
                      {({ popupState: menuPopupState }) => (
                        <>
                          <IconButton
                            {...bindTrigger(menuPopupState)}
                            onClick={(event) => {
                              bindTrigger(menuPopupState).onClick(event);
                              event.stopPropagation();
                            }}
                          >
                            <MoreHorizRoundedIcon />
                          </IconButton>
                          <Menu
                            {...bindMenu(menuPopupState)}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "center",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "center",
                            }}
                            slotProps={{
                              paper: {
                                sx: {
                                  minWidth: 150,
                                },
                              },
                            }}
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                            disableAutoFocusItem
                            autoFocus={false}
                            disableAutoFocus
                          />
                        </>
                      )}
                    </PopupStateProvider>
                  </Stack>
                }
                slotProps={{
                  content: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    // TODO: investigate
                    sx: {
                      padding: 0,
                      borderRadius: 0,
                      "&.Mui-selected": {
                        backgroundColor: "transparent",
                      },
                    },
                  },
                  label: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    // TODO: investigate
                    sx: {
                      paddingBlock: 1.5,
                      paddingInline: 2,
                    },
                  },
                  iconContainer: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    // TODO: investigate
                    sx: {
                      display: "none",
                    },
                  },
                }}
              />
              {index < data.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </SimpleTreeView>
      </Box>
    </Paper>
  );
}
