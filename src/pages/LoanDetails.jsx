import { motion } from "framer-motion";
import { Link, useLoaderData, useParams } from "react-router";
import { FaCheckCircle } from "react-icons/fa";
import PageHeader from "../Components/Shared/PageHeader";
import { useEffect, useState } from "react";
import Loader from "../Components/Shared/Loader";
import { useAuth } from "../Provider/AuthProvider";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function LoanDetails() {
  const { user } = useAuth();
  console.log(user);

  const { loan, allLoans } = useLoaderData();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // simulate load
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      {/* Page Header */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <PageHeader title="Loan Details" subtitle={loan["Loan Title"]} />
      </motion.div>

      {/* Main Content */}
      <section className="py-16 px-6 bg-base-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5  gap-10">
          {/* ---------------------- Sidebar ---------------------- */}
          <motion.aside
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="md:col-span-2  bg-base-200 shadow rounded-xl p-5 h-fit"
          >
            <h3 className="font-rajdhani font-bold text-xl mb-4">
              All Loan Services
            </h3>

            <ul className="space-y-2">
              {allLoans.map((item) => (
                <li key={item._id}>
                  <Link
                    to={`/loan-details/${item._id}`}
                    className={`block px-4 py-2 rounded-lg border 
                      transition-all 
                      ${
                        item._id === id
                          ? "bg-gradient text-white border-primary"
                          : "border-blue-500 hover:bg-base-100"
                      }
                    `}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.aside>

          {/* ---------------------- Details Content ---------------------- */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="md:col-span-3 space-y-8"
          >
            {/* Image */}
            <img
              src={loan.image}
              alt={loan.title}
              className="w-full h-80 object-cover rounded-2xl shadow"
            />

            {/* Title + Category */}
            <div>
              <h1 className="font-rajdhani text-4xl font-bold">{loan.title}</h1>
              <span className="badge badge-primary badge-outline mt-2">
                {loan.category}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-justify leading-relaxed">
              {loan.description}
            </p>

            {/* Loan Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border border-blue-300 bg-base-300">
                <h4 className="font-bold mb-2">Interest Rate</h4>
                <p className="text-primary font-semibold text-lg">
                  {loan.interest}%
                </p>
              </div>

              <div className="p-5 rounded-xl border border-blue-300  bg-base-300">
                <h4 className="font-bold mb-2">Max Loan Limit</h4>
                <p className="font-semibold text-lg">
                  ৳{loan.maxLoanLimit.toLocaleString()}
                </p>
              </div>

              <div className="p-5 rounded-xl border border-blue-300  bg-base-300 md:col-span-2">
                <h4 className="font-bold mb-2">Available EMI Plans</h4>
                <p className="font-semibold">
                  {(loan.availableEMIPlans || []).join(", ")} months
                </p>
              </div>
            </div>

            {/* Apply Button */}
            <motion.div whileTap={{ scale: 0.95 }}>
              {user.role === "borrower" ? (
                <Link
                  to={`/apply-loan/${loan._id}`}
                  className="btn bg-gradient w-full md:w-60"
                >
                  <FaCheckCircle className="mr-2" />
                  Apply Now
                </Link>
              ) : (
                ""
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
