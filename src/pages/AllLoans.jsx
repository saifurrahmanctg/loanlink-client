import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLoaderData } from "react-router";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import PageHeader from "../Components/Shared/PageHeader";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AllLoans() {
  /* ---------- states ---------- */
  const [search, setSearch] = useState("");
  const [interestMax, setInterestMax] = useState(15);
  const [amountMax, setAmountMax] = useState(100000);
  const [selectedCategory, setSelectedCategory] = useState("");

  /* ---------- loader data ---------- */
  const loanData = useLoaderData() || [];

  /* ---------- derived categories ---------- */
  const categories = useMemo(
    () => ["", ...new Set(loanData.map((l) => l["Loan Category"]))],
    [loanData]
  );

  /* ---------- filtering logic ---------- */
  const filtered = useMemo(() => {
    return loanData.filter((l) => {
      const title = l["Loan Title"]?.toLowerCase() || "";
      const category = l["Loan Category"]?.toLowerCase() || "";

      const matchesSearch =
        title.includes(search.toLowerCase()) ||
        category.includes(search.toLowerCase());

      const matchesInterest = l.Interest <= interestMax;
      const matchesAmount = l["Max Loan Limit"] <= amountMax;

      const matchesCategory =
        !selectedCategory || l["Loan Category"] === selectedCategory;

      return (
        matchesSearch && matchesInterest && matchesAmount && matchesCategory
      );
    });
  }, [search, interestMax, amountMax, selectedCategory, loanData]);

  /* ---------- handlers ---------- */
  const clearAll = () => {
    setSearch("");
    setInterestMax(15);
    setAmountMax(100000);
    setSelectedCategory("");
  };

  return (
    <>
      {/* Page Header */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <PageHeader title="All Loans" />
      </motion.div>

      <section className="py-16 px-6 bg-base-100">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <h2 className="font-rajdhani text-4xl font-bold mb-2">
              All <span className="text-gradient">Loans</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the perfect loan for your needs.
            </p>
          </motion.div>

          {/* FILTER BAR */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8 grid md:grid-cols-2 gap-6 items-end"
          >
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or category..."
                className="input input-bordered w-full pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category + Clear */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <select
                  className="select select-bordered w-full"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c || "All categories"}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={clearAll}
                className="btn btn-ghost btn-square bg-gradient"
                title="Clear all filters"
              >
                <FaTimes />
              </button>
            </div>

            {/* Interest Slider */}
            <div className="flex gap-3 justify-center items-center bg-base-300 rounded px-2 py-1">
              <label className="label">
                <span className="text-gradient">Interest:</span>
                <span className="label-text">5%</span>
              </label>
              <input
                type="range"
                min="5"
                max="15"
                step="0.5"
                value={interestMax}
                onChange={(e) => setInterestMax(Number(e.target.value))}
                className="range range-accent range-sm w-full"
              />
              <label className="label">
                <span className="label-text">{interestMax}%</span>
              </label>
            </div>

            {/* Amount Slider */}
            <div className="flex gap-3 justify-center items-center bg-base-300 rounded px-2 py-1">
              <label className="label">
                <span className="text-gradient">Amount:</span>
                <span className="label-text">৳ 5,000</span>
              </label>
              <input
                type="range"
                min="5000"
                max="100000"
                step="5000"
                value={amountMax}
                onChange={(e) => setAmountMax(Number(e.target.value))}
                className="range range-accent range-sm w-full"
              />
              <label className="label">
                <span className="label-text">
                  ৳ {amountMax.toLocaleString()}
                </span>
              </label>
            </div>
          </motion.div>

          {/* Results count */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex items-center justify-between mb-6"
          >
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-primary">
                {filtered.length}
              </span>{" "}
              loan(s)
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaFilter className="text-primary" />
              <span>
                Active filters:{" "}
                {[
                  search && "Search",
                  interestMax < 15 && "Interest",
                  amountMax < 100000 && "Amount",
                  selectedCategory && "Category",
                ]
                  .filter(Boolean)
                  .join(", ") || "None"}
              </span>
            </div>
          </motion.div>

          {/* Loan Cards */}
          <AnimatePresence mode="popLayout">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((loan, i) => (
                <motion.div
                  key={loan._id}
                  layout
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="card bg-base-300 shadow hover:shadow-xl transition rounded-2xl overflow-hidden"
                >
                  <figure className="h-48 w-full">
                    <img
                      src={loan["Loan Image"]}
                      alt={loan["Loan Title"]}
                      className="w-full h-full object-cover"
                    />
                  </figure>

                  <div className="card-body p-4">
                    <h3 className="card-title text-lg">{loan["Loan Title"]}</h3>
                    <p className="text-sm text-gray-500 mb-1">
                      {loan["Loan Category"]}
                    </p>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-primary font-semibold">
                        {loan.Interest}% interest
                      </span>

                      <span className="text-gray-600">
                        Up to ৳{loan["Max Loan Limit"]?.toLocaleString()}
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

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10"
            >
              <p className="text-gray-500">No loans match your filters.</p>
              <button onClick={clearAll} className="btn btn-link btn-sm mt-2">
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
