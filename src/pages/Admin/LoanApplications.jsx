import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import DashboardHeader from "../../Components/Dashboard/DashboardHeader";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const API = import.meta.env.VITE_API_URL;

export default function LoanApplications() {
  const [filter, setFilter] = useState("");

  // Fetch all applications
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["loanApplications", filter],
    queryFn: async () => {
      const res = await fetch(
        `${API}/loan-applications${filter ? `?status=${filter}` : ""}`
      );
      return res.json();
    },
  });

  const [selectedApp, setSelectedApp] = useState(null);

  if (isLoading) return <p className="text-center py-20">Loading...</p>;

  return (
    <>
      {/* Dashboard Header */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <DashboardHeader title="Loan Applications" />
      </motion.div>
      <motion.div
        className="p-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h1 className="text-3xl text-center text-gradient font-bold mb-6 font-rajdhani">
          Loan Applications
        </h1>

        {/* Filter */}
        <div className="mb-6 flex gap-4">
          <select
            className="select select-bordered"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className=" bg-base-200 shadow rounded-xl">
          <table className="table">
            <thead className="bg-base-300">
              <tr>
                <th>Loan ID</th>
                <th>User Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>{app.loanId}</td>

                  <td>
                    <div>
                      <p className="text-sm">
                        {app.firstName} {app.lastName}
                      </p>
                    </div>
                  </td>

                  <td>{app.loanTitle}</td>

                  <td>৳{Number(app.loanAmount).toLocaleString()}</td>

                  <td>
                    <div
                      className={`badge ${
                        app.status === "Pending"
                          ? "badge-warning"
                          : app.status === "Approved"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {app.status}
                    </div>
                  </td>

                  <td>
                    <button
                      className="btn btn-sm bg-gradient"
                      onClick={() => setSelectedApp(app)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {selectedApp && (
          <dialog
            open
            className="modal modal-open"
            onClose={() => setSelectedApp(null)}
          >
            <div className="modal-box max-w-2xl bg-base-300">
              <h3 className="text-2xl font-bold text-center text-gradient mb-5">
                Application Details
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <p>
                  <strong>Name:</strong> {selectedApp.firstName}{" "}
                  {selectedApp.lastName}
                </p>

                <p>
                  <strong>Email:</strong> {selectedApp.userEmail}
                </p>

                <p>
                  <strong>Loan Title:</strong> {selectedApp.loanTitle}
                </p>

                <p>
                  <strong>Loan Amount:</strong> ৳
                  {Number(selectedApp.loanAmount).toLocaleString()}
                </p>

                <p>
                  <strong>Income:</strong> ৳
                  {Number(selectedApp.monthlyIncome).toLocaleString()}
                </p>
                <p>
                  <strong>Income Source:</strong> {selectedApp.incomeSource}
                </p>
                <p>
                  <strong>Contact:</strong> {selectedApp.contactNumber}
                </p>

                <p>
                  <strong>NID / Passport:</strong> {selectedApp.nationalId}
                </p>

                <p>
                  <strong>Loan Status:</strong>{" "}
                  <span
                    className={`badge ${
                      selectedApp.status === "Pending"
                        ? "badge-warning"
                        : selectedApp.status === "Approved"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {selectedApp.status}
                  </span>
                </p>
              </div>

              <h4 className="font-semibold mb-1">Reason</h4>
              <p className="mb-4">{selectedApp.reason}</p>

              <h4 className="font-semibold mb-1">Address</h4>
              <p className="mb-4">{selectedApp.address}</p>

              {selectedApp.notes && (
                <>
                  <h4 className="font-semibold mb-1">Notes</h4>
                  <p className="mb-4">{selectedApp.notes}</p>
                </>
              )}

              <div className="modal-action">
                <button
                  className="btn bg-gradient"
                  onClick={() => setSelectedApp(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}
      </motion.div>
    </>
  );
}
