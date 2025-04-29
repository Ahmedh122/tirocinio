import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography, InputBase } from "@mui/material";
import {
  orange,
  red,
  green,
  blue,
  grey,
  amber,
  deepPurple,
  teal,
} from "@mui/material/colors";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { bindTrigger } from "material-ui-popup-state/hooks";
import { CustomPagination } from "./utils/CustomPagination";
import FormatListBulletedAddIcon from "@mui/icons-material/FormatListBulletedAdd";
import SavedSearchIcon from "@mui/icons-material/SavedSearch";
import SendIcon from "@mui/icons-material/Send";
import { useQuery } from "@tanstack/react-query";
import { getFilesOptions } from "../../../../lib/@tanstack/react-query/queries/get-files";
import { PopupStateProvider } from "../../../../providers/popup/PopupStateProvider";
import { AddFilesToListMenu } from "../tables/utils/add-files-to-list-dialog";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { FilterMenu } from "./utils/Filter-dialog";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#141a21", // adjust as needed
      paper: "#1e293b",
    },
    text: {
      primary: "#ffffff",
      secondary: "#94a3b8",
    },
  },
});

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
      color: "#94a3b8", // light slate for placeholder
      opacity: 1,
      fontSize: "1.3rem", // keep visible
    },
  },
}));

