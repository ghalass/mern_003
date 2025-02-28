import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { Toaster } from "react-hot-toast";
import UserProvider from "./context/UserContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster
      position="top-center"
      toastOptions={{
        removeDelay: 1000,
      }}
    />
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </UserProvider>
  </StrictMode>
);
