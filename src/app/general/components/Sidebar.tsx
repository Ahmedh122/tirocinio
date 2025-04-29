import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import React, { useRef, useState } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { PopupStateProvider } from "../../../providers/popup/PopupStateProvider"; // Ensure correct import
import { AddListButton } from "../../components/utils/add-list-button";
import { AddListDialog } from "../../components/utils/add-list-dialog";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getListsOptions } from "../../../lib/@tanstack/react-query/queries/get-lists";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBars } from "@fortawesome/free-solid-svg-icons";
import { CustomScrollbar } from "../../components/utils/CustomScrollBar";
import { bindTrigger } from "material-ui-popup-state/hooks";
import { ListMenu } from "../../components/utils/list-menu";
export function Sidebar() {
  const navigate = useNavigate();
  const { data } = useQuery(getListsOptions());
  const buttonRefs = useRef<Record<string, React.RefObject<HTMLButtonElement>>>(
    {}
  );

  const [selectedItemId, setSelectedItemId] = useState<string>(() => {
    return sessionStorage.getItem("selectedItemId") || "Home";
  });

  return (
    <Paper
      sx={{
        overflow: "hidden",
        marginTop: 0,
        height: "96vh",
        padding: 1.5,
        boxShadow: 3,
        backgroundColor: "#141a21",
      }}
    >
      <Stack direction="column" gap={2}>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="space-between"
          alignItems={"center"}
          height={60}
          paddingRight={2}
          sx={{
            backgroundColor: "#1e293b",
            borderRadius: 2,
            paddingLeft: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#ffffff",
              fontWeight: 600,
              letterSpacing: 1.5,
            }}
          >
            Training Tool
          </Typography>
          <Box sx={{ width: 100, height: 50 }}>
            <img
              src="/logo.svg"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Box>
        </Stack>

        <Stack
          direction={"row"}
          spacing={1}
          justifyContent="flex-start"
          paddingLeft={4}
          alignItems={"center"}
          height={60}
          borderRadius={1}
          sx={{
            backgroundColor: selectedItemId === "Home" ? "#1e293b" : "#141a21",
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: "#475569",
            },
          }}
          onClick={() => {
            sessionStorage.setItem("selectedItemId", "Home");
            setSelectedItemId("Home");
            navigate("/AllFiles");
          }}
        >
          <FontAwesomeIcon
            icon={faHouse}
            size="lg"
            style={{ color: "#ffffff" }}
          />
          <Typography sx={{ color: "white" }}>Tutti i files</Typography>
        </Stack>

        <Stack direction={"column"} alignItems={"center"}>
          <Stack
            direction={"row"}
            position={"relative"}
            spacing={1}
            justifyContent="flex-start"
            paddingLeft={4}
            alignItems={"center"}
            height={60}
            borderRadius={1}
            sx={{
              backgroundColor: "#1e293b",
              width: "100%",
              "& svg": {
                color: "white",
              },
            }}
          >
            <FontAwesomeIcon
              icon={faBars}
              size="lg"
              style={{ color: "#ffffff" }}
            />
            <Typography sx={{ color: "white" }}>Liste</Typography>
            <Stack
              position={"absolute"}
              alignItems={"center"}
              justifyContent={"center"}
              height={60}
              right={15}
            >
              <PopupStateProvider variant="dialog">
                <AddListButton />
                <AddListDialog />
              </PopupStateProvider>
            </Stack>
          </Stack>

          {data && data.length > 0 && (
            <CustomScrollbar
              height={600}
              dependency={data.length}
              width={339}
              marginLeft={1}
            >
              <Box
                sx={{
                  backgroundColor: "#141a21",
                  color: "white",
                  py: 0.5,
                  transition: "all 1s ease",
                }}
              >
                {data?.map((list) => {
                  if (!buttonRefs.current[list._id]) {
                    buttonRefs.current[list._id] =
                      React.createRef<HTMLButtonElement>();
                  }

                  const buttonRef = buttonRefs.current[list._id];

                  return (
                    <Box key={list._id} sx={{ px: 1, py: 0.5 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{
                          position: "relative",
                          alignItems: "center",
                          py: 3,
                          px: 2,
                          borderRadius: 1,
                          backgroundColor:
                            selectedItemId === list._id
                              ? "#1e293b"
                              : "transparent",
                          color:
                            selectedItemId === list._id ? "#1e293b" : "#334155",
                          transition: "background-color 0.2s ease",
                          "&:hover": {
                            backgroundColor: "#475569",
                            color: "#475569",
                            cursor: "pointer",
                          },
                        }}
                        onClick={() => {
                          sessionStorage.setItem("selectedItemId", list._id);
                          setSelectedItemId(list._id);
                          navigate(`/List/${list.name}/${list._id}`);
                        }}
                      >
                        <Stack direction={"row"}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: 25,
                              height: 25,
                              backgroundColor: "#1DD760",
                              borderRadius: "50%",
                              marginRight: 2,
                            }}
                          >
                            <Typography sx={{ fontWeight: 600 }}>
                              {list.fileCount}
                            </Typography>
                          </Box>
                          <Typography
                            sx={{ color: "#e1e3e8", fontWeight: "bold", ml: 1 }}
                          >
                            {list.name}
                          </Typography>
                        </Stack>
                        <Box
                          sx={{ color: "#e1e3e8", fontWeight: "bold", ml: 1 }}
                        >
                          <PopupStateProvider variant="popover">
                            {({ popupState }) => {
                              return (
                                <>
                                  <Button
                                    {...bindTrigger(popupState)}
                                    variant="text"
                                    ref={buttonRef}
                                    sx={{
                                      "& svg": {
                                        color: "grey",
                                      },
                                    }}
                                  >
                                    <MoreHorizRoundedIcon />
                                  </Button>
                                  <ListMenu
                                    popupState={popupState}
                                    id={list._id}
                                    setSelectedItemId={setSelectedItemId}
                                    anchorEl={buttonRef.current}
                                  />
                                </>
                              );
                            }}
                          </PopupStateProvider>
                        </Box>
                      </Stack>
                    </Box>
                  );
                })}
              </Box>
            </CustomScrollbar>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
