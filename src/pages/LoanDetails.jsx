import { motion } from "framer-motion";
import { Link } from "react-router";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { loanData } from "../data/loanData";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

export default function LoanDetails() {
  const singleLoan = loanData.find((loan) => loan.id);

  return (
    <section className="py-20 px-6 bg-base-100">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-6"
        >
          <Link
            to="/all-loans"
            className="btn btn-ghost bg-gradient btn-sm gap-2"
          >
            <FaArrowLeft /> Back to loans
          </Link>
        </motion.div>

        {/* Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Left - Image */}
          <motion.div variants={fadeIn}>
            <img
              src={singleLoan["Loan Image"]}
              alt={singleLoan["Loan Title"]}
              className="w-full h-80 object-cover rounded-2xl shadow"
            />
          </motion.div>

          {/* Right - Details */}
          <motion.div variants={fadeIn} className="space-y-6">
            <div>
              <h1 className="font-rajdhani text-4xl font-bold mt-2">
                {singleLoan["Loan Title"]}
              </h1>
              <span className="badge badge-primary badge-outline">
                {singleLoan["Loan Category"]}
              </span>
            </div>

            <p className="text-gray-600">{singleLoan.description}</p>

            {/* Key facts */}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-base-300">
                <span className="text-gray-500">Interest Rate</span>
                <span className="font-semibold text-primary">
                  {singleLoan.Interest}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-base-300">
                <span className="text-gray-500">Max Limit</span>
                <span className="font-semibold">
                  ₹{singleLoan["Max Loan Limit"].toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-base-300">
                <span className="text-gray-500">Available EMI Plans</span>
                <span className="font-semibold">
                  {singleLoan.availableEMIPlans.join(", ")} months
                </span>
              </div>
            </div>

            {/* Apply button */}
            <motion.div whileTap={{ scale: 0.96 }}>
              <Link to="/apply-loan" className="btn bg-gradient w-full">
                <FaCheckCircle className="mr-2" />
                Apply Now
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
