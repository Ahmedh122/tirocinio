import { useNavigate } from "react-router-dom";
import {
  Box,

  Button,

  Typography,
} from "@mui/material";
import { orange, red, green, blue , purple} from "@mui/material/colors";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { CustomPagination } from "./utils/CustomPagination";
import FormatListBulletedAddIcon from "@mui/icons-material/FormatListBulletedAdd";

import SendIcon from "@mui/icons-material/Send";
import { useQuery } from "@tanstack/react-query";
import { getFilesOptions } from "../../../../lib/@tanstack/react-query/queries/get-files";



const ListaPrincipale = ()=> {
  const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(() => {
      const saved = sessionStorage.getItem("currentPageListaPrincipale");
      return saved !== null ? Number(saved) : 0;
    });
    
    const [rowsPerPage, setRowsPerPage] = useState<number>(() => {
      const saved = sessionStorage.getItem("rowsPerPageListaPrincipale");
      return saved !== null ? Number(saved) : 10;
    });
  
   
    const { data, refetch } = useQuery(getFilesOptions( {
     
      page: currentPage+ 1,
      limit: rowsPerPage,
      //sort: sorting.field,
      //sortMethod: sorting.order,
      //q: globalFilter || undefined,
      /*search: columnFilters
        .filter((filter) => filter.id !== 'status' && filter.value)
        .reduce(
          (acc, filter) => ({
            // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
            ...acc,
            [filter.id]: filter.value,
          }),
          {},
        ),
      status:
        columnFilters.find((filter: { id: string }) => filter.id === 'status')?.value &&
        Array.isArray(
          columnFilters.find((filter: { id: string }) => filter.id === 'status')?.value,
        )
          ? (
              columnFilters.find((filter: { id: string }) => filter.id === 'status')
                ?.value as string[]
            ).map((status: string) => {
              const reverseStatusMap: Record<string, string> = {
                'IN ATTESA': 'PENDING',
                'IN ELABORAZIONE': 'IN PROGRESS',
                'INCOMPLETO': 'INCOMPLETED',
                'COMPLETO': 'COMPLETED',
                'ESPORTATO': 'EXPORTED',
                'ERRORE': 'ERROR',
              };
              return reverseStatusMap[status] || status;
            })
          : undefined,
    */}));
  
   console.log('currentPage', currentPage +1);
   console.log('rowsPerPage', rowsPerPage);
   console.log('data', data);
  
    
  
   
  
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
              backgroundColor = red.A400;
              break;
            case "INCOMPLETED":
                backgroundColor =purple.A700 ;
                break;
            case "EXPORTED":
              backgroundColor = green.A700;
              break;
            case "IN PROGRESS": 
                backgroundColor = blue.A700;
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
        renderCell: (params)=>{return (
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
        );},
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
            renderCell: (/*params*/) => {
              return (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent='center'
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
  
    const rows = data?.content?.map((documento) => ({
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
            justifyContent: "start",
            width:'90%',
            marginLeft:5,
            marginBottom:3
          }}
        >
          <Typography>Tutti i files</Typography>{" "}
        </Box>
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
                  refetch={refetch}
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
            }}
          />
        </Paper>
      </Box>
    );
};

export {ListaPrincipale as Component} ;