import React from "react";
import HeroBanner from "../Components/HomePage/HeroBanner";
import HowItWorks from "../Components/HomePage/HowItWorks";
import CustomerFeedback from "../Components/HomePage/CustomerFeedback";
import WhyChoose from "../Components/HomePage/WhyChoose";
import CTABanner from "../Components/HomePage/CTABanner";
import AvailableLoans from "../Components/HomePage/AvailableLoans";

const HomePage = () => {
  return (
    <div className="bg-base-100">
      <HeroBanner />
      <HowItWorks />
      <AvailableLoans />
      <WhyChoose />
      <CustomerFeedback />
      <CTABanner />
    </div>
  );
};

export default HomePage;
