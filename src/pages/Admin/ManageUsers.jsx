import { useEffect, useState } from "react";
import { useAuth } from "../../Provider/AuthProvider";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ManageUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update Role
  const handleUpdateRole = async (email, newRole) => {
    try {
      const res = await fetch(`${API}/users/role/${email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      Swal.fire("Success", "User role updated successfully.", "success");
      fetchUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message, "error");
    }
  };

  // Modern Update Role Modal
  const handleOpenUserModal = (userData) => {
    Swal.fire({
      title: "Manage User",
      html: `
        <div class="flex flex-col gap-4 text-left">
          <div class="flex items-center gap-4">
            <img src="${
              userData.photo
            }" class="w-16 h-16 rounded-full object-cover" />
            <div>
              <p class="font-semibold">${userData.name}</p>
              <p class="text-sm text-gray-500">${userData.email}</p>
            </div>
          </div>
          <p><strong>Current Role:</strong> ${userData.role}</p>
        </div>
        <select id="roleSelect" class="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="manager" ${
            userData.role === "manager" ? "selected" : ""
          }>Manager</option>
          <option value="borrower" ${
            userData.role === "borrower" ? "selected" : ""
          }>Borrower</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: "Update Role",
      cancelButtonText: "Close",
      focusConfirm: false,
      preConfirm: () => {
        const newRole = document.getElementById("roleSelect").value;
        return newRole;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value !== userData.role) {
        handleUpdateRole(userData.email, result.value);
      }
    });
  };

  // Modern Suspend User Modal
  const handleSuspendUser = async (userObj) => {
    Swal.fire({
      title: "Suspend User Account",
      html: `
        <div class="flex flex-col gap-3">
          <label class="font-semibold">Reason for suspension</label>
          <input id="reason" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Reason" />
          <label class="font-semibold">Extra Feedback (optional)</label>
          <textarea id="feedback" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Feedback"></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Suspend",
      preConfirm: () => {
        const reason = document.getElementById("reason").value.trim();
        const feedback = document.getElementById("feedback").value.trim();
        if (!reason) Swal.showValidationMessage("Reason is required.");
        return { reason, feedback };
      },
    }).then(async (form) => {
      if (!form.value) return;
      const confirmSuspend = await Swal.fire({
        title: "Are you sure?",
        text: `This will permanently remove ${userObj.email} from the database.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, Suspend",
      });
      if (!confirmSuspend.isConfirmed) return;
      try {
        const res = await fetch(`${API}/users/${userObj._id}/suspend`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form.value),
        });
        if (!res.ok) throw new Error("Failed to suspend user");
        Swal.fire(
          "Suspended",
          "User account has been suspended and removed.",
          "success"
        );
        fetchUsers();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", err.message, "error");
      }
    });
  };

  if (!user || user.role !== "admin") {
    return (
      <p className="text-red-600 font-bold p-6">
        You are not authorized to view this page.
      </p>
    );
  }

  return (
    <section className="py-10 px-6 bg-base-100">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-rajdhani text-3xl font-bold mb-2">
            Manage <span className="text-gradient">Users</span>
          </h2>
          <p className="text-gray-600">
            View, update and suspend user accounts
          </p>
        </div>

        {loading ? (
          <p className="text-center">Loading users...</p>
        ) : (
          <div className="overflow-x-auto bg-base-200 shadow rounded-xl">
            <table className="table table-zebra">
              <thead>
                <tr className="bg-base-300">
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No users found.
                    </td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-base-100 transition-all duration-200"
                  >
                    <td>
                      <img
                        src={u.photo}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                    </td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === "manager"
                            ? "badge-accent"
                            : u.role === "borrower"
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="text-center">
                      {u.role === "admin" ? (
                        <button className="btn btn-sm bg-accent cursor-not-allowed">
                          System Admin
                        </button>
                      ) : (
                        <div className="flex gap-2 justify-center">
                          <button
                            className="btn btn-sm bg-gradient"
                            onClick={() => handleOpenUserModal(u)}
                          >
                            Update Role
                          </button>
                          <button
                            className="btn btn-sm bg-red-600 text-white"
                            onClick={() => handleSuspendUser(u)}
                          >
                            Suspend
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </section>
  );
}
