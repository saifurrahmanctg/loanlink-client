import { motion } from "framer-motion";
import { FiShield, FiClock, FiTrendingUp } from "react-icons/fi";

const features = [
  {
    icon: <FiShield className="w-10 h-10" />,
    title: "100% Secure",
    desc: "Bank-grade encryption & zero paperwork.",
  },
  {
    icon: <FiClock className="w-10 h-10" />,
    title: "Money in Minutes",
    desc: "Approval takes 3 mins, transfer is instant.",
  },
  {
    icon: <FiTrendingUp className="w-10 h-10" />,
    title: "Build Credit",
    desc: "Every on-time repayment boosts your score.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function WhyChoose() {
  return (
    <section className="py-20 px-6 bg-base-200">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="font-rajdhani text-4xl font-bold mb-2">
            Why Choose <span className="text-gradient">LoanLink</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Transparent, fast, and built for your financial growth.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="card bg-base-100 shadow p-8 rounded-2xl text-center"
            >
              <div className="text-primary mx-auto mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
