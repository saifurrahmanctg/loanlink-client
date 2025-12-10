import { Link, useNavigate } from "react-router";
import { useAuth } from "../Provider/AuthProvider";
import { FaLock, FaSignOutAlt } from "react-icons/fa";

export default function AccessDenied() {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-base-200 text-center px-6">
      <div className="bg-base-100 shadow-xl p-10 rounded-2xl max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-red-600 text-white p-4 rounded-full shadow-lg">
            <FaLock className="text-4xl" />
          </div>
        </div>

        <h1 className="text-3xl font-bold font-rajdhani text-red-600">
          Access Denied
        </h1>

        <p className="text-gray-500 mt-2">
          You don't have permission to access this page.
        </p>

        <div className="mt-8 space-y-3">
          <button
            onClick={handleLogout}
            className="btn w-full bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
