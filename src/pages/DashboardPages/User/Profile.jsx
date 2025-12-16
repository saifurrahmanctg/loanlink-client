import { useEffect, useState } from "react";
import { useAuth } from "../../../Provider/AuthProvider";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { FaSignOutAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function Profile() {
  const { user, logOut } = useAuth();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${API}/users/${user.email}`);
      const data = await res.json();
      setDbUser(data);
    } catch (err) {
      Swal.fire("Error", "Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchUserData();
  }, [user]);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  if (!dbUser)
    return (
      <p className="text-center text-red-600 font-semibold">
        User not found in database!
      </p>
    );

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

  return (
    <section className="py-10 px-6 bg-base-100 min-h-screen flex justify-center">
      <motion.div
        className="glass-card max-w-3xl w-full bg-base-300 rounded-xl shadow-xl p-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <motion.img
            src={dbUser.photo}
            className="w-28 h-28 rounded-full shadow-md object-cover border-4 border-primary mb-4"
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          />

          <h2 className="text-3xl font-bold font-rajdhani">{dbUser.name}</h2>

          <p className="text-gray-500">{dbUser.email}</p>

          <span
            className={`badge mt-3 px-3 py-2 text-sm ${
              dbUser.role === "admin"
                ? "badge-error"
                : dbUser.role === "manager"
                ? "badge-success"
                : "badge-warning"
            }`}
          >
            {dbUser.role?.toUpperCase()}
          </span>
        </div>

        {/* Divider */}
        <div className="divider my-8"></div>

        {/* Profile Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <ProfileItem label="Full Name" value={dbUser.name} />
          <ProfileItem label="Email" value={dbUser.email} />
          <ProfileItem
            label="Account Created"
            value={new Date(dbUser.createdAt).toLocaleString() || "N/A"}
          />
          <ProfileItem
            label="Last Login"
            value={dbUser.lastLogin || "Not Recorded"}
          />
          <ProfileItem
            label="Phone Number"
            value={dbUser.phone || "Not Provided"}
          />
          <ProfileItem
            label="Address"
            value={dbUser.address || "Not Provided"}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between text-center mt-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="btn bg-gradient text-white px-8"
            onClick={() =>
              Swal.fire("Coming Soon", "Edit feature in progress!", "info")
            }
          >
            Edit Profile
          </motion.button>
          <motion.button
            onClick={handleLogout}
            className="btn bg-red-500 hover:bg-red-700 md:hidden text-white flex items-center justify-center gap-2"
          >
            <FaSignOutAlt /> Logout
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}

/* Small component for cleaner UI */
const ProfileItem = ({ label, value }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
    className="p-4 bg-base-200 rounded-lg shadow-sm border"
  >
    <p className="text-xs text-gray-400 uppercase mb-1">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </motion.div>
);
