import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import RootRouter from "./Routes/RootRouter";
import { AuthProvider } from "./Provider/AuthProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={RootRouter}></RouterProvider>
    </AuthProvider>
  </StrictMode>
);
