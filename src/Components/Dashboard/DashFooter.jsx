import React from "react";

const DashFooter = () => {
  return (
    <div className="bg-base-300 w-full px-6 py-4 text-center text-sm text-gray-600">
      © {new Date().getFullYear()}{" "}
      <span className="text-gradient text-lg font-bold font-rajdhani">
        LoanLink
      </span>
      . All rights reserved.
    </div>
  );
};

export default DashFooter;
