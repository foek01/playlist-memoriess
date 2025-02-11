import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";

import Main from "./views/shared/Main";
import theme from "./theme";

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
            <Main />
        </SnackbarProvider>
    </ThemeProvider>,
    document.getElementById("root")
);
