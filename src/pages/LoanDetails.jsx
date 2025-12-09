import React from "react";
import { motion } from "framer-motion";
import PageHeader from "../Components/Shared/PageHeader";

const LoanDetails = () => {
  return (
    <div>
      {/* -------------  PageHeader animates from top ------------- */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <PageHeader title="Loan Details" />
      </motion.div>
    </div>
  );
};

export default LoanDetails;
