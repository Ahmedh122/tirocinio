import {
  Pagination,
  Select,
  MenuItem,
  Box,
  Typography,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { QueryClient } from "@tanstack/react-query";

type CustomPaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  rowsPerPage: number;
  pageSizeOptions: number[];
  onPageChange: (value: number) => void;
  onRowsPerPageChange: (value: number) => void;
};

export const CustomPagination = ({
  page,
  totalPages,
  totalItems,
  rowsPerPage,
  pageSizeOptions,
  onPageChange,
  onRowsPerPageChange,
}: CustomPaginationProps) => {

const queryClient = new QueryClient();

  const handlePageChange = async (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    onPageChange(value - 1);await queryClient.refetchQueries({
      queryKey: ["files"],
      type: "active",
      exact: true,
    });
  };

  const handleRowsPerPageChange = async (event: SelectChangeEvent<number>) => {
    onRowsPerPageChange(Number(event.target.value)); await queryClient.refetchQueries({
      queryKey: ['files'],
      type: "active",
      exact: true,
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      padding={1}
      width="100%"
    >
      <Box display="flex" alignItems="center" padding={0}>
        <Typography variant="body1" marginLeft={1}>
          Total Pages: {totalPages}{" "}
        </Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={0}
      >
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
        />
      </Box>
    </Box>
  );
};
