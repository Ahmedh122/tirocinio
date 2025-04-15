import {
  Box,
  Button,
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
import JsonViewer from "./components/JsonViewer"; // Assuming you have a JsonViewer component
import { DocumentViewer } from "./components/DocumentViewer";
//import { getDocumentViewerTemplate } from "./get-document-viewer-template";
import TextViewer from "./components/TextViewer"; // Assuming you have DocumentViewer component
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


const data = {
  pdf: {
    fieldname: "file",
    originalname: "SLASER24_24091308135.pdf",
    encoding: "7bit",
    mimetype: "application/pdf",
    buffer: "8yruhfiubdjvhsdjhvbsdfjhvbsdfjhvbhjsdfbvjhsdfbvjhfsdbvk",
    size: 110763,
  },
  id: 1,
  text: "a string, in which case it is interpreted as the colour (or background colour in the case of container and inputHighlight) a full CSS style object for fine-grained definition. You only need to provide properties you wish to override — all unspecified ones will fallback to either the default theme, or another theme that you specify as th which is a function that takes the same input as Filter Functions, but returns a CSS style object (or null). This allows you to dynamically change styling of various elements based on content or structure. (An example is in the Demata set, where the character names are styled larger than other string values) an array containing any combination of the above, in which case they are merged together. For example, you could provide a Theme Function with styling for a very specific condition, but the styles whenever the function returns null. (In the array, the later items have higher precedence) For a simple example, if you want to us theme, but just change a couple of small things, you'd specify something like this:a string, in which case it is interpreted as the colour (or background colour in the case of container and inputHighlight) a full CSS style object for fine-grained definition. You only need to provide properties you wish to override — all unspecified ones will fallback to either the default theme, or another theme that you specify  which is a function that takes the same input as Filter Functions, but returns a CSS style object (or null). This allows you to dynamically change styling of various elements based on content or structure. (An example is in the De data set, where the character names are styled larger than other string values) an array containing any combination of the above, in which case they are merged together. For example, you could provide a Theme Function with styling for a very specific condition, but then provide styles whenever the function returns null. (In the array, the later items have higher precedence) For a simple example, if you want to use the  theme, but just change a couple of small things, you'd specify something like this:a string, in which case it is interpreted as the colour (or background colour in the case of container and inputHighlight) a full CSS style object for fine-grained definition. You only need to provide properties you wish to override — all unspecified ones will fallback to either the default theme, or another theme that you s which is a function that takes the same input as Filter Functions, but returns a CSS style object (or null). This allows you to dynamically change styling of various elements based on content or structure. (An example is in the Demo  data set, where the character names are styled larger than other string values) an array containing any combination of the above, in which case they are merged together. For example, you could provide a Theme Function with styling for a very specific condition, but then provide  styles whenever the function returns null. (In the array, the later items have higher precedence) For a simple example, if you want to use the  theme, but just change a couple of small things, you'd specify something like this:",
  result: {
    CAMPI: {
      Fornitore: "AZIENDA AGRICOLA BORTOLOTTI MARCO",
      Destinatario: "DE LUCA & CAMPITIELLO SRL",
      "Indirizzo Destinazione": "Via Paolo Canali n.16 40127 BOLOGNA",
      "Numero Doc Trasporto": "2",
    },
    INFORMAZIONI: {
      "Data Doc Trasporto": "09/09/2021",
      "Numero Ordine Cliente": "SN/MAIL",
      "Data Ordine Cliente": "09/09/2021",
      "Data consegna cliente": "09/09/2021",
      "Codice Fornitore": "06028",
      "Codice Destinazione": "A0031601",
      Filler: "",
    },
    TABELLA: [
      {
        "Codice Articolo del Fornitore": "ZUCCHINE VERDI IN LEGNO",
        "Descrizione Articolo": "ZUCCHINE VERDI IN LEGNO",
        "Colli consegnati": 56,
        Quantita: 56,
        "Kg Netti Consegnati": 448.8,
        "Pezzi Consegnati": 0,
        Importo: 448.8,
        "Codice iva": "",
        "Codice Sconto": "",
        id: 0,
      },
    ],
  },
};

function Document() {
  const navigate = useNavigate();
  //const documentId = useLocation().pathname.split("/")[2];
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
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
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
  return (
    <>
    <Box
      sx={{
        height: "95%",
        width: "95%",
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
              sx={{ color: "rgba(0, 0, 0, 0.54)", marginRight: "10px" }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                color: "grey.700",
                fontStyle: "italic",
              }}
            >
              {data.pdf.originalname}
            </Typography>
          </Box>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "49%" }}
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
                  width:200
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
            <Button>
              <SendIcon />
            </Button>
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
            <JsonViewer data={data.result} />
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
              <TextViewer text={data.text} />
            ) : (
              <>
                {/**{
                  fileData?.pdf && ( <DocumentViewer
                 url={`data:application/pdf;base64,${fileData.pdf}`}
                 extension={fileExtension}
               />)
                } */}
                <DocumentViewer url="/DDT_12929_2024.pdf" extension="pdf" />
              </>
            )}
          </Grid>
        </Grid>
      </Stack>
    </Box>
    </>
  );
}
export {Document as Component};
