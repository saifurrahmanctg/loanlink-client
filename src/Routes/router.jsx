// src/your-router-file.js (replace with your actual path)
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
import ManageUsers from "../pages/Admin/ManageUsers";
import AllAdminLoans from "../pages/Admin/AllAdminLoans";

const API = import.meta.env.VITE_API_URL;

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage />, handle: { title: "Home" } },

      {
        path: "all-loans",
        loader: () => fetch(`${API}/loans`),
        element: <AllLoans />,
        handle: { title: "All Loans" },
      },

      {
        path: "/loan-details/:id",
        // important: provide a routeTitle so RootLayout can build full title
        handle: { dynamicTitle: true, routeTitle: "Loan Details" },
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
        // also provide a routeTitle specific to this page
        handle: { dynamicTitle: true, routeTitle: "Apply Loan" },
        element: (
          <RoleRoute allowedRoles={["borrower"]}>
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

      { path: "login", handle: { title: "Login" }, element: <Login /> },
      {
        path: "register",
        handle: { title: "Register" },
        element: <Register />,
      },
      { path: "about", handle: { title: "About Us" }, element: <About /> },
      {
        path: "contact",
        handle: { title: "Contact Us" },
        element: <Contact />,
      },
    ],
  },

  {
    path: "/access-denied",
    handle: { title: "Access Denied" },
    element: <AccessDenied />,
  },

  {
    path: "/dashboard",
    element: (
      <RoleRoute allowedRoles={["admin", "manager", "borrower"]}>
        <DashboardLayout />
      </RoleRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
        handle: { title: "Dashboard" },
      },

      {
        path: "/dashboard/my-loans",
        element: (
          <RoleRoute allowedRoles={["borrower"]}>
            <MyLoans />
          </RoleRoute>
        ),
        handle: { title: "My Loans" },
      },

      {
        path: "add-loan",
        element: (
          <RoleRoute allowedRoles={["manager"]}>
            <AddLoan />
          </RoleRoute>
        ),
        handle: { title: "Add Loan" },
      },

      {
        path: "/dashboard/manage-users",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </RoleRoute>
        ),
        handle: { title: "Manage Users" },
      },

      {
        path: "/dashboard/all-loans",
        loader: () => fetch(`${API}/loans`),
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <AllAdminLoans />
          </RoleRoute>
        ),
        handle: { title: "All Loans (Admin)" },
      },

      {
        path: "/dashboard/loan-applications",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <LoanApplications />
          </RoleRoute>
        ),
        handle: { title: "Loan Applications" },
      },

      {
        path: "/dashboard/profile",
        element: <Profile />,
        handle: { title: "Profile" },
      },
      {
        path: "/dashboard/settings",
        element: <Settings />,
        handle: { title: "Settings" },
      },
    ],
  },
]);

export default router;
