import { createRoot } from "react-dom/client";
import App from "./App";
// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </React.StrictMode>
);
