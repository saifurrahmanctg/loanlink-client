import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
const API = import.meta.env.VITE_API_URL;

export default function AvailableLoans() {
  // Fetch all loans
  const { data: loans = [], isLoading } = useQuery({
    queryKey: ["home-loans"],
    queryFn: async () => {
      const res = await fetch(`${API}/loans`);
      return res.json();
    },
  });

  // Only loans with showHome = true
  const homeLoans = loans.filter((loan) => loan.showHome === true);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-3">
        <span className="loading loading-spinner loading-xl text-info"></span>
        <h3 className="text-gradient text-xl font-bold">
          All Available Loans are Loading . . .
        </h3>
      </div>
    );
  }

  return (
    <section className="py-16 bg-base-300">
      <div className="max-w-6xl mx-auto px-4">
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

        {/* No loans found */}
        {homeLoans.length === 0 && (
          <p className="text-center text-lg text-gray-500">
            No loans available at the moment.
          </p>
        )}

        {/* Loan Cards */}
        <AnimatePresence mode="popLayout">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeLoans.map((loan) => (
              <motion.div
                key={loan._id}
                layout
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition rounded-2xl overflow-hidden"
              >
                <figure className="h-48 w-full">
                  <img
                    src={loan.image}
                    alt={loan.title}
                    className="w-full h-full object-cover"
                  />
                </figure>

                <div className="card-body p-4">
                  <h3 className="card-title text-lg">{loan.title}</h3>
                  <p className="text-sm text-gray-500 mb-1">{loan.category}</p>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-primary font-semibold">
                      {loan.interest}% interest
                    </span>

                    <span className="text-gray-600">
                      Up to ৳{loan.maxLoanLimit?.toLocaleString()}
                    </span>
                  </div>

                  <div className="card-actions mt-4">
                    <Link
                      to={`/loan-details/${loan._id}`}
                      className="btn bg-gradient btn-sm btn-block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* View All Loans Button */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-12 flex justify-center"
        >
          <Link
            to="/all-loans"
            className="btn bg-gradient btn-wide px-8 py-3 rounded shadow hover:shadow-xl transition"
          >
            View All Loans
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
