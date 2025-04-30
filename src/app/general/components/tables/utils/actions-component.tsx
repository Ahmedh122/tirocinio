import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import SendIcon from "@mui/icons-material/Send";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getActionsOptions } from "../../../../../lib/@tanstack/react-query/queries/get-actions";
import { useAction } from "../../../../../lib/@tanstack/react-query/mutations/action-mutation";
import { GetListParams } from "../../../../../lib/@tanstack/react-query/queries/get-single-list";

type ActionsComponentProps = {
  listId: string;
  fileIds: string[];
  params: GetListParams;
  setSelectedFileIds: (fileIds: string[]) => void;
};

export function ActionsComponent({
  listId,
  fileIds,
  params,
  setSelectedFileIds,
}: ActionsComponentProps) {
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<{
    id: string;
    name: string;
  }>(() => {
    const saved = sessionStorage.getItem(`savedAction${listId}`);
    try {
        return saved? JSON.parse(saved) : {
            id: "Nessuna Azione",
            name: "Nessuna Azione",
          }

    } catch {
      return {
        id: "Nessuna Azione",
        name: "Nessuna Azione",
      };
    }
  });


  useEffect(()=>{
    const saved = sessionStorage.getItem(`savedAction${listId}`);
    if (saved) {
      try {
        setSelectedAction(JSON.parse(saved));
      } catch {
        setSelectedAction({
          id: "Nessuna Azione",
          name: "Nessuna Azione",
        });
      }
    } else {
      setSelectedAction({
        id: "Nessuna Azione",
        name: "Nessuna Azione",
      });
    }
  },[listId])

  const { data: actions } = useQuery(getActionsOptions());

  const executeAction = useAction(selectedAction.id, params, {
    onSuccess: () => {
      setSelectedFileIds([]);
    },
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <Box
      width={200}
      position="relative"
      sx={{ cursor: "default" }}
      ref={wrapperRef}
    >
      <Box display="flex" position="relative" alignItems="center" height={40}>
        <Box
          onClick={() => setDropdownOpen((prev) => !prev)}
          width={170}
          height={40}
          sx={{
            display: "flex",
            alignItems: "center",
            padding: 1.5,
            zIndex: 2,
            backgroundColor: "#141a21",
            borderTopLeftRadius: "8px",
            borderBottomLeftRadius: isDropdownOpen ? 0 : "8px",
            boxShadow: 3,
            gap: 1,
          }}
        >
          <FontAwesomeIcon
            icon={faChevronRight}
            color="white"
            style={{
              transition: "transform 0.2s",
              transform: isDropdownOpen ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
          <Typography
            variant="body2"
            sx={{ color: "white", position: "relative", top: "1px",  userSelect: "none"  }}
          >
            {selectedAction.name}
          </Typography>
        </Box>

        <Button
          variant="text"
          onClick={(event) => {
            event.stopPropagation();
            if (selectedAction.id !== "Nessuna Azione") {
              executeAction.mutate({ listIds: [listId], fileIds });
            }
            setDropdownOpen(false);
          }}
          sx={{
            position: "absolute",
            right: 0,
            width: 40,
            height: 40,
            minWidth: 0,
            borderRadius: "50%",
            boxShadow: 12,
            backgroundColor: "white",
            zIndex: 3,
            "& svg": { color: "#1e293b" },
            "&:hover svg": { color: "#1976d2" },
          }}
        >
          <SendIcon />
        </Button>
      </Box>
      {isDropdownOpen && (
        <Stack
          direction={"column"}
          position="absolute"
          top={40}
          width={170}
          sx={{
            backgroundColor: "white",
            borderBottomLeftRadius: "14px",
            borderBottomRightRadius: "14px",
            boxShadow: 3,
            zIndex: 1,
          }}
        >
          {actions?.map((action) => (
            <Box key={action.id}>
              <Stack
                position={"relative"}
                alignItems={"center"}
                direction={"row"}
                gap={2}
                padding={2}
                sx={{ "&:hover": { backgroundColor: "rgb(0,0,0,0.1)" } }}
                onClick={() => {
                    setSelectedAction({ id: action.id, name: action.name });
                  sessionStorage.setItem(`savedAction${listId}`, JSON.stringify(action));
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" ,  userSelect: "none" }}>
                  {action.name}
                </Typography>{" "}
                <Box
                  width={30}
                  position={"absolute"}
                  right={2}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  height={30}
                >
                  {action.id === selectedAction.id && (
                    <FontAwesomeIcon icon={faCheck} color="#1dd760" />
                  )}
                </Box>
              </Stack>
            </Box>
          ))}
          <Stack
            position={"relative"}
            alignItems={"center"}
            direction={"row"}
            gap={2}
            padding={2}
            sx={{ "&:hover": { backgroundColor: "rgb(0,0,0,0.1)" } }}
            onClick={() => {
              setSelectedAction({
                id: "Nessuna Azione",
                name: "Nessuna Azione",
              });
              sessionStorage.removeItem(`savedAction${listId}`)
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "bold" , userSelect: "none" }}>
              Nessuna Azione
            </Typography>
            <Box
              width={30}
              position={"absolute"}
              right={2}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              height={30}
            >
              {selectedAction.id === "Nessuna Azione" && (
                <FontAwesomeIcon icon={faCheck} color="#1dd760" />
              )}
            </Box>
          </Stack>
        </Stack>
      )}
    </Box>
  );
}
