import { motion } from "framer-motion";
import { useLoaderData, useParams } from "react-router";
import PageHeader from "../Components/Shared/PageHeader";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../Provider/AuthProvider";
import Swal from "sweetalert2";
import { LiaMinusSolid } from "react-icons/lia";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

/* ---------------- Fade In Animation ---------------- */
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ---------------- Window Size Hook ---------------- */
function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handle = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return size;
}

const API = import.meta.env.VITE_API_URL;

/* =======================================================
                APPLY LOAN PAGE
======================================================= */
export default function ApplyLoan() {
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const { loan } = useLoaderData();
  const { id } = useParams();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  /* ---------------- Side Spark Confetti ---------------- */
  const runSideConfetti = () => {
    // LEFT burst
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ["#3b82f6", "#60a5fa", "#93c5fd"],
    });

    // RIGHT burst
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ["#3b82f6", "#60a5fa", "#93c5fd"],
    });
  };

  /* ---------------- Auto-hide Confetti ---------------- */
  useEffect(() => {
    if (!showConfetti) return;
    const timer = setTimeout(() => setShowConfetti(false), 2200);
    return () => clearTimeout(timer);
  }, [showConfetti]);

  /* ---------------- Submit Loan Application ---------------- */
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${API}/loan-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Application failed");
      }

      return res.json();
    },
    onSuccess: () => {
      setShowConfetti(true);
      runSideConfetti();

      Swal.fire({
        title: "Application Submitted!",
        text: "Your loan application has been successfully submitted.",
        icon: "success",
        confirmButtonColor: "#3b82f6",
      });

      reset();
    },
    onError: (error) => {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      userEmail: user.email,
      loanId: id,
      loanTitle: loan["Loan Title"],
      interestRate: loan.Interest,
      submittedAt: new Date(),
    };

    mutation.mutate(payload);
  };

  /* ---------------- Form Field Renderer ---------------- */
  const renderInput = (label, name, type = "text", readOnly = false) => (
    <div className="col-span-3">
      <label className="font-semibold">{label}</label>
      <input
        type={type}
        readOnly={readOnly}
        {...register(name, { required: !readOnly })}
        className="input border-0 w-full bg-base-300 mt-2"
      />
      {errors[name] && <p className="text-red-500 text-sm">Required</p>}
    </div>
  );

  const renderTextarea = (label, name, rows = 3, required = true) => (
    <div className="col-span-6">
      <label className="font-semibold">{label}</label>
      <textarea
        {...register(name, { required })}
        className="textarea border-0 w-full bg-base-300 mt-2"
        rows={rows}
      />
      {errors[name] && <p className="text-red-500 text-sm">Required</p>}
    </div>
  );

  return (
    <>
      {/* Confetti */}
      {showConfetti && <div />}

      {/* Page Header */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <PageHeader title="Apply for Loan" subtitle={loan["Loan Title"]} />
      </motion.div>

      <section className="py-10 px-6 bg-base-200">
        <motion.div
          className="max-w-5xl mx-auto bg-base-100 shadow-lg rounded p-6 md:p-10"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-rajdhani font-bold mb-8 text-center text-gradient">
            Loan Application Form
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ---------------- Loan Details ---------------- */}
            <div className="mb-10">
              <p className="flex items-center gap-1 mb-1 text-gray-600">
                Calculate Your Loan Amount{" "}
                <LiaMinusSolid size={36} fill="#3B82F6" />
              </p>
              <h2 className="text-4xl font-rajdhani font-bold mb-6 text-gradient border-l-4 border-blue-600 pl-2">
                Loan Details
              </h2>

              <div className="md:grid grid-cols-6 gap-5">
                {renderInput("Loan Title", "loanTitle", "text", true)}
                {renderInput("Interest Rate", "interestRate", "text", true)}
                {renderInput("Loan Amount", "loanAmount", "number")}
                {renderInput("Monthly Income", "monthlyIncome", "number")}
                {renderInput("Income Source", "incomeSource")}
                {renderTextarea("Reason for Loan", "reason")}
              </div>
            </div>

            {/* ---------------- Personal Details ---------------- */}
            <div className="mb-10">
              <p className="flex items-center gap-1 mb-1 text-gray-600">
                Ask for More Details <LiaMinusSolid size={36} fill="#3B82F6" />
              </p>
              <h2 className="text-4xl font-rajdhani font-bold mb-6 text-gradient border-l-4 border-blue-600 pl-2">
                Personal Details
              </h2>

              <div className="md:grid grid-cols-6 gap-5">
                {renderInput("First Name", "firstName")}
                {renderInput("Last Name", "lastName")}
                {renderInput("User Email", "userEmail", "text", true)}
                {renderInput("Contact Number", "contactNumber")}
                {renderInput("National ID / Passport", "nationalId")}
              </div>
            </div>

            {/* ---------------- Address ---------------- */}
            <div className="mb-10">
              <p className="flex items-center gap-1 mb-1 text-gray-600">
                Street, City And State{" "}
                <LiaMinusSolid size={36} fill="#3B82F6" />
              </p>
              <h2 className="text-4xl font-rajdhani font-bold mb-6 text-gradient border-l-4 border-blue-600 pl-2">
                Address Details
              </h2>
              {renderTextarea("Address", "address")}
            </div>

            {/* ---------------- Notes ---------------- */}
            <div className="mb-10">
              <p className="flex items-center gap-1 mb-1 text-gray-600">
                Write About Your Plans{" "}
                <LiaMinusSolid size={36} fill="#3B82F6" />
              </p>
              <h2 className="text-4xl font-rajdhani font-bold mb-6 text-gradient border-l-4 border-blue-600 pl-2">
                Other Details
              </h2>
              {renderTextarea("Extra Notes (Optional)", "notes", 3, false)}
            </div>

            {/* ---------------- Submit Button ---------------- */}
            <div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={mutation.isPending}
                className="btn bg-gradient px-10 text-white"
                type="submit"
              >
                {mutation.isPending ? "Submitting..." : "Submit Application"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </section>
    </>
  );
}
