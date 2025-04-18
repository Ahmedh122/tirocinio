import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { orange, red, green, purple, blue, yellow } from "@mui/material/colors";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { CustomPagination } from "./utils/CustomPagination";
import FormatListBulletedAddIcon from "@mui/icons-material/FormatListBulletedAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import {  useQuery } from "@tanstack/react-query";
import { getListOptions } from "../../../../lib/@tanstack/react-query/queries/get-single-list";
import { useDeleteFileList } from "../../../../lib/@tanstack/react-query/mutations/delete-file-from-list-mutation";

const ListaCustom = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  useEffect(() => {
    if (id) {
      const savedPage = sessionStorage.getItem(`currentPage${id}`);
      const savedRows = sessionStorage.getItem(`rowsPerPage${id}`);

      setCurrentPage(savedPage !== null ? Number(savedPage) : 0);
      setRowsPerPage(savedRows !== null ? Number(savedRows) : 10);
    }
  }, [id]);

  const { data, refetch} = useQuery({
    ...getListOptions({ id: id ?? "", page: currentPage + 1, limit: rowsPerPage }),
    enabled: !!id,
    
  });

 const deleteFile = useDeleteFileList(id ?? '',{onSuccess:()=>{refetch()}}) ;
  

  

  const columns: GridColDef[] = [
    {
      field: "Stato",
      headerName: "Stato",
      renderCell: (params) => {
        let backgroundColor;

        switch (params.value) {
          case "PENDING":
            backgroundColor = orange.A400;
            break;
          case "DEBUG":
            backgroundColor = yellow.A400;
            break;
          case "INCOMPLETED":
            backgroundColor = purple.A700;
            break;
          case "EXPORTED":
            backgroundColor = green.A700;
            break;
          case "IN PROGRESS":
            backgroundColor = blue.A700;
            break;
          case "ERROR":
            backgroundColor = red.A700;
            break;
          default:
            backgroundColor = "white";
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
      width: 200,
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
      width: 550,
    },

    {
      field: "Azioni",
      headerName: "Azioni",
      width: 200,
      sortable: false,
      filterable: false,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ height: "100%", width: "100wh" }}
          >
            <Button
              variant="text"
              onClick={(event) => {
                event.stopPropagation();
              }}
              sx={{
                "& svg": {
                  color: "grey",
                },
                "&:hover svg": {
                  color: "orange",
                },
              }}
            >
              <FormatListBulletedAddIcon />
            </Button>
            <Button
              variant="text"
              onClick={(event) => {
                event.stopPropagation();
                deleteFile.mutate({ fileIds: [params.value] })
              }}
              sx={{
                "& svg": {
                  color: "grey",
                },
                "&:hover svg": {
                  color: "red",
                },
              }}
            >
              <DeleteIcon  />
            </Button>
            <Button
              variant="text"
              onClick={(event) => {
                event.stopPropagation();
              }}
              sx={{
                "& svg": {
                  color: "grey",
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
        justifyContent: "center",
        marginTop: 2,
        padding: 2,
      }}
    >
      <Paper sx={{ width: "90%", maxHeight: "90vh" }}>
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
              (event.target as HTMLElement).closest(".MuiDataGrid-cellCheckbox")
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
                refetch={refetch}
                ListId={id}
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
          }}
        />
      </Paper>
    </Box>
  );
};

export { ListaCustom as Component };
