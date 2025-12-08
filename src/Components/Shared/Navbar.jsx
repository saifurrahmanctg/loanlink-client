/* Navbar.jsx */
import { Link, NavLink } from "react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClickAway } from "react-use";
import { IoMoon } from "react-icons/io5";
import { MdSunny } from "react-icons/md";
import logo from "../../assets/main-logo.png";
import { useAuth } from "../../Provider/AuthProvider";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const { user, logOut } = useAuth();

  /* ---------- Load Saved Theme ---------- */
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

  /* ---------- Avatar Dropdown ---------- */
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
              className="w-9 h-9 rounded-full object-cover"
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
                className="block px-4 py-2 hover:bg-base-200"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </NavLink>

              <button
                onClick={() => {
                  setOpen(false);
                  logOut();
                }}
                className="block w-full text-left px-4 py-2 hover:bg-base-200"
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  /* ---------- Navigation Links ---------- */
  const navLinks = (
    <>
      <NavLink to="/" className="nav-link">
        Home
      </NavLink>
      <NavLink to="/all-loans" className="nav-link">
        All Loans
      </NavLink>
      <NavLink to="/about" className="nav-link">
        About Us
      </NavLink>
      <NavLink to="/contact" className="nav-link">
        Contact Us
      </NavLink>
    </>
  );

  /* ---------- Theme Button Component ---------- */
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

  return (
    <nav className="navbar-container bg-base-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        {/* ---------- DESKTOP NAV ---------- */}
        <div className="hidden md:flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </Link>

          {/* Links */}
          <div className="flex space-x-6 text-[#4A6CF7]">{navLinks}</div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <AvatarDropdown />
            ) : (
              <NavLink to="/login" className="login-btn">
                Login
              </NavLink>
            )}
            {ThemeButton}
          </div>
        </div>

        {/* ---------- MOBILE NAV ---------- */}
        <div className="md:hidden flex items-center justify-between h-16 w-full">
          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="h-7 w-7" fill="none" stroke="currentColor">
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex-1 flex justify-center">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </Link>

          {/* Theme + Avatar */}
          <div className="flex items-center gap-3">
            {ThemeButton}
            {user ? (
              <AvatarDropdown />
            ) : (
              <NavLink to="/login" className="login-btn">
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
            className="md:hidden bg-base-100 px-4 pb-4"
          >
            <div className="flex flex-col space-y-3 text-[#4A6CF7]">
              {navLinks}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
