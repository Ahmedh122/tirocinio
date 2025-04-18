import {
  Typography,
  TextField,
  Stack,
  Button,
  InputBase,
  Box,
  Popover,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { useCreateList } from "../../../lib/@tanstack/react-query/mutations/create-list-mutation";
import { useQuery } from "@tanstack/react-query";
import { getListsOptions } from "../../../lib/@tanstack/react-query/queries/get-lists";
import React, { useEffect, useState } from "react";
import { bindMenu } from "material-ui-popup-state/hooks";
import { CustomScrollbar } from "./CustomScrollBar";
import DoneIcon from "@mui/icons-material/Done";
import ListIcon from "@mui/icons-material/List";
import { useModifyList } from "../../../lib/@tanstack/react-query/mutations/modify-list-mutation";

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  position: "absolute",
  height: "100%",
  display: "flex",
  alignItems: "center",
  pointerEvents: "none",
  "& svg": {
    color: "white",
  },
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#ffffff",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    color: "#ffffff",
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    fontSize: "1.3rem",
    "&::placeholder": {
      color: "#94a3b8", // light slate for placeholder
      opacity: 1,
      fontSize: "1.3rem", // keep visible
    },
  },
}));

export function AddFilesToListMenu({
  popupState,
  fileIds,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  popupState: any;
  fileIds: string[];
}) {
  const [nomeLista, setNomeLista] = useState<string>("");
  const [idLista, setIdLista] = useState<string>("");
  const [search, setSearch] = useState("");

  const creaLista = useCreateList({
    onSuccess: () => {
      popupState.close();
    },
  });
  const modifyLista = useModifyList(idLista, {
    onSuccess: () => {
      popupState.close();
    },
  });

  const { data: queryLists } = useQuery(getListsOptions());

  const filteredLists = queryLists?.filter((list) =>
    list.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    console.log("idLista", idLista);
  });

  return (
    <Popover
      {...bindMenu(popupState)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      PaperProps={{
        sx: {
          minWidth: 350,
          p: 2,
        },
      }}
    >
      <Box
        sx={{
          fontSize: "1.25rem",
          fontStyle: "italic",
          color: "grey.700",
          mb: 1,
        }}
      >
        Aggiungi files
      </Box>

      <Stack spacing={2}>
        <TextField
          placeholder="Nome lista"
          value={nomeLista}
          onChange={(
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            setNomeLista(event.target.value);
            setIdLista("");
          }}
        />
        <Stack>
          <Box
            sx={{
              position: "relative",
              borderTopLeftRadius: 7,
              borderTopRightRadius: 7,
              transition: "all 0.3s ease",
              borderBottomLeftRadius: filteredLists && filteredLists.length ? 4 : 7 ,
              borderBottomRightRadius: filteredLists && filteredLists.length ? 4 : 7 ,
              boxShadow: 6,
              backgroundColor: "#1f2733",
              width: "98%",
              height: 60,
              ml: "-3px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIdLista("");
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </Box>
          {filteredLists && filteredLists.length >0 && (
          <CustomScrollbar height={400} dependency={filteredLists.length}>
            <Box
              sx={{
                backgroundColor: "#334155", // darker slate blue-gray
                color: "white",
                py: 0.5,
                transition: "all 1s ease"
              }}
            >
              {filteredLists?.map((list) => (
                <Box key={list._id} sx={{ px: 1, py: 0.5 }}>
                  <Stack
                    direction="row"
                    sx={{
                      position: "relative",
                      alignItems: "center",
                      py: 3,
                      px: 2,
                      borderRadius: 1,
                      backgroundColor:
                        idLista === list._id ? "#1e293b" : "transparent", // selected is slightly brighter now
                      transition: "background-color 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#475569", // a mid-tone hover, less harsh
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      setIdLista(list._id);
                      setNomeLista("");
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        "& svg": {
                          color: "#acb3bf",
                        },
                      }}
                    >
                      <ListIcon />
                    </Box>
                    <Typography
                      sx={{ color: "#e1e3e8", fontWeight: "bold", ml: 1 }}
                    >
                      {list.name}
                    </Typography>

                    {idLista === list._id && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: 30,
                          height: 30,
                          backgroundColor: "#1DD760",
                          borderRadius: "50%",
                          position: "absolute",
                          right: 35,
                          "& svg": {
                            color: "#1e293b", // match container background
                          },
                        }}
                      >
                        <DoneIcon />
                      </Box>
                    )}
                  </Stack>
                </Box>
              ))}
            </Box>
          </CustomScrollbar>)}
        </Stack>

        <Button
          variant="contained"
          disabled={!(idLista || nomeLista)}
          onClick={() => {
            if (!idLista) {
              creaLista.mutate({ name: nomeLista, fileIds });
            } else {
              modifyLista.mutate({ fileIds }); 
            }
          }}
        >
          Aggiungi
        </Button>
      </Stack>
    </Popover>
  );
}
