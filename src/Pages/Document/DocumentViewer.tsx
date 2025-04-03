import AddRoundedIcon from '@mui/icons-material/AddRounded';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme,
  type IconButtonProps,
} from '@mui/material';
import { useEffect, useState } from 'react';

import {
  Page,
  pdfjs,
  Document as ReactPDFDocument,
  type DocumentProps as ReactPDFDocumentProps,
} from 'react-pdf';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { useContainerSize } from '../../Hooks/useContainerSize';
import { usePagination } from '../../Hooks/use-pagination';
import { ExcelViewer } from './excel-viewer';
import { WordViewer } from './word-viewer';

export type DocumentProps = ReactPDFDocumentProps;
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

interface DocumentViewerProps extends Omit<ReactPDFDocumentProps, 'file'> {
  url: string | ArrayBuffer;
  extension: 'pdf' | 'docx' | 'xlsx' | 'doc' | 'xls' | undefined;
}

export function DocumentViewer({ url, extension, ...rest }: DocumentViewerProps) {
  const theme = useTheme();
  const { ref: containerRef, width: containerWidth } = useContainerSize<HTMLDivElement>();
  const [binaryData, setBinaryData] = useState<ArrayBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const {
    page,
    totalPages,
    setTotalPages,
    handlePreviousPage,
    handleNextPage,
    hasPrevious,
    hasNext,
  } = usePagination();

  useEffect(() => {
    if (extension === 'pdf') return;

    if (typeof url === 'string') {
      setIsLoading(true);
      fetch(url)
        .then((response) => response.arrayBuffer())
        .then((buffer) => setBinaryData(buffer))
        .catch((error) => console.error('Errore nel caricamento del file:', error))
        .finally(() => setIsLoading(false));
      return () => {};
    }

    if (url instanceof ArrayBuffer) {
      setBinaryData(url);
    }

    return () => {};
  }, [url, extension]);

  const handleLoadSuccess: ReactPDFDocumentProps['onLoadSuccess'] = (document) => {
    setTotalPages(document.numPages);

    if (rest.onLoadSuccess) {
      rest.onLoadSuccess(document);
    }
  };

  const handleLoadError: ReactPDFDocumentProps['onLoadError'] = (error) => {
    console.error(error);
  };

  const renderContent = () => {
    if (extension === 'pdf') {
      return (
        <ReactPDFDocument
          file={url}
          {...rest}
          onLoadSuccess={handleLoadSuccess}
          onLoadError={handleLoadError}
        >
          {totalPages && (
            <TransformWrapper
              wheel={{ disabled: true }}
              doubleClick={{ disabled: true }}
              panning={{ disabled: true, excluded: ['text-layer'] }}
              centerOnInit={true}
            >
              {({ zoomIn, zoomOut, resetTransform }) => {
                const handleZoomIn: IconButtonProps['onClick'] = () => {
                  zoomIn();
                };

                const handleZoomOut: IconButtonProps['onClick'] = () => {
                  zoomOut();
                };

                const handleReset: IconButtonProps['onClick'] = () => {
                  resetTransform();
                };

                return (
                  <Stack spacing={1}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box
                        sx={(theme) => {
                          const backgroundColor = theme.palette.common.white;

                          return {
                            width: "100%",
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingInline: 2,
                            backgroundColor,
                            color:
                              theme.palette.getContrastText(backgroundColor),
                            borderRadius: `${theme.shape.borderRadius}px`,
                          };
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: "grey.500",
                            fontStyle: "italic",
                          }}
                        >
                          {`page ${page} of ${totalPages}`}
                        </Typography>

                        <Stack
                          direction="row"
                          paddingBlock={1}
                          spacing={1}
                          sx={{
                            overflowX: "auto",
                          }}
                        >
                          <Box>
                            <Tooltip title={"reset"}>
                              <IconButton onClick={handleReset}>
                                <RestartAltRoundedIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>

                          <Divider
                            flexItem
                            orientation="vertical"
                            sx={{
                              mx: 0.5,
                              my: 1,
                            }}
                          />

                          <Stack direction="row">
                            <Tooltip title={"zoomOut"}>
                              <IconButton onClick={handleZoomOut}>
                                <RemoveRoundedIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title={"zoomIn"}>
                              <IconButton onClick={handleZoomIn}>
                                <AddRoundedIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>

                          <Divider
                            flexItem
                            orientation="vertical"
                            sx={{
                              mx: 0.5,
                              my: 1,
                            }}
                          />

                          <Stack direction="row">
                            <Tooltip title={"previousPage"} describeChild>
                              <IconButton
                                onClick={handlePreviousPage}
                                disabled={!hasPrevious}
                              >
                                <NavigateBeforeRoundedIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title={"nextPage"} describeChild>
                              <IconButton
                                onClick={handleNextPage}
                                disabled={!hasNext}
                              >
                                <NavigateNextRoundedIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Stack>
                      </Box>
                    </Stack>

                    <TransformComponent
                      wrapperStyle={{
                        borderRadius: `${theme.shape.borderRadius}px`,
                        backgroundColor: theme.palette.grey[800],
                        maxHeight: "71vh",
                        overflow: "auto",
                      }}
                      contentStyle={{
                        userSelect: "text",
                        cursor: "text",
                      }}
                    >
                      <div className="text-layer">
                        <Page
                          pageNumber={page}
                          width={containerWidth}
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                          className="react-pdf__Page"
                          customTextRenderer={({ str }) => str}
                        />
                      </div>
                    </TransformComponent>
                  </Stack>
                );
              }}
            </TransformWrapper>
          )}
        </ReactPDFDocument>
      );
    }

    if (isLoading) {
      return (
        <Box
          sx={{
            height: '71vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.50',
            borderRadius: 1,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={20} sx={{ color: theme.palette.grey[800] }} />
            <Typography>{'Loading file...'}</Typography>
          </Stack>
        </Box>
      );
    }

    if (!binaryData) return null;

    switch (extension) {
      case 'xlsx':
      case 'xls':
        return <ExcelViewer data={binaryData} />;

      case 'docx':
      case 'doc':
        return <WordViewer data={binaryData} />;

      default:
        return (
          <Box
            sx={{
              height: '71vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.50',
              borderRadius: 1,
            }}
          >
            <Typography variant="body1">Formato file non supportato.</Typography>
          </Box>
        );
    }
  };

  return (
    <Paper
      ref={containerRef}
      variant="outlined"
      sx={{
        width: '100%',
        height: '95%',
        padding: 1,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {renderContent()}
    </Paper>
  );
}

