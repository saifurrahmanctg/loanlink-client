import React from "react";
import UserStats from "../../Components/Dashboard/UserStats";
import DashboardChart from "../../Components/Dashboard/DashboardChart";

const DashboardHome = () => {
  return (
    <div>
      <UserStats />
      <DashboardChart />
    </div>
  );
};

export default DashboardHome;
