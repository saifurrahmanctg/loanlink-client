import React from "react";
import DashboardHeader from "../../Components/Dashboard/DashboardHeader";
import UserStats from "../../Components/Dashboard/UserStats";

const DashboardHome = () => {
  return (
    <div>
      <DashboardHeader title="My Dashboard" />
      <UserStats />
    </div>
  );
};

export default DashboardHome;
