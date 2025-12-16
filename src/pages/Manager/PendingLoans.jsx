import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "../../Provider/AuthProvider";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const API = import.meta.env.VITE_API_URL;

export default function PendingLoans() {
  const { user } = useAuth();
  const [selectedLoan, setSelectedLoan] = useState(null);

  /* ---------------- Fetch Pending Loans ---------------- */
  const {
    data: loans = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["pending-loans"],
    queryFn: async () => {
      const res = await fetch(`${API}/loan-applications/status/pending`);
      return res.json();
    },
  });

  /* ---------------- Approve Loan ---------------- */
  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API}/loan-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved", approvedAt: new Date() }),
      });
      return res.json();
    },
    onSuccess: () => {
      Swal.fire("Approved!", "Loan application approved.", "success");
      refetch();
    },
  });

  const handleApprove = (id) => {
    Swal.fire({
      title: "Approve Loan?",
      text: "This will approve the loan application.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Approve",
    }).then((result) => {
      if (result.isConfirmed) approveMutation.mutate(id);
    });
  };

  /* ---------------- Reject Loan ---------------- */
  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API}/loan-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Rejected",
          rejectedAt: new Date(),
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      Swal.fire("Rejected!", "Loan application rejected.", "success");
      refetch();
    },
  });

  const handleReject = (id) => {
    Swal.fire({
      title: "Reject Loan?",
      text: "This will reject the loan application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Reject",
    }).then((result) => {
      if (result.isConfirmed) rejectMutation.mutate(id);
    });
  };

  /* ---------------- View Loan Modal ---------------- */
  const Detail = ({ label, value }) => (
    <div className="p-3 rounded border bg-base-300 shadow-sm">
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className="text-base font-medium mt-1">{value}</p>
    </div>
  );

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
            Pending <span className="text-gradient">Loan Applications</span>
          </h2>
          <p className="text-gray-600">Approve or reject loan applications</p>
        </div>

        {/* Loading / Empty */}
        {isLoading ? (
          <div className="flex justify-center items-center gap-3">
            <span className="loading loading-spinner loading-xl text-info"></span>
            <h3 className="text-gradient text-xl font-bold">
              Pending Loan Applications are Loading . . .
            </h3>
          </div>
        ) : loans.length === 0 ? (
          <div className="text-center p-10 bg-base-200 rounded-xl">
            <h2 className="text-xl font-semibold">No Pending Loans</h2>
          </div>
        ) : (
          <div className="overflow-x-auto bg-base-300 shadow-md rounded-xl">
            <table className="table table-zebra">
              <thead className="bg-yellow-200 text-yellow-800">
                <tr>
                  <th>Loan Info</th>
                  <th>User Info</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan._id}>
                    <td>
                      Title: {loan.loanTitle} <br />
                      Id: {loan.loanId}
                    </td>
                    <td>
                      <p className="font-bold">
                        {loan.firstName} {loan.lastName}
                      </p>
                      <p className="text-sm">{loan.userEmail}</p>
                    </td>
                    <td>৳{loan.loanAmount}</td>
                    <td>{new Date(loan.submittedAt).toLocaleString()}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => setSelectedLoan(loan)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-success"
                          disabled={approveMutation.isLoading}
                          onClick={() => handleApprove(loan._id)}
                        >
                          {approveMutation.isLoading
                            ? "Approving..."
                            : "Approve"}
                        </button>

                        <button
                          className="btn btn-sm btn-error"
                          disabled={rejectMutation.isLoading}
                          onClick={() => handleReject(loan._id)}
                        >
                          {rejectMutation.isLoading ? "Rejecting..." : "Reject"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ---------------- VIEW MODAL ---------------- */}
      {selectedLoan && (
        <dialog open className="modal">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="modal-box rounded-xl bg-green-100 backdrop-blur-lg shadow-xl max-w-3xl max-h-[85vh] overflow-y-auto border border-gray-200"
          >
            <h3 className="font-rajdhani text-3xl font-bold mb-6 text-gradient text-center">
              Loan Application Details
            </h3>
            <h5 className="bg-warning w-fit rounded px-2 py-1 text-blue-700 font-semibold">
              Payment Status: {selectedLoan.applicationFeeStatus}
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Detail label="Loan ID" value={selectedLoan.loanId} />
              <Detail label="Loan Title" value={selectedLoan.loanTitle} />
              <Detail
                label="User Name"
                value={`${selectedLoan.firstName} ${selectedLoan.lastName}`}
              />
              <Detail label="Email" value={selectedLoan.userEmail} />
              <Detail label="Amount" value={`৳${selectedLoan.loanAmount}`} />
              <Detail
                label="Monthly Income"
                value={`৳${selectedLoan.monthlyIncome}`}
              />
              <Detail label="Income Source" value={selectedLoan.incomeSource} />
              <Detail label="Reason" value={selectedLoan.reason} />
              <Detail label="Address" value={selectedLoan.address} />
              <Detail label="Notes" value={selectedLoan.notes || "N/A"} />
              <Detail
                label="Submitted At"
                value={new Date(selectedLoan.submittedAt).toLocaleString()}
              />
            </div>
            <div className="modal-action sticky bottom-0 py-3">
              <button
                onClick={() => setSelectedLoan(null)}
                className="btn btn-neutral rounded-lg"
              >
                Close
              </button>
            </div>
          </motion.div>
        </dialog>
      )}
    </section>
  );
}
