import { Outlet, Link, useLocation } from "react-router";
import { motion } from "framer-motion";
import {
  FaHome,
  FaWallet,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaFileAlt,
  FaPlusCircle,
} from "react-icons/fa";
import { useAuth } from "../Provider/AuthProvider";
import logo from "../assets/main-logo.png";

export default function DashboardLayout() {
  const { user, logOut } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      label: "Home",
      path: "/dashboard",
      icon: <FaHome />,
      roles: ["admin", "manager", "borrower"],
    },
    {
      label: "My Loans",
      path: "/dashboard/my-loans",
      icon: <FaWallet />,
      roles: ["borrower"],
    },
    {
      label: "Add Loan",
      path: "/dashboard/add-loan",
      icon: <FaPlusCircle />,
      roles: ["manager"],
    },
    {
      label: "Loan Applications",
      path: "/dashboard/loan-applications",
      icon: <FaFileAlt />,
      roles: ["admin"],
    },
  ];

  const userMenu = [
    {
      label: "Profile",
      path: "/dashboard/profile",
      icon: <FaUser />,
      roles: ["admin", "manager", "borrower"],
    },
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: <FaCog />,
      roles: ["admin", "manager", "borrower"],
    },
  ];

  const userPhoto = user?.photoURL || "?";

  const SideBar = ({ onClose }) => (
    <div className="w-64 shrink-0 bg-base-300 text-base-content p-4 h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-6">
        <img src={logo} alt="Logo" className="h-8" />
      </Link>

      {/* Role Based Menu */}
      <ul className="menu space-y-2 flex-1 w-full">
        {menuItems
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded transition ${
                  location.pathname === item.path
                    ? "active bg-gradient"
                    : "hover:bg-blue-500"
                }`}
                onClick={onClose}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
      </ul>

      <div className="mt-auto border-t">
        {/* User Menu */}
        <ul className="menu space-y-2 flex-1 w-full mt-4">
          {userMenu
            .filter((item) => item.roles.includes(user?.role))
            .map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded transition ${
                    location.pathname === item.path
                      ? "active bg-gradient"
                      : "hover:bg-blue-500"
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
        <button onClick={logOut} className="btn bg-red-600 w-full">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );

  const getUserInitial = () => {
    if (!user) return "?";
    if (user.displayName) return user.displayName[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return "?";
  };

  return (
    <div className="md:flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 hidden md:block ">
        <SideBar onClose={() => {}} />
      </div>
      {/* Main Content */}
      <div className="flex-1 ">
        <div className="flex flex-col min-h-screen">
          <header className="">
            <nav className="hidden md:flex w-full bg-base-300 shadow-sm px-4 py-3  items-center justify-between">
              <h1 className="font-rajdhani text-xl font-bold">
                {menuItems.find((m) => m.path === location.pathname)?.label ||
                  userMenu.find((m) => m.path === location.pathname)?.label ||
                  "Dashboard"}
              </h1>
              <div className="flex items-center gap-3">
                <Link to="/dashboard/profile">
                  {userPhoto && userPhoto !== "?" ? (
                    <img
                      src={userPhoto}
                      alt="User"
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
                      {getUserInitial()}
                    </div>
                  )}
                </Link>
              </div>
            </nav>
            <div className="drawer drawer-start md:hidden">
              <input
                id="dashboard-drawer"
                type="checkbox"
                className="drawer-toggle"
              />
              <div className="min-h-screen drawer-content flex flex-col w-full">
                {/* NAVBAR */}
                <nav className="w-full bg-base-300 shadow-sm px-4 py-3 flex items-center justify-between">
                  <div className="flex justify-center items-center">
                    <label
                      htmlFor="dashboard-drawer"
                      className="btn btn-ghost btn-circle"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </label>
                    <h1 className="font-rajdhani text-xl font-bold">
                      {menuItems.find((m) => m.path === location.pathname)
                        ?.label ||
                        userMenu.find((m) => m.path === location.pathname)
                          ?.label ||
                        "Dashboard"}
                    </h1>
                  </div>
                  {/* Logo */}
                  <Link to="/">
                    <img src={logo} alt="Logo" className="max-h-9" />
                  </Link>
                  <div className="flex items-center gap-3">
                    <Link to="/dashboard/profile">
                      {userPhoto && userPhoto !== "?" ? (
                        <img
                          src={userPhoto}
                          alt="User"
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
                          {getUserInitial()}
                        </div>
                      )}
                    </Link>
                  </div>
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
                <label
                  htmlFor="dashboard-drawer"
                  className="drawer-overlay"
                ></label>
                <motion.div
                  initial={{ x: 280 }}
                  animate={{ x: 0 }}
                  exit={{ x: 280 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-64 bg-base-200 text-base-content p-4 h-screen"
                >
                  <SideBar
                    onClose={() =>
                      (document.getElementById(
                        "dashboard-drawer"
                      ).checked = false)
                    }
                  />
                </motion.div>
              </div>
            </div>
          </header>
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
    </div>
  );
}
