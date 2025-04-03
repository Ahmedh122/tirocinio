import DeleteIcon from "@mui/icons-material/Delete";
import CircleIcon from "@mui/icons-material/Circle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,

  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";




const FornitoriTable = ()=> {
  const navigate = useNavigate();

  const documenti = [
    {
      id: "1",
      nome: "RelazioneAnnuale2024.pdf",
    },
    {
      id: "2",
      nome: "PreventivoQ1.pdf",
    },
    {
      id: "3",
      nome: "NoteRiunione.pdf",
    },
    
    {
      id: "3",
      nome: "NoteRiunione.pdf",
    },

    {
      id: "4",
      nome: "ContrattoFornitore.pdf",
    },
    {
      id: "5",
      nome: "PianoMarketing.pdf",
    },
  ];


  const handleRowClick = (id: string) => {
    navigate(`/document/${id}`);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
      <TableContainer
        component={Paper}
        sx={{ width: "90%", maxHeight: "90vh" }}
      >
        <Table stickyHeader={true} >
          <TableHead
            sx={{
              position: "sticky",
              top: 0,
              backgroundColor: "background.paper", // Ensure header is on top of the scrollable body
              zIndex: 1,
            }}
          >
            <TableRow>
              <TableCell sx={{ width: "20%" }}>Codice</TableCell>
              <TableCell sx={{ width: "60%" }}>Nome</TableCell>
              <TableCell align="center" sx={{ width: "20%" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            
          >
            {documenti.length === 0 ? (
              <TableRow>
                <TableCell align="center">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "100px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "grey.500",
                        fontStyle: "italic",
                      }}
                    >
                      Nessun Documento
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              documenti.map((item, index) => (
                <TableRow
                  key={item.id}
                  onClick={() => handleRowClick(item.id)}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.03)",
                      transition: "background-color 0.2s ease-in-out",
                    },
                    cursor: "default",
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <CircleIcon sx={{ color: "#e91e63", fontSize: 10 }} />
                      <div>{index}</div>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "grey.500",
                          fontStyle: "italic",
                        }}
                      >
                        {item.nome}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", justifyContent: "center", gap: 2 }}
                    >
                      <IconButton
                        aria-label="access"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <AccessTimeIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FornitoriTable;