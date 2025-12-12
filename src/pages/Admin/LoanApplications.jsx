import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaInbox } from "react-icons/fa";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const API = import.meta.env.VITE_API_URL;

export default function LoanApplications() {
  const [filter, setFilter] = useState("");

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["loanApplications", filter],
    queryFn: async () => {
      const res = await fetch(
        `${API}/loan-applications${filter ? `?status=${filter}` : ""}`
      );
      return res.json();
    },
    keepPreviousData: true,
  });

  const [selectedApp, setSelectedApp] = useState(null);

  if (isLoading)
    return <p className="text-center py-20 text-gray-500">Loading...</p>;

  const filteredApps = applications;

  return (
    <section className="py-10 px-6 bg-base-100 min-h-screen">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-rajdhani text-3xl font-bold mb-2">
            Loan <span className="text-gradient">Applications</span>
          </h2>
          <p className="text-gray-600">
            Check and manage all loan applications
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-4 items-center">
          <label className="font-medium">Filter by Status:</label>
          <select
            className="select select-bordered w-48"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* No Data */}
        {filteredApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
            <FaInbox className="text-6xl mb-4 text-gray-400" />
            <p className="text-xl font-semibold">
              No applications found{filter ? ` for "${filter}"` : ""}.
            </p>
            <p className="text-gray-400 mt-2">
              Try selecting a different filter or check back later.
            </p>
          </div>
        ) : (
          // Table
          <div className="overflow-x-auto bg-base-200 shadow rounded-xl">
            <table className="table table-zebra table-hover">
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
                {filteredApps.map((app) => {
                  const highlight =
                    filter && app.status.toLowerCase() === filter.toLowerCase();

                  return (
                    <motion.tr
                      key={app._id}
                      className={`transition-all duration-300 cursor-pointer ${
                        highlight
                          ? "bg-green-100 hover:bg-green-200"
                          : "hover:bg-base-300"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <td>{app.loanId}</td>
                      <td>
                        {app.firstName} {app.lastName}
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
                          className="btn btn-sm bg-gradient hover:scale-105 transition-transform"
                          onClick={() => setSelectedApp(app)}
                        >
                          View
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {selectedApp && (
          <dialog
            open
            className="modal modal-open"
            onClose={() => setSelectedApp(null)}
          >
            <div className="modal-box max-w-3xl bg-base-200">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="font-rajdhani text-3xl font-bold mb-2">
                  Loan Application{" "}
                  <span className="text-gradient">Details</span>
                </h2>
                <p className="text-gray-600">
                  See details of application #{selectedApp._id}
                </p>
              </div>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-2xl font-bold text-blue-500 border-l-4 pl-2">
                  {selectedApp.loanTitle}
                </h3>
                <button
                  className="btn btn-sm btn-circle btn-ghost"
                  onClick={() => setSelectedApp(null)}
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p>
                    <strong>Name:</strong> {selectedApp.firstName}{" "}
                    {selectedApp.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedApp.userEmail}
                  </p>
                  <p>
                    <strong>Contact:</strong> {selectedApp.contactNumber}
                  </p>
                  <p>
                    <strong>NID / Passport:</strong> {selectedApp.nationalId}
                  </p>
                </div>

                <div>
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
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-1">Reason</h4>
                <p className="mb-2">{selectedApp.reason}</p>

                <h4 className="font-semibold mb-1">Address</h4>
                <p>{selectedApp.address}</p>

                {selectedApp.notes && (
                  <>
                    <h4 className="font-semibold mb-1 mt-4">Notes</h4>
                    <p>{selectedApp.notes}</p>
                  </>
                )}
              </div>

              <div className="modal-action">
                <button
                  className="btn bg-gradient hover:scale-105 transition-transform"
                  onClick={() => setSelectedApp(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}
      </motion.div>
    </section>
  );
}
