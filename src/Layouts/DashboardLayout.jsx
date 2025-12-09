import { Outlet, Link, useLocation } from "react-router";
import { motion } from "framer-motion";
import { FaHome, FaWallet, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../Provider/AuthProvider";
import logo from "../assets/main-logo.png";

export default function DashboardLayout() {
  const { user, logOut } = useAuth();

  const location = useLocation();

  const menuItems = [
    { label: "Home", path: "/dashboard", icon: <FaHome /> },
    { label: "My Loans", path: "/dashboard/my-loans", icon: <FaWallet /> },
  ];

  const userMenu = [
    { label: "Profile", path: "/dashboard/profile", icon: <FaUser /> },
    { label: "Settings", path: "/dashboard/settings", icon: <FaCog /> },
  ];

  const userPhoto = user?.photoURL || "?";

  /* ---------- SIDE BAR CONTENT ---------- */
  const SideBar = ({ onClose }) => (
    <div className="w-64 bg-base-200 text-base-content p-4 h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-6">
        <img src={logo} alt="Logo" className="h-8" />
      </Link>

      {/* Menu */}
      <ul className="menu space-y-2 flex-1 w-full">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 bg-gray-700 rounded transition ${
                location.pathname === item.path
                  ? "active bg-gradient"
                  : "hover:bg-base-300"
              }`}
              onClick={onClose}
            >
              {item.icon}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout */}
      <div className="mt-auto border-t">
        {/* Menu */}
        <ul className="menu space-y-2 flex-1 w-full">
          {userMenu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded bg-gray-700 transition ${
                  location.pathname === item.path
                    ? "active bg-gradient"
                    : "hover:bg-base-300"
                }`}
                onClick={onClose}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <button onClick={logOut} className="btn bg-red-600 w-full">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100 flex">
      {/* ---------- DESKTOP: fixed sidebar (≥ md) ---------- */}
      <div className="hidden md:block">
        <SideBar onClose={() => {}} />
      </div>

      {/* ---------- MOBILE: drawer (< md) ---------- */}
      <div className="drawer drawer-end md:hidden">
        <input
          id="dashboard-drawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="min-h-screen drawer-content flex flex-col w-full">
          {/* NAVBAR */}
          <nav className="w-full bg-base-200 shadow-sm px-4 py-3 flex items-center justify-between">
            <h1 className="font-rajdhani text-xl font-bold">
              {menuItems.find((m) => m.path === location.pathname)?.label ||
                userMenu.find((m) => m.path === location.pathname)?.label ||
                "Dashboard"}
            </h1>
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-ghost btn-circle"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </nav>

          {/* CONTENT */}
          <main className="flex-grow">
            <Outlet />
          </main>

          {/* FOOTER */}
          <footer className="bg-base-300 px-6 py-4 text-center text-sm text-gray-600">
            © {new Date().getFullYear()}{" "}
            <span className="text-gradient text-lg font-bold font-rajdhani">
              LoanLink
            </span>
            . All rights reserved.
          </footer>
        </div>

        <div className="drawer-side z-40">
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
          <motion.div
            initial={{ x: 280 }}
            animate={{ x: 0 }}
            exit={{ x: 280 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-64 bg-base-200 text-base-content p-4 h-screen"
          >
            <SideBar
              onClose={() =>
                (document.getElementById("dashboard-drawer").checked = false)
              }
            />
          </motion.div>
        </div>
      </div>

      {/* ---------- DESKTOP CONTENT (right of fixed sidebar) ---------- */}
      <div className="hidden md:block flex-1 flex-col min-h-screen">
        <nav className="w-full bg-base-200 shadow-sm px-4 py-3 flex items-center justify-between">
          <h1 className="font-rajdhani text-xl font-bold">
            {menuItems.find((m) => m.path === location.pathname)?.label ||
              userMenu.find((m) => m.path === location.pathname)?.label ||
              "Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            <Link to="/dashboard/profile">
              <img src={userPhoto} alt="" className="w-10 rounded" />
            </Link>
          </div>
        </nav>

        <main className="flex-grow">
          <Outlet />
        </main>

        <footer className=" bg-base-300 px-6 py-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()}{" "}
          <span className="text-gradient text-lg font-bold font-rajdhani">
            LoanLink
          </span>
          . All rights reserved.
        </footer>
      </div>
    </div>
  );
}
