import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  FaMoneyCheck,
  FaClock,
  FaWallet,
  FaChartLine,
  FaUsers,
} from "react-icons/fa6";
import { useAuth } from "../../Provider/AuthProvider";
import { FaCheckCircle, FaHandHoldingUsd } from "react-icons/fa";

const iconMap = {
  "Total Loans Taken": <FaMoneyCheck className="w-16 h-16" />,
  "Total Money Received": <FaWallet className="w-16 h-16" />,
  "Pending Loans": <FaClock className="w-16 h-16" />,
  "Total Paid": <FaCheckCircle className="w-16 h-16" />,
  "Average Loan": <FaChartLine className="w-16 h-16" />,
  "Active EMI": <FaHandHoldingUsd className="w-16 h-16" />,
  "Total Users": <FaUsers className="w-16 h-16" />,
  "Total Loans": <FaMoneyCheck className="w-16 h-16" />,
  "Pending Approvals": <FaClock className="w-16 h-16" />,
  "Total Money Collected": <FaWallet className="w-16 h-16" />,
  "Loans Paid": <FaCheckCircle className="w-16 h-16" />,
  "Average Loan Amount": <FaChartLine className="w-16 h-16" />,
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function UserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    if (!user?.email) return;

    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/dashboard/stats/${user.email}`
        );
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRole(data.role);
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <section className="py-10 px-6 bg-base-100">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          variants={{ cardVariants }}
          className="mb-8 text-center"
        >
          <h2 className="font-rajdhani text-3xl font-bold mb-2">
            Dashboard <span className="text-gradient">Overview</span>
          </h2>
          <p className="text-gray-600">Your micro-loan snapshot at a glance.</p>
          <p className="text-gray-500 text-sm">Role: {role}</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className={`card ${s.color} text-white shadow-lg rounded-2xl p-4 flex flex-col justify-between`}
            >
              <div className="flex flex-col justify-center items-center mb-2 text-center">
                {iconMap[s.label] || <FaMoneyCheck className="w-16 h-16" />}
                <h3 className="font-rajdhani font-bold text-2xl mt-2">
                  {s.label}
                </h3>
              </div>
              <div className="text-2xl font-bold text-center">
                <CountUp
                  end={s.value}
                  duration={1.5}
                  prefix={s.prefix || ""}
                  separator=","
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-10 text-center"
        >
          {role === "borrower" && (
            <a
              href="/dashboard/my-loans"
              className="btn bg-gradient btn-wide px-8 py-3 rounded shadow hover:shadow-xl transition"
            >
              View My Applications
            </a>
          )}
          {role === "manager" && (
            <a
              href="/dashboard/manage-loans"
              className="btn bg-gradient btn-wide px-8 py-3 rounded shadow hover:shadow-xl transition"
            >
              Manage Active Loans
            </a>
          )}
          {role === "admin" && (
            <a
              href="/dashboard/users"
              className="btn bg-gradient btn-wide px-8 py-3 rounded shadow hover:shadow-xl transition"
            >
              Manage Users
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
