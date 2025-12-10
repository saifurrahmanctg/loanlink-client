import React from "react";
import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import About from "../pages/Shared/About";
import Contact from "../pages/Shared/Contact";
import AllLoans from "../pages/AllLoans";
import DashboardLayout from "../Layouts/DashboardLayout";
import LoanDetails from "../pages/LoanDetails";
import MyLoans from "../pages/DashboardPages/User/MyLoans";
import Profile from "../pages/DashboardPages/User/Profile";
import Settings from "../pages/DashboardPages/User/Settings";
import DashboardHome from "../pages/DashboardPages/DashboardHome";
import ApplyLoan from "../pages/ApplyLoan";
import LoanApplications from "../pages/Admin/LoanApplications";
import AddLoan from "../pages/Manager/AddLoan";
import RoleRoute from "./RoleRoute";
import AccessDenied from "../pages/AccessDenied";

const API = import.meta.env.VITE_API_URL;

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "all-loans",
        loader: () => fetch(`${API}/loans`),
        element: <AllLoans />,
      },
      {
        path: "/loan-details/:id",
        element: <LoanDetails />,
        loader: async ({ params }) => {
          const allLoans = await fetch(`${API}/loans`).then((res) =>
            res.json()
          );
          const loan = allLoans.find((l) => l._id === params.id);

          return { loan, allLoans };
        },
      },
      {
        path: "/apply-loan/:id",
        element: (
          <RoleRoute allowedRoles={["admin", "manager", "borrower"]}>
            <ApplyLoan />
          </RoleRoute>
        ),
        loader: async ({ params }) => {
          const loan = await fetch(`${API}/loans/${params.id}`).then((res) =>
            res.json()
          );

          return { loan };
        },
      },

      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
    ],
  },
  { path: "/access-denied", element: <AccessDenied /> },
  {
    path: "/dashboard",
    element: (
      <RoleRoute allowedRoles={["admin", "manager", "borrower"]}>
        <DashboardLayout />
      </RoleRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      {
        path: "/dashboard/my-loans",
        element: (
          <RoleRoute allowedRoles={["borrower"]}>
            <MyLoans />
          </RoleRoute>
        ),
      },
      {
        path: "add-loan",
        element: (
          <RoleRoute allowedRoles={["manager"]}>
            <AddLoan />
          </RoleRoute>
        ),
      },
      {
        path: "/dashboard/loan-applications",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <LoanApplications />
          </RoleRoute>
        ),
      },
      { path: "/dashboard/profile", element: <Profile /> },
      { path: "/dashboard/settings", element: <Settings /> },
    ],
  },
]);

export default router;
