/* Navbar.jsx */
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClickAway } from "react-use";
import { IoMoon } from "react-icons/io5";
import { MdSunny } from "react-icons/md";
import {
  FiHome,
  FiList,
  FiInfo,
  FiMail,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { TbLayoutDashboard } from "react-icons/tb";
import logo from "../../assets/main-logo.png";
import { useAuth } from "../../Provider/AuthProvider";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  /* ---------- avatar dropdown ---------- */
  const AvatarDropdown = () => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useClickAway(ref, () => setOpen(false));

    const initial =
      user?.displayName?.[0]?.toUpperCase() ||
      user?.email?.[0]?.toUpperCase() ||
      "?";

    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="hover:opacity-80 transition"
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="avatar"
              className="w-9 h-9 rounded-xl object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient text-white grid place-items-center font-bold">
              {initial}
            </div>
          )}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute right-0 mt-2 w-40 bg-base-100 rounded shadow-lg border border-base-300 z-50"
            >
              <NavLink
                to="/dashboard"
                className="btn w-full bg-gray-500 hover:bg-gray-700 text-white flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <TbLayoutDashboard />
                Dashboard
              </NavLink>

              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="btn w-full bg-red-500 hover:bg-red-700 text-white flex items-center gap-2"
              >
                <FiLogOut />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  /* ---------- nav links ---------- */
  const navLinks = [
    { name: "Home", path: "/", icon: <FiHome /> },
    { name: "All Loans", path: "/all-loans", icon: <FiList /> },
    { name: "About Us", path: "/about", icon: <FiInfo /> },
    { name: "Contact Us", path: "/contact", icon: <FiMail /> },
  ];

  /* ---------- theme button ---------- */
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

  // Logout handler
  const handleLogout = async () => {
    navigate("/", { replace: true });
    await logOut();
  };

  return (
    <nav className="navbar-container bg-base-300 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        {/* ---------- DESKTOP ---------- */}
        <div className="hidden lg:flex items-center justify-between h-16">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </Link>

          <div className="flex space-x-6 text-[#4A6CF7]">
            {navLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 transition-all duration-300 ${
                    isActive ? "font-bold border-b-2 border-[#4A6CF7]" : ""
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {ThemeButton}
            {user ? (
              <AvatarDropdown />
            ) : (
              <NavLink
                to="/login"
                state={{ from: location }}
                className="btn bg-gradient rounded flex items-center gap-2"
              >
                <FiLogIn />
                Login
              </NavLink>
            )}
          </div>
        </div>

        {/* ---------- MOBILE ---------- */}
        <div className="lg:hidden flex items-center justify-between h-16 w-full">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          <Link to="/" className="flex-1 flex justify-center">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </Link>

          <div className="flex items-center gap-3">
            {ThemeButton}
            {user ? (
              <AvatarDropdown />
            ) : (
              <NavLink
                to="/login"
                state={{ from: location }}
                className="btn bg-gradient rounded flex items-center gap-2"
              >
                <FiLogIn />
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* ---------- MOBILE MENU ---------- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-base-100 justify-center items-center px-4 py-3"
          >
            <div className="md:flex justify-center gap-5 items-center text-[#4A6CF7] space-y-3 md:space-y-0">
              {navLinks.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-1  transition-all duration-300 ${
                      isActive ? "font-bold" : ""
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
