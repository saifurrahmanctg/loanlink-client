import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  FaMoneyCheck,
  FaClock,
  FaCheckCircle,
  FaWallet,
  FaChartLine,
  FaHandHoldingUsd,
} from "react-icons/fa";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const icons = {
  totalLoans: <FaMoneyCheck className="w-16 h-16" />,
  received: <FaWallet className="w-16 h-16" />,
  pending: <FaClock className="w-16 h-16" />,
  paid: <FaCheckCircle className="w-16 h-16" />,
  avgAmount: <FaChartLine className="w-16 h-16" />,
  active: <FaHandHoldingUsd className="w-16 h-16" />,
};

/* Dummy data – replace with real API calls */
const stats = [
  {
    label: "Total Loans Taken",
    value: 12,
    icon: icons.totalLoans,
    color: "bg-info",
  },
  {
    label: "Total Money Received",
    value: 128_500,
    icon: icons.received,
    color: "bg-success",
    prefix: "৳",
  },
  {
    label: "Pending Loans",
    value: 3,
    icon: icons.pending,
    color: "bg-warning",
  },
  {
    label: "Total Paid",
    value: 95_200,
    icon: icons.paid,
    color: "bg-primary",
    prefix: "৳",
  },
  {
    label: "Average Loan",
    value: 10_708,
    icon: icons.avgAmount,
    color: "bg-accent",
    prefix: "৳",
  },
  { label: "Active EMI", value: 5, icon: icons.active, color: "bg-secondary" },
];

export default function DashboardHome() {
  return (
    <section className="py-10 px-6 bg-base-100">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
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
                {s.icon}
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
          <a
            href="/dashboard/my-loans"
            className="btn bg-gradient btn-wide px-8 py-3 rounded shadow hover:shadow-xl transition"
          >
            Manage My Loans
          </a>
        </motion.div>
      </div>
    </section>
  );
}
