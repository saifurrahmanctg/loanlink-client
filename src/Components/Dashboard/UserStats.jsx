// UserStats.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useAuth } from "../../Provider/AuthProvider";
import {
  FaMoneyCheck,
  FaClock,
  FaWallet,
  FaChartLine,
  FaUsers,
  FaCheckCircle,
  FaHandHoldingUsd,
} from "react-icons/fa";

/*  color / icon / prefix  */
const statMeta = {
  // Admin
  "Total Users": {
    color: "bg-indigo-500",
    icon: <FaUsers />,
    prefix: "",
  },
  "Total Loans": {
    color: "bg-cyan-500",
    icon: <FaUsers />,
    prefix: "",
  },
  // Manager
  "Total Loans Taken": {
    color: "bg-blue-500",
    icon: <FaMoneyCheck />,
    prefix: "",
  },
  "Total Money Received": {
    color: "bg-green-500",
    icon: <FaWallet />,
    prefix: "৳",
  },
  "Pending Loans": {
    color: "bg-yellow-500",
    icon: <FaClock />,
    prefix: "",
  },
  "Total Paid": {
    color: "bg-emerald-500",
    icon: <FaCheckCircle />,
    prefix: "৳",
  },
  "Average Loan": {
    color: "bg-purple-500",
    icon: <FaChartLine />,
    prefix: "৳",
  },
  "Active EMI": {
    color: "bg-pink-500",
    icon: <FaHandHoldingUsd />,
    prefix: "",
  },

  "Total Loans Issued": {
    color: "bg-cyan-500",
    icon: <FaMoneyCheck />,
    prefix: "",
  },
  "Pending Approvals": {
    color: "bg-orange-500",
    icon: <FaClock />,
    prefix: "",
  },
  "Total Money Collected": {
    color: "bg-teal-500",
    icon: <FaWallet />,
    prefix: "৳",
  },
  "Loans Paid": {
    color: "bg-red-500",
    icon: <FaCheckCircle />,
    prefix: "৳",
  },
  "Average Loan Amount": {
    color: "bg-slate-500",
    icon: <FaChartLine />,
    prefix: "৳",
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function UserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/dashboard/stats/${user.email}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setStats(d.stats);
          setRole(d.role);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [user]);

  /* ----------- role-based CTA ----------- */
  const cta = {
    borrower: { text: "View My Applications", url: "/dashboard/my-loans" },
    manager: { text: "Manage Active Loans", url: "/dashboard/manage-loans" },
    admin: { text: "Manage Users", url: "/dashboard/manage-users" },
  };

  return (
    <section className="py-10 px-6 bg-base-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h2 className="font-rajdhani text-3xl font-bold mb-2">
            Dashboard <span className="text-gradient">Overview</span>
          </h2>
          <p className="text-gray-600">Your micro-loan snapshot at a glance.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center gap-3">
            <span className="loading loading-spinner loading-xl text-info"></span>
            <h3 className="text-gradient text-xl font-bold">
              Dashboard Data is Loading . . .
            </h3>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((s, i) => {
                const meta = statMeta[s.label] || {};
                return (
                  <motion.div
                    key={s.label}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    className={`card ${meta.color} text-white shadow-lg rounded-2xl p-4 flex flex-col justify-between`}
                  >
                    <div className="flex flex-col justify-center items-center mb-2 text-center">
                      <div className="w-16 h-16 grid place-items-center">
                        {meta.icon || <FaMoneyCheck />}
                      </div>
                      <h3 className="font-rajdhani font-bold text-2xl mt-2">
                        {s.label}
                      </h3>
                    </div>
                    <div className="text-2xl font-bold text-center">
                      <CountUp
                        end={s.value}
                        duration={1.5}
                        prefix={meta.prefix || ""}
                        separator=","
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="mt-10 text-center"
              >
                <a
                  href={cta[role]?.url || "#"}
                  className="btn bg-gradient btn-wide px-8 py-3 rounded shadow hover:shadow-xl transition"
                >
                  {cta[role]?.text || "Go to Dashboard"}
                </a>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
