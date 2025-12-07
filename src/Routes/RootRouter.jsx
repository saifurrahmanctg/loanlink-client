import React from "react";
import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";

const RootRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <div>Error occurred</div>,
  },
]);

export default RootRouter;
