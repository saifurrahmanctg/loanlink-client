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
import ManageLoans from "../pages/Manager/ManageLoans";

const API = import.meta.env.VITE_API_URL;

const router = createBrowserRouter([
  // ==========================
  //      ROOT LAYOUT
  // ==========================
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      // ==========================
      //        HOME PAGE
      // ==========================
      { index: true, element: <HomePage />, handle: { title: "Home" } },
      // ==========================
      //        LOAN PAGES
      // ==========================
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
      // ==========================
      //        AUTH PAGES
      // ==========================
      { path: "login", handle: { title: "Login" }, element: <Login /> },
      {
        path: "register",
        handle: { title: "Register" },
        element: <Register />,
      },
      // ==========================
      //        BASIC PAGE
      // ==========================
      { path: "about", handle: { title: "About Us" }, element: <About /> },
      {
        path: "contact",
        handle: { title: "Contact Us" },
        element: <Contact />,
      },
    ],
  },
  // ==========================
  //       ACCESS DENIED
  // ==========================
  {
    path: "/access-denied",
    handle: { title: "Access Denied" },
    element: <AccessDenied />,
  },
  // ==========================
  //      DASHBOARD LAYOUT
  // ==========================
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
      // ==========================
      //      BORROWER PAGES
      // ==========================
      {
        path: "/dashboard/my-loans",
        element: (
          <RoleRoute allowedRoles={["borrower"]}>
            <MyLoans />
          </RoleRoute>
        ),
        handle: { title: "My Loans" },
      },
      // ==========================
      //        MANAGER PAGES
      // ==========================
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
        path: "manage-loans",
        element: (
          <RoleRoute allowedRoles={["manager"]}>
            <ManageLoans />
          </RoleRoute>
        ),
        handle: { title: "Add Loan" },
      },
      // ==========================
      //        ADMIN PAGE
      // ==========================
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
      // ==========================
      //   DASHBOARD COMMON PAGES
      // ==========================
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
