import React from "react";
import HeroBanner from "../Components/HomePage/HeroBanner";
import HowItWorks from "../Components/HomePage/HowItWorks";
import CustomerFeedback from "../Components/HomePage/CustomerFeedback";

const HomePage = () => {
  return (
    <div className="bg-base-100">
      <HeroBanner />
      <HowItWorks />
      <CustomerFeedback />
    </div>
  );
};

export default HomePage;
