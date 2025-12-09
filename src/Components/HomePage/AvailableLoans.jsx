import { motion } from "framer-motion";
import { Link } from "react-router";
import { loanData } from "../../data/loanData";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const hoverLift = { whileHover: { y: -6, transition: { duration: 0.2 } } };

export default function AvailableLoans() {
  // pick first 6 loans for home page
  const homeLoans = loanData.slice(0, 6);

  return (
    <section className="py-20 px-6 bg-base-300">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <h2 className="font-rajdhani text-4xl font-bold mb-2">
            Available <span className="text-gradient">Loans</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Quick, fair micro-loans designed for everyday needs.
          </p>
        </motion.div>

        {/* 6 Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {homeLoans.map((loan, i) => (
            <motion.div
              key={loan["Loan Title"]}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              {...hoverLift}
              className="card bg-base-100 shadow hover:shadow-xl transition rounded-2xl overflow-hidden"
            >
              <figure className="h-48 w-full">
                <img
                  src={loan["Loan Image"]}
                  alt={loan["Loan Title"]}
                  className="w-full h-full object-cover"
                />
              </figure>

              <div className="card-body p-5">
                <h3 className="card-title text-lg">{loan["Loan Title"]}</h3>
                <p className="text-sm text-gray-500 mb-1">
                  {loan["Loan Category"]}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-primary font-semibold">
                    {loan.Interest}% interest
                  </span>
                  <span className="text-gray-600">
                    Up to ₹{loan["Max Loan Limit"].toLocaleString()}
                  </span>
                </div>
                <div className="card-actions mt-4">
                  <Link
                    to={`loan-details/${loan.id}`}
                    className="btn bg-gradient btn-sm btn-block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA to full catalogue */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mt-12"
        >
          <Link
            to="/all-loans"
            className="btn bg-gradient btn-wide px-8 py-3 rounded shadow hover:shadow-xl transition"
          >
            See All Loans
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
