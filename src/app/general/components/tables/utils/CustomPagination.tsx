
import { Pagination, Select, MenuItem, Box, Typography, SelectChangeEvent, Stack } from "@mui/material";

type CustomPaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  rowsPerPage: number;
  pageSizeOptions: number[];
  onPageChange: (value: number) => void;
  onRowsPerPageChange: (value: number) => void;
  
  ListId: string | undefined;
};

export const CustomPagination = ({
  page,
  totalPages,
  totalItems,
  rowsPerPage,
  pageSizeOptions,
  onPageChange,
  onRowsPerPageChange,
  
  ListId,
}: CustomPaginationProps) => {
  
  // Handle page change
  const handlePageChange = async (_event: React.ChangeEvent<unknown>, value: number) => {
   
    const newPage = value - 1; // Subtract 1 because page 1 is index 0 in React state
    onPageChange(newPage);
    sessionStorage.setItem(`currentPage${ListId}`, newPage.toString());
    
  
  };
  
  // Handle rows per page change
  const handleRowsPerPageChange = async (event: SelectChangeEvent<number>) => {
    const newRowsPerPage = Number(event.target.value);
    onRowsPerPageChange(newRowsPerPage);
    sessionStorage.setItem(`rowsPerPage${ListId}`, newRowsPerPage.toString());
    sessionStorage.setItem(`currentPage${ListId}`, "0");
    onPageChange(0)
  };


  


  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" padding={1} width="100%" sx={{backgroundColor: '#141a21'}}>
      <Box display="flex" alignItems="center" padding={0}>
        <Typography variant="body1" marginLeft={1}>
          Total Pages: {totalPages}{" "}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" padding={0}>
        <Typography variant="body1" marginRight={2}>
          Total Items: {totalItems}{" "}
        </Typography>
        <Stack direction="row" display="flex" alignItems="center">
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            size="small"
            sx={{ marginRight: 1 }}
          >
            {pageSizeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>{" "}
          <Typography>/ page</Typography>{" "}
        </Stack>

        <Pagination
          color="primary"
          count={totalPages}
          page={page + 1}
          onChange={handlePageChange}
          showFirstButton
          showLastButton
          siblingCount={1}
          boundaryCount={0}
          sx={{
            '& .MuiPaginationItem-root.Mui-selected': {
              backgroundColor: 'white',
              color: '#1976d2', 
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};
