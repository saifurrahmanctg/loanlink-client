import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const API = import.meta.env.VITE_API_URL;

export default function ApprovedLoans() {
  const [selectedLoan, setSelectedLoan] = useState(null);

  /* ---------------- Fetch Approved Loans ---------------- */
  const { data: loans = [], isLoading } = useQuery({
    queryKey: ["approved-loans"],
    queryFn: async () => {
      const res = await fetch(`${API}/loan-applications/status/approved`);
      return res.json();
    },
  });

  /* ---------------- Detail Card ---------------- */
  const Detail = ({ label, value }) => (
    <div className="p-3 rounded-xl border bg-white/60 shadow-sm">
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
            Approved <span className="text-gradient">Loans</span>
          </h2>
          <p className="text-gray-600">
            All loan applications that have been approved
          </p>
        </div>

        {/* Loading / Empty */}
        {isLoading ? (
          <p>Loading...</p>
        ) : loans.length === 0 ? (
          <div className="text-center p-10 bg-base-200 rounded-xl">
            <h2 className="text-xl font-semibold">No Approved Loans Found</h2>
          </div>
        ) : (
          <div className="overflow-x-auto bg-base-300 shadow-md rounded-xl">
            <table className="table table-zebra">
              <thead className="bg-green-200 text-green-800">
                <tr>
                  <th>Loan ID</th>
                  <th>User Info</th>
                  <th>Amount</th>
                  <th>Approved Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loans.map((loan) => (
                  <tr key={loan._id}>
                    <td>{loan.loanId}</td>

                    <td>
                      <p className="font-bold">
                        {loan.firstName} {loan.lastName}
                      </p>
                      <p className="text-sm">{loan.userEmail}</p>
                    </td>

                    <td>৳{loan.loanAmount}</td>

                    <td>
                      {loan.approvedAt
                        ? new Date(loan.approvedAt).toLocaleString()
                        : "N/A"}
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => setSelectedLoan(loan)}
                      >
                        View
                      </button>
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
            className="modal-box rounded-2xl bg-green-100 backdrop-blur-lg shadow-xl max-w-3xl max-h-[85vh] overflow-y-auto border border-gray-200"
          >
            <h3 className="font-rajdhani text-3xl font-bold mb-6 text-gradient text-center">
              Approved Loan Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="Loan ID" value={selectedLoan.loanId} />
              <Detail label="Loan Title" value={selectedLoan.loanTitle} />
              <Detail
                label="Borrower"
                value={`${selectedLoan.firstName} ${selectedLoan.lastName}`}
              />
              <Detail label="Email" value={selectedLoan.userEmail} />
              <Detail label="Amount" value={`৳${selectedLoan.loanAmount}`} />
              <Detail
                label="Interest Rate"
                value={`${selectedLoan.interestRate}%`}
              />
              <Detail
                label="Approved At"
                value={
                  selectedLoan.approvedAt
                    ? new Date(selectedLoan.approvedAt).toLocaleString()
                    : "N/A"
                }
              />
              <Detail label="Reason" value={selectedLoan.reason} />
              <Detail label="Address" value={selectedLoan.address} />
              <Detail label="Notes" value={selectedLoan.notes || "N/A"} />
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
