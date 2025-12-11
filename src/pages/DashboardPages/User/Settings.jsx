import { useEffect, useState } from "react";

import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { updatePassword } from "firebase/auth";
import { useAuth } from "../../../Provider/AuthProvider";

export default function Settings() {
  const { user } = useAuth();

  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API}/users/${user.email}`);
      const data = await res.json();
      setDbUser(data);
    } catch (err) {
      Swal.fire("Error", "Failed to load settings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchUser();
  }, [user]);

  // ==========================
  // UPDATE PROFILE IN MONGODB
  // ==========================
  const handleSave = async (e) => {
    e.preventDefault();

    const form = e.target;
    const updatedUser = {
      name: form.name.value,
      phone: form.phone.value,
      address: form.address.value,
      photo: form.photo.value,
    };

    try {
      const res = await fetch(`${API}/users/update/${dbUser.email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error("Update failed");

      Swal.fire("Success", "Profile updated successfully!", "success");
      fetchUser();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // ==========================
  // CHANGE PASSWORD (Firebase)
  // ==========================
  const handlePasswordChange = async () => {
    Swal.fire({
      title: "Change Password",
      input: "password",
      inputLabel: "Enter a new password",
      inputPlaceholder: "New password",
      inputAttributes: {
        minlength: 6,
        required: true,
      },
      showCancelButton: true,
    }).then(async (res) => {
      if (!res.isConfirmed) return;

      try {
        await updatePassword(user, res.value);
        Swal.fire("Success", "Password updated successfully", "success");
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    });
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!dbUser)
    return <p className="text-center text-red-500">User not found!</p>;

  return (
    <section className="py-10 px-6 flex justify-center bg-base-100 min-h-screen">
      <motion.div
        className="glass-card max-w-3xl w-full p-8 rounded-xl shadow-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-6 font-rajdhani text-center">
          Settings
        </h2>

        <form onSubmit={handleSave} className="grid gap-6">
          {/* Photo */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={dbUser.photo}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow-md mb-3"
            />
            <input
              type="text"
              name="photo"
              defaultValue={dbUser.photo}
              className="input input-bordered w-full max-w-xs"
              placeholder="Profile Image URL"
            />
          </div>

          {/* Name Input */}
          <InputField
            label="Full Name"
            name="name"
            defaultValue={dbUser.name}
          />

          {/* Phone Input */}
          <InputField
            label="Phone Number"
            name="phone"
            defaultValue={dbUser.phone || ""}
          />

          {/* Address Input */}
          <InputField
            label="Address"
            name="address"
            defaultValue={dbUser.address || ""}
          />

          {/* Save Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="btn bg-gradient text-white w-full mt-4"
            type="submit"
          >
            Save Changes
          </motion.button>
        </form>

        {/* Change Password Button */}
        <div className="text-center mt-6">
          <button
            className="btn btn-outline btn-primary"
            onClick={handlePasswordChange}
          >
            Change Password
          </button>
        </div>
      </motion.div>
    </section>
  );
}

/* COMPONENT: Input Field */
const InputField = ({ label, name, defaultValue }) => (
  <div>
    <label className="font-semibold">{label}</label>
    <input
      type="text"
      name={name}
      className="input input-bordered w-full mt-1"
      defaultValue={defaultValue}
      required
    />
  </div>
);