const ListaPrincipale = () => {

  const id = "ListaPrincipale"
  const navigate = useNavigate();
 
const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
const [currentPage, setCurrentPage] = useState<number>(() => {
  const saved = sessionStorage.getItem(`currentPage${id}`);
  return saved !== null ? Number(saved) : 0;
});

const [rowsPerPage, setRowsPerPage] = useState<number>(() => {
  const saved = sessionStorage.getItem(`rowsPerPage${id}`);
  return saved !== null ? Number(saved) : 10;
});

const [searchSaved, setSearchSaved] = useState<boolean>(() => {
  const saved = sessionStorage.getItem(`isSaved${id}`);
  try {
    return saved ? (JSON.parse(saved) as boolean) : false;
  } catch {
    return false;
  }
});


const [selectStat, handleSelectStat] = useState<string[]>(() => {
  const saved = sessionStorage.getItem(`statusFilter${id}`);
  try {
    return saved ? (JSON.parse(saved) as string[]) : [];
  } catch {
    return [];
  }
});
const [globalFilter, setGlobalFilter] = useState(() => {
  const saved = sessionStorage.getItem(`globalFilter${id}`);
  return saved !== null ? saved : "";
});

  const { data, refetch } = useQuery(
    getFilesOptions({
      page: currentPage + 1,
      limit: rowsPerPage,
      //sort: sorting.field,
      //sortMethod: sorting.order,
      q: globalFilter || undefined,
      /*search: columnFilters
        .filter((filter) => filter.id !== 'status' && filter.value)
        .reduce(
          (acc, filter) => ({
            // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
            ...acc,
            [filter.id]: filter.value,
          }),
          {},
        ),*/
      status: selectStat.length > 0 ? selectStat : undefined,
    })
  );


  useEffect(() => {
     
      refetch();
    }, [currentPage, rowsPerPage, refetch]);
 

  const columns: GridColDef[] = [
    {
      field: "Stato",
      headerName: "Stato",
      renderCell: (params) => {
        let backgroundColor;

        switch (params.value) {
          case "PENDING":
            backgroundColor = orange.A400; // Vibrant orange
            break;
          case "DEBUG":
            backgroundColor = amber.A700; // Bright amber
            break;
          case "INCOMPLETED":
            backgroundColor = deepPurple.A400; // Vivid deep purple
            break;
          case "EXPORTED":
            backgroundColor = teal.A400; // Strong teal
            break;
          case "COMPLETED":
            backgroundColor = green.A700; // Bright green
            break;
          case "IN PROGRESS":
            backgroundColor = blue.A400; // Bright blue
            break;
          case "ERROR":
            backgroundColor = red.A700; // Vivid red
            break;
          default:
            backgroundColor = grey[500]; // A bit darker for "unknown" status
            break;
        }
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Box
              sx={{
                backgroundColor,
                padding: 1,
                height: "4vh",
                borderRadius: "50px 50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  textAlign: "center",
                }}
              >
                {params.value}
              </Typography>
            </Box>
          </Box>
        );
      },
      flex: 2,
      sortable: false,
    },

    {
      field: "Nome",
      headerName: "Nome file",
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography
              sx={{
                color: "grey.500",
                fontStyle: "italic",
              }}
            >
              {params.value}
            </Typography>
          </Box>
        );
      },
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      flex: 6.7,
    },
    {
      field: "Azioni",
      headerName: "Azioni",
      flex: 3.3,
      disableColumnMenu: true,
      sortable: false,
      filterable: false,
      headerAlign: "center",
      renderCell: (/*params*/) => {
        return (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={3}
            sx={{ height: "100%", width: "100wh" }}
          >
            <Button
              variant="text"
              onClick={(event) => {
                event.stopPropagation();
              }}
              sx={{
                width: 35,
                height: 35,
                minWidth: 0,
                borderRadius: "50%",

                boxShadow: 3,
                "&:hover": { backgroundColor: "white" },
                "& svg": {
                  color: "white",
                },
                "&:hover svg": {
                  color: "#1976d2",
                },
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        );
      },
    },
  ];

  const rows =
    data?.content?.map((documento) => ({
      id: documento._id,
      Nome: documento.pdf.originalname,
      Stato: documento.status,
      Azioni: documento._id,
    })) || [];

  const pageSizeOptions = [5, 10];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 2,
        padding: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",

          width: "89%",
          marginBottom: 3,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          padding={2}
          paddingRight={8}
          sx={{
            color: "white",
            fontWeight: 600,
            backgroundColor: "#141a21",
            borderRadius: 1,
          }}
        >
          Tutti i files
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width="50%"
          gap={4}
          marginRight={4}
        >
          <Box
            sx={{
              position: "relative",
              borderRadius: "7px",
              boxShadow: 6,
              backgroundColor: "#141a21",
              width: "50%",
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
              value={globalFilter}
              onChange={(
                event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => {
                setGlobalFilter(event.target.value);
                sessionStorage.removeItem(`globalFilter${id}`);
                sessionStorage.removeItem(`statusFilter${id}`);
                sessionStorage.removeItem(`isSaved${id}`);
                setSearchSaved(false);
                refetch();
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </Box>
          <PopupStateProvider variant="popover">
            {({ popupState }) => (
              <>
                <Button
                  {...bindTrigger(popupState)}
                  variant="text"
                  sx={{
                    width: 40,
                    height: 40,
                    minWidth: 0,
                    borderRadius: "50%",
                    boxShadow: 3,
                    backgroundColor: "white",
                    "& svg": {
                      color: "#1e293b",
                    },
                    "&:hover svg": {
                      color: "black",
                    },
                  }}
                >
                  <FilterAltIcon />
                </Button>

                <FilterMenu
                  popupState={popupState}
                  handleSelectStat={handleSelectStat}
                  setSearchSaved={setSearchSaved}
                  id={id}
                />
              </>
            )}
          </PopupStateProvider>
          <Button
            variant="text"
            onClick={(event) => {
              event.stopPropagation();
              setSearchSaved((prevSaved) => {
                if (!prevSaved) {
                  sessionStorage.setItem(
                    `statusFilter${id}`,
                    JSON.stringify(selectStat)
                  );
                  sessionStorage.setItem(`globalFilter${id}`, globalFilter);
                  sessionStorage.setItem(`isSaved${id}`, JSON.stringify(true));
                } else {
                  sessionStorage.removeItem(`statusFilter${id}`);
                  sessionStorage.removeItem(`globalFilter${id}`);
                  sessionStorage.removeItem(`isSaved${id}`);
                }
                return !prevSaved;
              });
            }}
            sx={{
              width: 40,
              height: 40,
              minWidth: 0,
              borderRadius: "50%",
              boxShadow: 3,
              backgroundColor: "white",
              "& svg": {
                color: searchSaved ? "blue" : "#1e293b",
              },
              "&:hover svg": {
                color: "blue",
              },
            }}
          >
            <SavedSearchIcon />
          </Button>{" "}
          <PopupStateProvider variant="popover">
            {({ popupState }) => (
              <>
                <Button
                  {...bindTrigger(popupState)}
                  variant="text"
                  disabled={selectedFileIds.length === 0}
                  sx={{
                    width: 40,
                    height: 40,
                    minWidth: 0,
                    backgroundColor: selectedFileIds.length > 0 ? "white" : "",
                    borderRadius: "50%",
                    boxShadow: 3,
                    "& svg": {
                      color: selectedFileIds.length > 0 ? "#1e293b" : "white",
                    },
                    "&:hover svg": {
                      color: selectedFileIds.length > 0 ? "orange" : "#1e293b",
                    },
                  }}
                >
                  <FormatListBulletedAddIcon />
                </Button>

                <AddFilesToListMenu
                  popupState={popupState}
                  fileIds={selectedFileIds}
                />
              </>
            )}
          </PopupStateProvider>
        
          <Button
            variant="text"
            onClick={(event) => {
              event.stopPropagation();
            }}
            sx={{
              width: 40,
              height: 40,
              minWidth: 0,
              borderRadius: "50%",
              boxShadow: 3,
              backgroundColor: "white",
              "& svg": {
                color: "#1e293b",
              },
              "&:hover svg": {
                color: "#1976d2",
              },
            }}
          >
            <SendIcon />
          </Button>
        </Stack>
      </Box>
      <ThemeProvider theme={darkTheme}>
        <Paper sx={{ width: "90%", maxHeight: "90vh", boxShadow: 4 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={{ page: currentPage, pageSize: rowsPerPage }}
            paginationMode="server"
            rowCount={data?.totalItems ?? 0}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(newSelection) => {
              setSelectedFileIds(newSelection as string[]);
            }}
            onRowClick={(params, event) => {
              if (
                (event.target as HTMLElement).closest(
                  ".MuiDataGrid-cellCheckbox"
                )
              ) {
                return;
              }
              const fileId = params.row.id;
              navigate(`/documents/pdf/${fileId}`);
            }}
            slots={{
              pagination: () => (
                <CustomPagination
                  page={currentPage}
                  totalPages={data?.totalPages ?? 0}
                  totalItems={data?.totalItems ?? 0}
                  rowsPerPage={rowsPerPage}
                  pageSizeOptions={pageSizeOptions}
                  onPageChange={setCurrentPage}
                  onRowsPerPageChange={setRowsPerPage}
            
                  ListId="ListaPrincipale"
                />
              ),
            }}
            sx={{
              border: 0,
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
              "& .MuiDataGrid-row.Mui-selected": {
                outline: "none",
              },
              "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
                {
                  outline: "none",
                  boxShadow: "none",
                },
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "#ffffff", // White column titles
                fontWeight: 600,
              },
              "& .MuiDataGrid-cell": {
                backgroundColor: "#141a21", // Dark row and header background
                color: "#f1f5f9", // Light text
              },
            }}
          />
        </Paper>
      </ThemeProvider>
    </Box>
  );
};

export { ListaPrincipale as Component };
