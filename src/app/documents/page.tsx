import {
  Box,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import JsonViewer from "./components/JsonViewer";
import { DocumentViewer } from "./components/DocumentViewer";
import TextViewer from "./components/TextViewer";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFileOptions } from "../../lib/@tanstack/react-query/queries/get-single-file";
import { ActionsComponent } from "../utils/actions-component";
import { Result } from "../../api/types/result";

type RouteParams = {
  nome: string;
  id: string;
};

function Document() {
  const { id } = useParams<RouteParams>();

  const { data, isLoading } = useQuery({
    ...getFileOptions(id ?? ""),
    enabled: !!id,
  });
  const navigate = useNavigate();
  const [docTxtSw, setDocTxtSw] = useState(() => {
    const saved = sessionStorage.getItem("docTxtSw");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    sessionStorage.setItem("docTxtSw", JSON.stringify(docTxtSw));
  }, [docTxtSw]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocTxtSw(event.target.checked);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleBeforeUnload = (_e: BeforeUnloadEvent) => {
      const navEntries = performance.getEntriesByType(
        "navigation"
      ) as PerformanceNavigationTiming[];
      const isRefresh = navEntries[0]?.type === "reload";

      if (!isRefresh) {
        localStorage.removeItem("docTxtSw");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const [debug, setDebug] = useState<string>("");
  const [isDebugLoaded, setIsDebugLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading && data?.debug !== undefined && !isDebugLoaded) {
      setDebug(data.debug);
      setIsDebugLoaded(true);
    }
  }, [data?.debug, isLoading, isDebugLoaded]);

  const [result, setResult] = useState<Result | string>();
  const [newResult, setNewResult] = useState<Result | string | null>();
  const [isResultLoaded, setIsResultLoaded] = useState(false);
  useEffect(() => {
    if (!isLoading && !isResultLoaded) {
      setResult(data?.result);
      setNewResult(data?.newResult ?? null );
      setIsResultLoaded(true);
    }
  }, [data?.result, isLoading, isResultLoaded]);

  const base64 = data?.pdf.buffer;
  const pdfUrl = `data:application/pdf;base64,${base64}`;

  const allowedExtensions = ["pdf", "docx", "xlsx", "doc", "xls"] as const;
  const ext = data?.pdf.originalname?.split(".").pop()?.toLowerCase() || "pdf";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extension = allowedExtensions.includes(ext as any)
    ? (ext as (typeof allowedExtensions)[number])
    : undefined;

  return (
    <>
      <Box
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <Stack
          direction="column"
          spacing={2}
          sx={{
            padding: 2,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              width: "100%",
              padding: "10px 0",
              flexShrink: 0,
              zIndex: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{ color: "#8d99ae", marginRight: "10px" }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  color: "#ffffff",
                  fontStyle: "italic",
                }}
              >
                {data?.pdf.originalname}
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              sx={{ width: "49%" }}
              paddingRight={3}
            >
              {!isSmallScreen && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    backgroundColor: "#1976d2",
                    paddingX: 2,
                    borderRadius: 4,
                    width: 200,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: !docTxtSw ? "bold" : "normal",
                      color: "white",
                      marginRight: 2,
                    }}
                  >
                    Document
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={docTxtSw}
                          onChange={(event) => {
                            handleSwitchChange(event);
                          }}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "white",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: "lightgray",
                              },
                            "& .MuiSwitch-track": {
                              backgroundColor: "lightgray",
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </FormGroup>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: docTxtSw ? "bold" : "normal",
                      marginLeft: -2,
                      color: "white",
                    }}
                  >
                    Text
                  </Typography>
                </Box>
              )}
              {isSmallScreen && <Box sx={{ flexGrow: 1 }} />}
              <ActionsComponent listId={id ?? ""} fileIds={[id ?? ""]} />
            </Stack>
          </Stack>

          <Grid
            container
            spacing={2}
            sx={{
              padding: 1,
              height: "95%",
              alignItems: "center",
            }}
          >
            <Grid
              container
              sx={{ height: "100%" }}
              size={{ xs: 12, lg: 6 }}
              spacing={2}
            >
              {isResultLoaded && (
                <JsonViewer
                  json={result}
                  newJson={newResult}
                  fileId={id ?? ""}
                />
              )}
            </Grid>

            <Grid
              container
              spacing={2}
              sx={{
                height: "100%",
              }}
              size={{ xs: 12, lg: 6 }}
            >
              {docTxtSw ? (
                <>
                  {isDebugLoaded && (
                    <TextViewer text={debug} setText={setDebug} />
                  )}
                </>
              ) : (
                <>
                  {data?.pdf && (
                    <DocumentViewer url={pdfUrl} extension={extension} />
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </>
  );
}
export { Document as Component };
