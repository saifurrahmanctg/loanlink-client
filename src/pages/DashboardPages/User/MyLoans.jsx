import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../Provider/AuthProvider";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const API = import.meta.env.VITE_API_URL;

export default function MyLoans() {
  const { user } = useAuth();

  // UI State
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  /* Fetch User Loan Applications */
  const {
    data: applications = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["my-loans", user?.email],
    queryFn: async () => {
      const res = await fetch(`${API}/loan-applications/user/${user.email}`);
      return res.json();
    },
    enabled: !!user,
  });

  // Payment handler
  const handlePay = async (app) => {
    console.log("PAY CLICKED", app);

    const res = await fetch(`${API}/payments/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loanApplicationId: app._id,
        email: user.email,
      }),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  // Cancel handler
  const handleCancel = async (app) => {
    const result = await Swal.fire({
      title: "Cancel Loan?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
    });

    if (!result.isConfirmed) return;

    await fetch(`${API}/loan-applications/cancel/${app._id}`, {
      method: "PATCH",
    });

    Swal.fire("Cancelled!", "Loan has been cancelled.", "success");
    refetch();
  };

  /*  Delete Loan Application  */
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API}/loan-applications/${id}`, {
        method: "DELETE",
      });
      return res.json();
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Loan application has been deleted successfully.",
      });
      refetch();
    },
  });

  const handleDelete = (app) => {
    if (app.applicationFeeStatus === "Paid") {
      return Swal.fire({
        icon: "warning",
        title: "Cannot Delete",
        text: "You cannot delete a loan application after the fee is paid.",
      });
    }

    Swal.fire({
      title: "Delete Application?",
      text: "This will permanently remove the loan application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(app._id);
    });
  };

  /*  Filtered Results  */
  const filteredLoans = applications.filter((loan) => {
    const matchSearch = loan.loanTitle
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus = statusFilter
      ? loan.applicationFeeStatus === statusFilter
      : true;

    return matchSearch && matchStatus;
  });

  /* ---------------- UI ---------------- */
  return (
    <section className="py-10 px-6">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-rajdhani text-3xl font-bold mb-2">
            My <span className="text-gradient">Loans</span>
          </h2>
          <p className="text-gray-600">
            View, manage, and pay your loan applications
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by loan name..."
            className="input input-bordered w-full md:w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="select select-bordered w-full md:w-1/4"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Payment Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>

        {/* Table */}
        {isLoading ? (
          <p>Loading...</p>
        ) : filteredLoans.length === 0 ? (
          <div className="text-center bg-base-200 py-10 rounded-xl">
            <h3 className="text-lg font-semibold">
              No loan applications found
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto bg-base-300 shadow-md rounded-xl">
            <table className="table table-zebra">
              <thead className="bg-green-300 text-green-900">
                <tr>
                  <th>Loan Info</th>
                  <th>Amount</th>
                  <th>Interest</th>
                  <th>Loan Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLoans.map((app) => (
                  <tr key={app._id} className="hover:bg-base-200">
                    <td>
                      <p className="font-bold">{app.loanTitle}</p>
                      <p className="text-sm opacity-70">ID: {app.loanId}</p>
                    </td>

                    <td>৳{app.loanAmount}</td>
                    <td>{app.interestRate}%</td>

                    <td>
                      <span
                        className={`badge ${
                          app.status === "Pending"
                            ? "badge-warning"
                            : app.status === "Approved"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          app.applicationFeeStatus === "Paid"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {app.applicationFeeStatus}
                      </span>
                    </td>

                    <td>
                      <div className="flex gap-2">
                        {/* View */}
                        <button
                          className="btn btn-sm btn-info text-white"
                          onClick={() => setSelectedLoan(app)}
                        >
                          View
                        </button>

                        {/* Cancel (Only Pending) */}

                        <button
                          disabled={app.status !== "Pending"}
                          onClick={() => handleCancel(app)}
                          className="btn btn-sm btn-warning text-white"
                        >
                          Cancel
                        </button>

                        {/* Pay / Paid */}
                        {app.applicationFeeStatus === "Unpaid" ? (
                          <button
                            onClick={() => handlePay(app)}
                            className="btn btn-sm btn-primary text-white"
                          >
                            Pay
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              const res = await fetch(
                                `${API}/payments/${app._id}`
                              );
                              const data = await res.json();
                              setSelectedPayment(data);
                            }}
                            className="btn btn-sm btn-success"
                          >
                            Paid
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          disabled={app.applicationFeeStatus === "Paid"}
                          onClick={() => handleDelete(app)}
                          className={`btn btn-sm ${
                            app.applicationFeeStatus === "Paid"
                              ? "btn-disabled"
                              : "btn-error text-white"
                          }`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* View Modal */}
        {selectedLoan && (
          <dialog className="modal" open>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="modal-box bg-green-200 shadow-xl rounded-2xl backdrop-blur-lg w-11/12 max-w-3xl max-h-[85vh] overflow-y-auto"
            >
              <h3 className="font-rajdhani text-3xl font-bold text-gradient text-center mb-6">
                Loan Application Details
              </h3>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Detail label="Loan Title" value={selectedLoan.loanTitle} />
                <Detail
                  label="Interest"
                  value={`${selectedLoan.interestRate}%`}
                />
                <Detail label="Amount" value={`৳${selectedLoan.loanAmount}`} />
                <Detail
                  label="Monthly Income"
                  value={`৳${selectedLoan.monthlyIncome}`}
                />
                <Detail
                  label="Income Source"
                  value={selectedLoan.incomeSource}
                />
                <Detail label="Reason" value={selectedLoan.reason} />
                <Detail
                  label="Name"
                  value={`${selectedLoan.firstName} ${selectedLoan.lastName}`}
                />
                <Detail label="Email" value={selectedLoan.userEmail} />
                <Detail label="Contact" value={selectedLoan.contactNumber} />
                <Detail label="NID/Passport" value={selectedLoan.nationalId} />
                <Detail label="Address" value={selectedLoan.address} />
                <Detail label="Notes" value={selectedLoan.notes || "N/A"} />

                <Detail
                  label="Loan Status"
                  value={
                    <span
                      className={`badge ${
                        selectedLoan.status === "Pending"
                          ? "badge-warning"
                          : selectedLoan.status === "Approved"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {selectedLoan.status}
                    </span>
                  }
                />

                <Detail
                  label="Fee Status"
                  value={
                    <span
                      className={`badge ${
                        selectedLoan.applicationFeeStatus === "Paid"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {selectedLoan.applicationFeeStatus}
                    </span>
                  }
                />

                <Detail
                  label="Submitted At"
                  value={new Date(selectedLoan.submittedAt).toLocaleString()}
                />
              </div>

              <div className="modal-action">
                <button
                  className="btn btn-neutral"
                  onClick={() => setSelectedLoan(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </dialog>
        )}

        {selectedPayment && (
          <dialog className="modal" open>
            <div className="modal-box">
              <h3 className="font-bold text-xl text-gradient text-center mb-4">
                Payment Details
              </h3>

              <p>
                <b>Email:</b> {selectedPayment.email}
              </p>
              <p>
                <b>Transaction ID:</b> {selectedPayment.transactionId}
              </p>
              <p>
                <b>Loan ID:</b> {selectedPayment.loanApplicationId}
              </p>
              <p>
                <b>Amount:</b> $10
              </p>
              <p>
                <b>Date:</b> {new Date(selectedPayment.paidAt).toLocaleString()}
              </p>

              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setSelectedPayment(null)}
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

/* Reusable Detail Component */
const Detail = ({ label, value }) => (
  <div className="p-3 rounded-xl bg-base-100 shadow-sm">
    <p className="text-xs font-semibold text-gray-500">{label}</p>
    <p className="text-green-500 font-medium mt-1">{value}</p>
  </div>
);
