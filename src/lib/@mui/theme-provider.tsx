import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  createTheme,
  type Theme,
  type ThemeOptions,
} from "@mui/material";
import { useEffect, useState, type PropsWithChildren } from "react";

import { GlobalSpinner } from "../../components/spinners/global-spinner";

export type ThemeProviderProps = PropsWithChildren<{
  themeOptions: ThemeOptions;
}>;

export function ThemeProvider(props: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    try {
      const createdTheme = createTheme(props.themeOptions);
      setTheme(createdTheme);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(error);
      }

      setTheme(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [props.themeOptions]);

  if (isLoading || !theme) {
    return <GlobalSpinner />;
  }

  return (
    <MuiThemeProvider theme={theme}>
      {props.children}
      <CssBaseline />
    </MuiThemeProvider>
  );
}
