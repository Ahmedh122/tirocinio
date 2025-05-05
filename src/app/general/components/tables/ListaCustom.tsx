import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  InputBase,
  Stack,
  styled,
  Typography,
} from "@mui/material";
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
import { useEffect, useState } from "react";
import { CustomPagination } from "./utils/CustomPagination";
import FormatListBulletedAddIcon from "@mui/icons-material/FormatListBulletedAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { useQuery } from "@tanstack/react-query";
import { getListOptions } from "../../../../lib/@tanstack/react-query/queries/get-single-list";
import { PopupStateProvider } from "../../../../providers/popup/PopupStateProvider";
import { bindTrigger } from "material-ui-popup-state/hooks";
import { AddFilesToListMenu } from "../tables/utils/add-files-to-list-dialog";
import SearchIcon from "@mui/icons-material/Search";
import { FilterMenu } from "./utils/Filter-dialog";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { DeleteFileFromListDialog } from "./utils/delete-files-from-list-dialog";

import { ActionsComponent } from "../../../utils/actions-component";
import { GetListParams } from "../../../../lib/@tanstack/react-query/queries/get-files";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
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
const defaultTheme = createTheme();

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

const ListaCustom = () => {
  const navigate = useNavigate();
  const { id, nome } = useParams();

  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const saved = sessionStorage.getItem(`currentPage${id}`);
    return saved !== null ? Number(saved) : 0;
  });

  const [rowsPerPage, setRowsPerPage] = useState<number>(() => {
    const saved = sessionStorage.getItem(`rowsPerPage${id}`);
    return saved !== null ? Number(saved) : 10;
  });
  const [selectStat, setSelectStat] = useState<string[]>(() => {
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

  useEffect(() => {
    if (id) {
      const savedPage = sessionStorage.getItem(`currentPage${id}`);
      const savedRows = sessionStorage.getItem(`rowsPerPage${id}`);
      const savedGlobal = sessionStorage.getItem(`globalFilter${id}`);
      const savedStats = sessionStorage.getItem(`statusFilter${id}`);

      setCurrentPage(savedPage !== null ? Number(savedPage) : 0);
      setRowsPerPage(savedRows !== null ? Number(savedRows) : 10);
      setGlobalFilter(savedGlobal !== null ? savedGlobal : "");

      try {
        setSelectStat(savedStats !== null ? JSON.parse(savedStats) : []);
      } catch {
        setSelectStat([]);
      }

      sessionStorage.removeItem("selectedFileIds");
      setSelectedFileIds([]);
    }
  }, [id]);

  const { data, refetch } = useQuery(
    getListOptions({
      id: id ?? "",
      page: currentPage + 1,
      limit: rowsPerPage,
      q: globalFilter || undefined,
      status: selectStat.length > 0 ? selectStat : undefined,
    })
  );

  const [params, setParams] = useState<GetListParams>({
    id: id ?? "",
    page: currentPage + 1,
    limit: rowsPerPage,
    q: globalFilter || undefined,
    status: selectStat.length > 0 ? selectStat : undefined,
  });

  useEffect(() => {
    setParams({
      id: id ?? "",
      page: currentPage + 1,
      limit: rowsPerPage,
      q: globalFilter || undefined,
      status: selectStat.length > 0 ? selectStat : undefined,
    });
    refetch();
  }, [currentPage, rowsPerPage, refetch, globalFilter, selectStat, id]);

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
      sortable: false,
      filterable: false,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={3}
            sx={{ height: "100%", width: "100wh" }}
          >
            <PopupStateProvider variant="dialog">
              {({ popupState }) => (
                <>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      popupState.open();
                    }}
                    variant="text"
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
                        color: "red",
                      },
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                  <ThemeProvider theme={defaultTheme}>
                    <DeleteFileFromListDialog
                      id={id ?? ""}
                      fileIds={[params.value]}
                      refetch={refetch}
                      setSelectedFileIds={setSelectedFileIds}
                    />
                  </ThemeProvider>
                </>
              )}
            </PopupStateProvider>

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

  const rows = data?.content.map((documento) => ({
    id: documento._id,
    Nome: documento.pdf.originalname,
    Stato: documento.status,
    Azioni: documento._id,
  }));

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
          paddingLeft: 6,
          width: "95%",
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
          Lista: {nome}
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width="60%"
          gap={2}
          marginRight={4}
        >
          <Box
            sx={{
              position: "relative",
              borderRadius: "7px",
              boxShadow: 6,
              backgroundColor: "#141a21",
              width: 400,
              height: 60,
              ml: "-3px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <Box
              sx={{
                position: "absolute",
                top: 5,
                right: 8,
                color: "white",
                cursor: "pointer",
                
              }}
              onClick={() => {
                setGlobalFilter("");
                sessionStorage.setItem(`globalFilter${id}`, "");
                refetch();
              }}
            >
              <FontAwesomeIcon icon={faXmark}  />
            </Box>
            <StyledInputBase
              placeholder="Search…"
              value={globalFilter}
              onChange={(
                event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => {
                const newValue = event.target.value;
                setGlobalFilter(newValue);
                sessionStorage.setItem(`globalFilter${id}`, newValue);

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
                    backgroundColor: selectStat.length > 0 ? "#141a21" : "white",
                    "&:hover": {
                      backgroundColor: "#e1e3e8",
                    },
                    "& svg": {
                      color: selectStat.length > 0 ? "white" : "#1e293b",
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
                  handleSelectStat={setSelectStat}
                  selectStat={selectStat}
                  id={id ?? ""}
                />
              </>
            )}
          </PopupStateProvider>

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
          <PopupStateProvider variant="dialog">
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
                      color: selectedFileIds.length > 0 ? "#ef233c" : "#1e293b",
                    },
                  }}
                >
                  <DeleteIcon />
                </Button>

                <DeleteFileFromListDialog
                  id={id ?? ""}
                  fileIds={selectedFileIds}
                  refetch={refetch}
                  setSelectedFileIds={setSelectedFileIds}
                />
              </>
            )}
          </PopupStateProvider>
          <ActionsComponent
            listId={id ?? ""}
            fileIds={selectedFileIds}
            params={params}
            setSelectedFileIds={setSelectedFileIds}
          />
        </Stack>
      </Box>
      <ThemeProvider theme={darkTheme}>
        <Paper sx={{ width: "90%", maxHeight: "90vh" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={{ page: currentPage, pageSize: rowsPerPage }}
            paginationMode="server"
            rowCount={data?.totalItems ?? 0}
            checkboxSelection
            disableRowSelectionOnClick
            rowSelectionModel={
              rows?.length
                ? rows
                    .map((row) => row.id)
                    .filter((id) => selectedFileIds.includes(id))
                : []
            }
            onRowSelectionModelChange={(newSelection) => {
              const currentIds = newSelection as string[];
              if (!rows || rows.length === 0) return;
              const idsFromOtherPages = selectedFileIds.filter(
                (id) => !rows.some((row) => row.id === id)
              );
              const newSelected = Array.from(
                new Set([...idsFromOtherPages, ...currentIds])
              );

              setSelectedFileIds(newSelected);
              sessionStorage.setItem(
                "selectedFileIds",
                JSON.stringify(newSelected)
              );
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
                  ListId={id}
                />
              ),
            }}
            hideFooterSelectedRowCount
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
            }}
          />
        </Paper>
      </ThemeProvider>
      <Box
        width={"90%"}
        height={80}
        display={"flex"}
        alignItems={"center"}
        paddingLeft={2}
      >
        <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" ,  userSelect: "none" }}>
          File selzionati: {selectedFileIds.length}
        </Typography>{" "}
        <Button
          onClick={() => {
            sessionStorage.removeItem("selectedFileIds");
            setSelectedFileIds([]);
          }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            marginLeft: 4,
            padding: 1,
            //fontWeight: "bold",
            backgroundColor: selectedFileIds.length > 0 ? "#adb5bd" : "#6c757d",
            borderRadius: "4px !important",
            "&:hover": { backgroundColor: "#6c757d" },
          }}
        >
          <Typography variant="body2" sx={{ position: "relative", top: "1px",  userSelect: "none"  }}>
            Unselect
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};

export { ListaCustom as Component };
