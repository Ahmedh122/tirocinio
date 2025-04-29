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
import { useCreateList } from "../../../../../lib/@tanstack/react-query/mutations/create-list-mutation";
import { useQuery } from "@tanstack/react-query";
import { getListsOptions } from "../../../../../lib/@tanstack/react-query/queries/get-lists";
import React, {  useState } from "react";
import { bindMenu } from "material-ui-popup-state/hooks";
import { CustomScrollbar } from "../../../../utils/CustomScrollBar";
import DoneIcon from "@mui/icons-material/Done";
import ListIcon from "@mui/icons-material/List";
import { useModifyList } from "../../../../../lib/@tanstack/react-query/mutations/modify-list-mutation";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

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

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#ffffff",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    color: "#ffffff",
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    fontSize: "1.3rem",
    "&::placeholder": {
      color: "#94a3b8", 
      opacity: 1,
      fontSize: "1.3rem", 
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
  const [newList, setNewList ] = useState(false);
  

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

 

  return (
    <Popover
  {...bindMenu(popupState)}
  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  transformOrigin={{ vertical: "top", horizontal: "center" }}
  PaperProps={{
    sx: {
      backgroundColor: "transparent",
      boxShadow: "none",
      overflow: "visible",
      border: 'none'
    },
  }}
>
  <Box sx={{ position: "relative", mt: 2 }}>
    {/* Arrow */}
    <Box
      sx={{
        position: "absolute",
        top: -10,
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
        p: 2,
        borderRadius: 2,
        backgroundColor: "white",
        boxShadow: 3,
        width: 350,
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
       
        <Stack>
          <Box
            sx={{
              position: "relative",
              borderTopLeftRadius: 7,
              borderTopRightRadius: 7,
              transition: "all 0.3s ease",
              borderBottomLeftRadius: filteredLists && filteredLists.length  && !newList ? 4 : 7 ,
              borderBottomRightRadius: filteredLists && filteredLists.length && !newList  ? 4 : 7 ,
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
              onClick={()=>{setNewList(false)}}
            />
          </Box>
          {filteredLists && filteredLists.length >0 && !newList &&(
          <CustomScrollbar height={400} dependency={filteredLists.length}>
            <Box
              sx={{
                backgroundColor: "#334155", 
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
                        idLista === list._id ? "#1e293b" : "transparent", 
                      transition: "background-color 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#475569", 
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
                            color: "#1e293b", 
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
        <Stack spacing={1}>
          <Button  size="small"
        startIcon={<AddRoundedIcon sx={{ position: "relative", top: "-1px" }}/>}
        
        sx={{
          display:'flex',
          textAlign:'start',
          backgroundColor: "transparent",
          justifyContent: 'start',
          color: "primary.main",
          "&:hover": {
            backgroundColor: "transparent",
            color: "darkblue",
          },
        }}
        onClick={()=>{setNewList(!newList)}}
        >Crea nuova lista</Button>
        {newList && (
        <TextField
          placeholder="Nome lista"
          value={nomeLista}
          onChange={(
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            setNomeLista(event.target.value);
            setIdLista("");
          }}
        />)}</Stack>
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
    </Box>
  </Box>
</Popover>
  
  );
}
