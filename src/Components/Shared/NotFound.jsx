/* NotFound.jsx */
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router";
import { FiHome, FiArrowLeft } from "react-icons/fi";
import PageHeader from "./PageHeader";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function NotFound() {
  const location = useLocation();

  return (
    <>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <PageHeader title="404 - Page Not Found" />
      </motion.div>

      <section className="py-16 px-6 bg-base-100 min-h-[50vh] flex items-center justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* 404 Illustration */}
          <motion.div variants={fadeIn}>
            <img
              src="https://cdn.pixabay.com/photo/2021/07/21/12/49/error-6481194_1280.png"
              alt="404"
              className="w-64 mx-auto mb-8 drop-shadow"
            />
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeIn}
            className="font-rajdhani text-5xl md:text-6xl font-bold mb-4"
          >
            Oops! Lost in Space?
          </motion.h1>

          {/* Message */}
          <motion.p variants={fadeIn} className="text-lg text-gray-500 mb-2">
            We couldn’t find the page{" "}
            <code className="bg-base-200 px-2 py-1 rounded text-primary">
              {location.pathname}
            </code>
            .
          </motion.p>
          <motion.p variants={fadeIn} className="text-gray-400 mb-8">
            It might have been moved, deleted, or you entered the wrong URL.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/"
              className="btn bg-gradient px-6 gap-2 shadow hover:shadow-lg"
            >
              <FiHome />
              Go Home
            </Link>
            <button
              className="btn btn-outline btn-primary gap-2"
              onClick={() => window.history.back()}
            >
              <FiArrowLeft />
              Go Back
            </button>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
