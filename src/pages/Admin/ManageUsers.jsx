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

  /* =============================
        FETCH ALL USERS
  ============================= */
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

  /* =============================
        UPDATE USER ROLE 
  ============================= */
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

  /* =============================
     SHOW USER DETAILS MODAL 
  ============================= */
  const handleOpenUserModal = (userData) => {
    Swal.fire({
      title: `<strong>Manage User</strong>`,
      width: 500,
      html: `
        <div style="text-align:left; font-size:15px;">
          <img src="${
            userData.photo
          }" class="rounded" style="width:80px; height:80px; margin-bottom:10px;" />
          <p><strong>Name:</strong> ${userData.name}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Current Role:</strong> ${userData.role}</p>
          <p><strong>Created At:</strong> ${userData.createdAt || "-"}</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Change Role",
      cancelButtonText: "Close",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Select New Role",
          input: "select",
          inputOptions: {
            manager: "Manager",
            borrower: "Borrower",
            admin: "Admin",
          },
          inputValue: userData.role,
          showCancelButton: true,
        }).then((res) => {
          if (res.isConfirmed && res.value !== userData.role) {
            handleUpdateRole(userData.email, res.value);
          }
        });
      }
    });
  };

  /*  =============================
            SUSPEND USER 
      ============================= */
  const handleSuspendUser = async (userObj) => {
    Swal.fire({
      title: "Suspend User Account",
      html: `
        <input id="reason" class="swal2-input" placeholder="Reason for suspension">
        <textarea id="feedback" class="swal2-textarea" placeholder="Extra feedback"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: "Suspend",
      preConfirm: () => {
        const reason = document.getElementById("reason").value.trim();
        const feedback = document.getElementById("feedback").value.trim();
        if (!reason || !feedback) {
          Swal.showValidationMessage("Both fields are required.");
        }
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

  /* =============================
        ACCESS CONTROL
  ============================= */
  if (!user || user.role !== "admin") {
    return (
      <p className="text-red-600 font-bold p-6">
        You are not authorized to view this page.
      </p>
    );
  }

  /* =============================
        RENDER UI
  ============================= */
  return (
    <section className="py-10 px-6 bg-base-100">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Page Header */}
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
            <table className="table">
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
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-base-100">
                    <td>
                      <img src={u.photo} className="w-10 h-10 rounded-md" />
                    </td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <div
                        className={`badge ${
                          u.role === "manager"
                            ? "badge-success"
                            : u.role === "borrower"
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {u.role}
                      </div>
                    </td>
                    <td>
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
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </section>
  );
}
