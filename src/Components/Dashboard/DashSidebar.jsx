import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
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
import { FaList } from "react-icons/fa6";
import { FiSettings, FiClock, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../../Provider/AuthProvider";
import logo from "../../assets/main-logo.png";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const DashSidebar = ({ onLinkClick }) => {
  const { user, logOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
      label: "Manage Loans",
      path: "/dashboard/manage-loans",
      icon: <FiSettings />,
      roles: ["manager"],
    },
    {
      label: "Pending Loans",
      path: "/dashboard/pending-loans",
      icon: <FiClock />,
      roles: ["manager"],
    },
    {
      label: "Approved Loans",
      path: "/dashboard/approved-loans",
      icon: <FiCheckCircle />,
      roles: ["manager"],
    },
    {
      label: "Manage Users",
      path: "/dashboard/manage-users",
      icon: <FaFileAlt />,
      roles: ["admin"],
    },
    {
      label: "All Loans",
      path: "/dashboard/all-loans",
      icon: <FaList />,
      roles: ["admin"],
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

  const handleLogout = async () => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        navigate("/", { replace: true });
        await logOut();
        MySwal.fire({
          icon: "success",
          title: "Logged out successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        MySwal.fire("Error", err.message, "error");
      }
    }
  };

  /* ---- wrapper ---- */
  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick();
  };

  return (
    <div className="w-64 bg-base-300 text-base-content p-4 min-h-screen flex flex-col">
      <Link
        to="/"
        className="flex items-center gap-2 mb-6"
        onClick={handleLinkClick}
      >
        <img src={logo} alt="Logo" className="h-8" />
      </Link>

      <ul className="menu space-y-2 flex-1 w-full">
        {menuItems
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-3 py-2 rounded transition ${
                  location.pathname === item.path
                    ? "active bg-gradient"
                    : "hover:bg-blue-500"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
      </ul>

      <div className="mt-auto border-t pt-4">
        <ul className="menu space-y-2 w-full">
          {userMenu
            .filter((item) => item.roles.includes(user?.role))
            .map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-3 py-2 rounded transition ${
                    location.pathname === item.path
                      ? "active bg-gradient"
                      : "hover:bg-blue-500"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
        </ul>
        <button
          onClick={handleLogout}
          className="btn bg-red-500 hover:bg-red-700 w-full text-white mt-4 flex items-center justify-center gap-2"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default DashSidebar;
