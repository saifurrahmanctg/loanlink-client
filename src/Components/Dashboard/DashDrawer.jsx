import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import DashSidebar from "./DashSidebar";
import { Link, Outlet, useLocation } from "react-router";
import { useAuth } from "../../Provider/AuthProvider";
import logo from "../../assets/main-logo.png";
import { IoMoon } from "react-icons/io5";
import { MdSunny } from "react-icons/md";
import { RiMenu2Line, RiCloseFill } from "react-icons/ri";
import DashFooter from "./DashFooter";
import DashboardHeader from "../Dashboard/DashboardHeader";
import Loader from "../Shared/Loader";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const DashDrawer = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState("light");
  const location = useLocation();
  const [pageLoading, setPageLoading] = useState(true);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  const closeDrawer = () => {
    setDrawerOpen(false);
    if (drawerRef.current) drawerRef.current.checked = false;
  };

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
    if (drawerRef.current)
      drawerRef.current.checked = !drawerRef.current.checked;
  };

  /* ---------- theme ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const menuItems = [
    { label: "Dashboard Home", path: "/dashboard" },
    { label: "My Loans", path: "/dashboard/my-loans" },
    { label: "Add Loan", path: "/dashboard/add-loan" },
    { label: "Manage Loans", path: "/dashboard/manage-loans" },
    { label: "Pending Loan Applications", path: "/dashboard/pending-loans" },
    { label: "Approved Loan Applications", path: "/dashboard/approved-loans" },
    { label: "Manage Users", path: "/dashboard/manage-users" },
    { label: "All Loans", path: "/dashboard/all-loans" },
    { label: "Loan Applications", path: "/dashboard/loan-applications" },
    { label: "Profile", path: "/dashboard/profile" },
    { label: "Settings", path: "/dashboard/settings" },
  ];

  const ThemeButton = (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-[#3BADE3] hover:bg-blue-600 transition"
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === "light" ? (
          <IoMoon size={16} fill="white" />
        ) : (
          <MdSunny size={18} fill="white" />
        )}
      </motion.div>
    </motion.button>
  );

  const userPhoto = user?.photoURL || "?";
  const getUserInitial = () =>
    user?.displayName?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "?";

  useEffect(() => {
    const active = menuItems.find((m) => m.path === location.pathname);
    document.title = active
      ? `${active.label} | Dashboard | LoanLink`
      : "Dashboard | LoanLink";
  }, [location.pathname]);

  useEffect(() => {
    setPageLoading(true);
    const t = setTimeout(() => setPageLoading(false), 1000);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div className="drawer md:drawer-open">
      <input
        ref={drawerRef}
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
      />

      <div className="drawer-content flex flex-col">
        {/* ===== NAVBAR ===== */}
        <div className="navbar bg-base-300 w-full sticky top-0 z-50">
          <div className="navbar-start">
            <div className="flex-none md:hidden">
              <button
                onClick={toggleDrawer}
                aria-label="toggle sidebar"
                className="btn btn-square btn-ghost"
              >
                {drawerOpen ? (
                  <RiCloseFill size={24} />
                ) : (
                  <RiMenu2Line size={24} />
                )}
              </button>
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
          <div className="navbar-end flex items-center gap-3">
            {ThemeButton}
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

        {/* ===== PAGE HEADER ===== */}
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

        {/* ===== CONTENT ===== */}
        <div className="min-h-[calc(100vh-192px)] md:min-h-[calc(100vh-224px)] flex flex-col">
          <div className="flex-1 relative">
            {pageLoading ? (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-base-100">
                <Loader />
              </div>
            ) : (
              <Outlet />
            )}
          </div>
          <DashFooter />
        </div>
      </div>

      {/* ===== SIDEBAR ===== */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay" />
        <div className="min-h-screen">
          <DashSidebar onLinkClick={closeDrawer} />
        </div>
      </div>
    </div>
  );
};

export default DashDrawer;
