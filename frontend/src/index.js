import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import PopupContextProvider from "./context/popContextProvider";

// Create a root
const root = ReactDOM.createRoot(document.getElementById("root"));

// Initial render
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <Router>
        <PopupContextProvider>
          <App />
        </PopupContextProvider>
      </Router>
    </ChakraProvider>
  </React.StrictMode>
);
