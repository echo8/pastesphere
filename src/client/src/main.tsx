import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import { MainProvider } from "./components/MainProvider";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MainProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MainProvider>
  </React.StrictMode>
);
