import { motion } from "framer-motion";
import { Link } from "react-router";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function CTABanner() {
  return (
    <section className="py-16 px-6 bg-gradient text-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="font-rajdhani text-3xl md:text-4xl font-bold mb-4">
            Ready to Start?
          </h2>
          <p className="text-lg mb-6">
            Join thousands who already trust LoanLink for fast, fair
            micro-loans.
          </p>
          <Link
            to="/apply-loan"
            className="btn bg-base-100 text-blue-500 btn-wide px-8 py-3 rounded shadow hover:shadow-xl transition"
          >
            Apply for Loan Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
