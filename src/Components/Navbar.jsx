import { Link, NavLink } from "react-router";
import { useState, useEffect } from "react";
import logo from "../assets/main-logo.png";
import { IoMoon } from "react-icons/io5";

import { MdSunny } from "react-icons/md";

export default function Navbar({ isLoggedIn, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.querySelector("html").setAttribute("data-theme", savedTheme);
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.querySelector("html").setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const links = (
    <>
      <NavLink
        to="/"
        className="border-b-2 border-transparent hover:border-[#4A6CF7] transition-colors"
      >
        Home
      </NavLink>
      <NavLink
        to="/all-loans"
        className="border-b-2 border-transparent hover:border-[#4A6CF7] transition-colors"
      >
        All Loans
      </NavLink>

      <NavLink
        to="/about"
        className="border-b-2 border-transparent hover:border-[#4A6CF7] transition-colors"
      >
        About Us
      </NavLink>
      <NavLink
        to="/contact"
        className="border-b-2 border-transparent hover:border-[#4A6CF7] transition-colors"
      >
        Contact
      </NavLink>
      <NavLink
        to="/login"
        className=" bg-gradient px-4 py-1.5 rounded cursor-pointer"
      >
        Login
      </NavLink>

      {isLoggedIn && (
        <>
          <NavLink to="/dashboard" className="hover:underline">
            Dashboard
          </NavLink>
          <button onClick={onLogout} className="hover:underline">
            Logout
          </button>
        </>
      )}
    </>
  );

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-base-200 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT --- LOGO */}
          <Link to="/">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex space-x-6 items-center text-[#4A6CF7]">
            {links}
            {/* THEME TOGGLE BUTTON */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[#3BADE3] hover:bg-blue-600 transition"
            >
              {theme === "light" ? (
                // Moon icon
                <IoMoon size={16} fill="white" />
              ) : (
                // Sun icon
                <MdSunny size={18} fill="white" />
              )}
            </button>
          </div>

          {/* MOBILE HAMBURGER */}
          <div className="md:hidden flex items-center gap-3">
            {/* THEME TOGGLE (MOBILE) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[#3BADE3] hover:bg-blue-600 transition"
            >
              {theme === "light" ? (
                // Moon icon
                <IoMoon size={16} fill="white" />
              ) : (
                // Sun icon
                <MdSunny size={18} fill="white" />
              )}
            </button>

            {/* Hamburger */}
            <button
              className="text-gray-700 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <div className="max-w-2xs md:hidden bg-base-100 shadow-lg">
          <div className="px-2 pt-2 pb-4 space-y-1 flex flex-col text-[#4A6CF7]">
            {links}

            {isLoggedIn && (
              <>
                <NavLink
                  to="/dashboard"
                  className="block px-3 py-2 hover:bg-gray-100"
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
