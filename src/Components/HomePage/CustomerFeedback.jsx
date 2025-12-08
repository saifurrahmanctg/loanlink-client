/* CustomerFeedback.jsx */
import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import { Link } from "react-router";

const reviews = [
  {
    name: "Anika Rahman",
    role: "Small-business owner",
    comment:
      "LoanLink approved my loan in 10 minutes! The process was completely paper-less and transparent.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Kamal Hossain",
    role: "Student",
    comment:
      "I needed emergency funds for tuition. LoanLink transferred the money instantly. Lifesaver!",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Rina Akter",
    role: "Freelancer",
    comment:
      "Repayments are flexible and every installment boosts my credit score. Highly recommended!",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function CustomerFeedback() {
  return (
    <section className="py-20 px-6 bg-base-300">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="font-rajdhani text-4xl font-bold mb-2">
            What Our <span className="text-gradient">Customers</span> Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Real stories from people who trusted LoanLink for fast, fair
            micro-loans.
          </p>
        </motion.div>

        {/* 3 Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="card bg-base-100 shadow p-6 rounded-2xl text-center"
            >
              <FaQuoteLeft className="text-primary mx-auto mb-4" size={24} />
              <p className="text-lg italic text-gray-700 mb-6">“{r.comment}”</p>
              <img
                src={r.avatar}
                alt={r.name}
                className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
              />
              <h4 className="font-semibold text-base">{r.name}</h4>
              <span className="text-sm text-gray-500">{r.role}</span>
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
            Join Them — Apply Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
