import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
    palette: {
        type: "light",
        primary: {
            main: "#5F4B8BFF",
            contrastText: "#fefefe",
        },
        secondary: {
            main: "#E69A8DFF",
            contrastText: "#fefefe",
        },
        red: {
            main: "#ff0000",
        },
        error: {
            main: "#ab3030",
        },
        background: {
            default: "#f0f0f0",
        },
    },
});

export default theme;
