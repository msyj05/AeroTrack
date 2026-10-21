import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ScrollToTop from "./components/ui/ScrollToTop";
import { DataProvider } from "./data/DataContext";
import { AuthProvider } from "./data/AuthContext";
import { Toaster } from "sonner";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ScrollToTop />
          <App />
          <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{
              style: {
                width: "fit-content", // The toast itself hugs the text
                maxWidth: "calc(100vw - 32px)",
              },
            }}
            style={{
              // This forces the invisible container to span the screen and center its children
              left: "50%",
              transform: "translateX(-50%)",
              width: "100vw",
              display: "flex",
              justifyContent: "center",
            }}
          />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
