import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from "./App.jsx";
import "@fontsource-variable/lexend";
import "leaflet/dist/leaflet.css";

const theme = extendTheme({
  fonts: {
    heading: `'Lexend Variable', sans-serif`,
    body: `'Lexend Variable', sans-serif`,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
