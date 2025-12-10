import React from "react";
import { motion } from "framer-motion";
import DashboardHeader from "../../Components/Dashboard/DashboardHeader";
import UserStats from "../../Components/Dashboard/UserStats";

const DashboardHome = () => {
  return (
    <div>
      {/* Dashboard Header */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <DashboardHeader title="My Dashboard" />
      </motion.div>
      <UserStats />
    </div>
  );
};

export default DashboardHome;
