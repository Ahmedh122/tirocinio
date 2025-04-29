import { Box, Popover, Stack, Typography, Checkbox } from "@mui/material";
import { bindMenu } from "material-ui-popup-state/hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

type FilterMenuProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  popupState: any;
  handleSelectStat: (selectedStatuses: string[]) => void;
  setSearchSaved: (search : boolean)=> void
};

export function FilterMenu({ popupState, handleSelectStat, setSearchSaved }: FilterMenuProps) {
  const statuses = [
    "COMPLETED",
    "EXPORTED",
    "ERROR",
    "INCOMPLETED",
    "DEBUG",
    "PENDING",
    "IN PROGRESS",
  ];
  const { id } = useParams();
  const [checkedStatuses, setCheckedStatuses] = useState<
    Record<string, boolean>
  >(Object.fromEntries(statuses.map((status) => [status, false])));
  useEffect(() => {
    const raw = sessionStorage.getItem(`statusFilter${id}`);
    try {
      const savedStatuses = raw ? (JSON.parse(raw) as string[]) : [];
      const newChecked = Object.fromEntries(
        statuses.map((status) => [status, savedStatuses.includes(status)])
      );
      setCheckedStatuses(newChecked);
    } catch {
      // fall back to all false if parsing fails
    }
  }, [id]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    status: string
  ) => {
    const updated = {
      ...checkedStatuses,
      [status]: event.target.checked,
    };
    setCheckedStatuses(updated);

    // Notify parent with selected ones
    const selected = Object.keys(updated).filter((key) => updated[key]);
    handleSelectStat(selected);
    sessionStorage.removeItem(`statusFilter${id}`);
    sessionStorage.removeItem(`globalFilter${id}`);
    sessionStorage.removeItem(`isSaved${id}`);
    setSearchSaved(false);
  };
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
          border: "none",
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
            width: 300,
          }}
        >
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Filtra per stato
            </Typography>
            {statuses.map((status) => (
              <Box key={status} display="flex" alignItems="center">
                <Checkbox
                  checked={checkedStatuses[status]}
                  onChange={(e) => handleChange(e, status)}
                />
                <Typography>{status}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Popover>
  );
}
