import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";
import { FaHome, FaWallet, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../Provider/AuthProvider";

const menuItems = [
  { label: "Home", path: "/dashboard", icon: <FaHome /> },
  { label: "My Loans", path: "/dashboard/my-loans", icon: <FaWallet /> },
  { label: "Profile", path: "/dashboard/profile", icon: <FaUser /> },
  { label: "Settings", path: "/dashboard/settings", icon: <FaCog /> },
];

export default function DashboardSidebar({ isOpen, onClose }) {
  const { user, logOut } = useAuth();
  const location = useLocation();
  const initial = user?.displayName?.charAt(0) || user?.email?.charAt(0) || "?";

  const content = (
    <div className="w-64 bg-base-200 text-base-content p-4 min-h-screen sticky top-0 flex flex-col">
      {/* Menu */}
      <ul className="menu space-y-2 flex-1 w-full">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded transition ${
                location.pathname === item.path
                  ? "active bg-gradient text-white"
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
      <div className="mt-auto pt-4 border-t">
        <button
          onClick={logOut}
          className="btn btn-ghost btn-sm gap-2 text-red-600 w-full"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );

  /* ---------- DESKTOP: fixed sidebar ---------- */
  if (window.innerWidth >= 768) return content;

  /* ---------- MOBILE: drawer slide ---------- */
  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      exit={{ x: -280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-64 bg-base-200 text-base-content p-4 h-screen"
    >
      {content}
    </motion.div>
  );
}
