import React from "react";
import { motion } from "framer-motion";
import DashSidebar from "./DashSidebar";
import { Link, Outlet, useLocation } from "react-router";
import { FaCog, FaFileAlt, FaHome, FaList, FaPlusCircle } from "react-icons/fa";
import { FaUser, FaWallet } from "react-icons/fa6";
import { useAuth } from "../../Provider/AuthProvider";
import logo from "../../assets/main-logo.png";
import DashFooter from "./DashFooter";
import DashboardHeader from "../Dashboard/DashboardHeader";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const DashDrawer = () => {
  const { user } = useAuth();
  const location = useLocation();
  const menuItems = [
    { label: "Dashboard Home", path: "/dashboard" },
    { label: "My Loans", path: "/dashboard/my-loans" },
    { label: "Add Loan", path: "/dashboard/add-loan" },
    { label: "Manage Users", path: "/dashboard/manage-users" },
    { label: "All Loans", path: "/dashboard/all-loans" },
    { label: "Loan Applications", path: "/dashboard/loan-applications" },
    { label: "Profile", path: "/dashboard/profile" },
    { label: "Settings", path: "/dashboard/settings" },
  ];

  const userPhoto = user?.photoURL || "?";

  const getUserInitial = () => {
    if (!user) return "?";
    if (user.displayName) return user.displayName[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return "?";
  };

  return (
    <div className="drawer md:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Page content here */}
        <div className="navbar bg-base-300 w-full sticky top-0 z-50">
          <div className="navbar-start">
            <div className="flex-none md:hidden">
              <label
                htmlFor="my-drawer"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-6 w-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="mx-2 flex-1 px-2">
              <h1 className="font-rajdhani text-xl font-bold">
                {menuItems.find((m) => m.path === location.pathname)?.label ||
                  "Dashboard"}
              </h1>
            </div>
          </div>
          <div className="navbar-center md:hidden">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-6 md:h-8 lg:h-10" />
            </Link>
          </div>
          <div className="navbar-end">
            <Link to="/dashboard/profile">
              {userPhoto && userPhoto !== "?" ? (
                <img
                  src={userPhoto}
                  alt="User"
                  className="w-8 rounded-md object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
                  {getUserInitial()}
                </div>
              )}
            </Link>
          </div>
        </div>
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <DashboardHeader
            title={
              menuItems.find((m) => m.path === location.pathname)?.label ||
              "Dashboard"
            }
          />
        </motion.div>
        <div className="min-h-[calc(100vh-192px)] md:min-h-[calc(100vh-224px)] flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>

          <DashFooter />
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        {/* Sidebar content here */}
        <div className="min-h-screen">
          <DashSidebar />
        </div>
      </div>
    </div>
  );
};

export default DashDrawer;
