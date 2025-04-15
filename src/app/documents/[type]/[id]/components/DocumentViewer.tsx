import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";

import { ExcelViewer } from "./excel-viewer";
import { WordViewer } from "./word-viewer";

interface DocumentViewerProps {
  url: string | ArrayBuffer;
  extension: "pdf" | "docx" | "xlsx" | "doc" | "xls" | undefined;
}

export function DocumentViewer({ url, extension }: DocumentViewerProps) {
  const theme = useTheme();

  const [binaryData, setBinaryData] = useState<ArrayBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (extension === "pdf") return;

    if (typeof url === "string") {
      setIsLoading(true);
      fetch(url)
        .then((response) => response.arrayBuffer())
        .then((buffer) => setBinaryData(buffer))
        .catch((error) =>
          console.error("Errore nel caricamento del file:", error)
        )
        .finally(() => setIsLoading(false));
      return () => {};
    }

    if (url instanceof ArrayBuffer) {
      setBinaryData(url);
    }

    return () => {};
  }, [url, extension]);

  const renderContent = () => {
    if (extension === "pdf") {
      if (url instanceof ArrayBuffer) {
        const blob = new Blob([url], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);

        return (
          <object
            title="PDF Viewer"
            type="application/pdf"
            data={blobUrl}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: theme.shape.borderRadius,
            }}
          >
            Spiacenti, il tuo browser non supporta l'anteprima PDF.{" "}
            <a href={blobUrl} download="document.pdf">
              Scarica
            </a>
          </object>
        );
      }

      return (
        <object
          title="PDF Viewer"
          type="application/pdf"
          data={url}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: theme.shape.borderRadius,
          }}
        >
          Spiacenti, il tuo browser non supporta l'anteprima PDF.{" "}
          <a href={url} download>
            Scarica
          </a>
        </object>
      );
    }

    if (isLoading) {
      return (
        <Box
          sx={{
            height: "71vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "grey.50",
            borderRadius: 1,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress
              size={20}
              sx={{ color: theme.palette.grey[800] }}
            />
            <Typography>{"Caricamento file..."}</Typography>
          </Stack>
        </Box>
      );
    }

    if (!binaryData) return null;

    switch (extension) {
      case "xlsx":
      case "xls":
        return <ExcelViewer data={binaryData} />;

      case "docx":
      case "doc":
        return <WordViewer data={binaryData} />;

      default:
        return (
          <Box
            sx={{
              height: "71vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "grey.50",
              borderRadius: 1,
            }}
          >
            <Typography variant="body1">
              Formato file non supportato.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Paper
     
      variant="outlined"
      sx={{
        width: "100%",
        height: "95%",
        padding: 1,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {renderContent()}
    </Paper>
  );
}
