import { motion } from "framer-motion";
import { FiTarget, FiZap, FiShield, FiUsers } from "react-icons/fi";
import { Link } from "react-router";
import PageHeader from "../../Components/Shared/PageHeader";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stats = [
  { value: "₹25 Cr+", label: "Disbursed" },
  { value: "50 K+", label: "Active Borrowers" },
  { value: "98 %", label: "Repayment Rate" },
  { value: "3 Min", label: "Avg. Approval" },
];

const team = [
  {
    name: "Ananya Rao",
    role: "Co-Founder & CEO",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Vikram Malhotra",
    role: "Co-Founder & CTO",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Priya Nair",
    role: "Head of Risk",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
  },
];

export default function About() {
  return (
    <div className="bg-base-100">
      {/* HERO */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="  text-center"
      >
        <PageHeader title="About Us" />
      </motion.section>

      {/* STATS */}
      <section className="px-6 py-16 bg-base-200">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl font-bold font-rajdhani text-primary">
                {s.value}
              </div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MISSION / VISION / VALUES */}
      <section className="px-6 py-24 max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col items-center text-center"
        >
          <FiTarget className="w-10 h-10 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
          <p className="text-gray-600">
            Democratise access to credit by using data-driven insights to serve
            the underserved—fast, transparent and inclusive.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col items-center text-center"
        >
          <FiZap className="w-10 h-10 text-accent mb-4" />
          <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
          <p className="text-gray-600">
            Build India’s most trusted micro-finance platform where every small
            dream gets the capital it deserves.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col items-center text-center"
        >
          <FiShield className="w-10 h-10 text-info mb-4" />
          <h3 className="text-xl font-semibold mb-2">Core Values</h3>
          <p className="text-gray-600">
            Transparency, Speed, Inclusion & Responsible Lending—every decision
            starts with the customer.
          </p>
        </motion.div>
      </section>

      {/* TEAM */}
      <section className="px-6 py-24 bg-base-200">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center mb-12"
        >
          <h2 className="font-rajdhani text-4xl font-bold mb-2">
            Meet the Builders
          </h2>
          <p className="text-gray-600">The humans behind the micro-loans</p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8">
          {team.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-base-100 p-6 rounded-2xl shadow text-center"
            >
              <img
                src={m.img}
                alt={m.name}
                className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
              />
              <h4 className="text-lg font-semibold">{m.name}</h4>
              <p className="text-sm text-gray-500">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient text-white p-10 rounded-2xl shadow"
        >
          <h3 className="text-2xl font-bold mb-2">Ready to get started?</h3>
          <p className="mb-6">Join thousands who already trust LoanLink.</p>
          <Link to="/register" className="btn btn-active btn-wide">
            Create Account
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
