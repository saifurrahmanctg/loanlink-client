import { Link } from "react-router";
import { IoMoon, IoSunny } from "react-icons/io5";
import { useAuth } from "../../Provider/AuthProvider";
import logo from "../../assets/main-logo.png";
import { useState } from "react";

export default function DashboardNavbar({ onMenuClick }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const initial = user?.displayName?.charAt(0) || user?.email?.charAt(0) || "?";

  return (
    <header className="sticky top-0 z-50 w-full bg-base-200 shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Hamburger only on small screens */}
        <button
          onClick={onMenuClick}
          className="btn btn-ghost btn-circle md:hidden"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8" />
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
          {theme === "light" ? <IoMoon /> : <IoSunny />}
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient text-white grid place-items-center font-bold">
          {initial}
        </div>
      </div>
    </header>
  );
}
