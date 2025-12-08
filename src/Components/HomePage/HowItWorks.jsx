import { motion } from "framer-motion";
import { FiUserCheck, FiUploadCloud, FiDollarSign } from "react-icons/fi";
import { Link } from "react-router";

const steps = [
  {
    icon: <FiUserCheck className="w-8 h-8" />,
    title: "1. Create Your Profile",
    desc: "Sign up in seconds and verify your identity with a quick selfie & document upload.",
  },
  {
    icon: <FiUploadCloud className="w-8 h-8" />,
    title: "2. Apply for a Loan",
    desc: "Choose amount & tenure, then submit your application—no paperwork, no hassle.",
  },
  {
    icon: <FiDollarSign className="w-8 h-8" />,
    title: "3. Get Money Instantly",
    desc: "Approval takes minutes. Money is transferred to your mobile-money / bank account immediately.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 bg-base-100">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="font-rajdhani text-4xl font-bold mb-2">
            How <span className="text-gradient">LoanLink</span> Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Three simple steps to get your micro-loan in minutes—fully digital,
            fully fair.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="card bg-base-300 shadow-lg p-6 rounded-2xl text-center"
            >
              <div className="text-primary mb-4 flex justify-center">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-12"
        >
          <Link
            to="/apply-loan"
            className="btn bg-gradient btn-wide px-8 py-3 rounded shadow hover:shadow-xl transition"
          >
            Apply Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
