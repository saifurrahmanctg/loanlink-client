import React from "react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Profile = () => {
  return (
    <section className="py-10 px-6 bg-base-100">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="font-rajdhani text-3xl font-bold mb-2">
            My <span className="text-gradient">Profile</span>
          </h2>
          <p className="text-gray-600">
            Review and edit your personal information.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Profile;
