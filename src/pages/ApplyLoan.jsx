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

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const API = import.meta.env.VITE_API_URL;

export default function ApplyLoan() {
  const [showConfetti, setShowConfetti] = useState(false);
  const { loan } = useLoaderData(); // ⬅ loader returns { loan }
  const { id } = useParams();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  /* -------- Confetti -------- */
  const runSideConfetti = () => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ["#3b82f6", "#60a5fa", "#93c5fd"],
    });

    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ["#3b82f6", "#60a5fa", "#93c5fd"],
    });
  };

  useEffect(() => {
    if (showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(t);
    }
  }, [showConfetti]);

  /* -------- Auto-fill loan fields from MongoDB -------- */
  useEffect(() => {
    if (loan) {
      reset({
        loanTitle: loan.title,
        interestRate: loan.interest,
        userEmail: user.email,
      });
    }
  }, [loan, user, reset]);

  /* -------- Submit loan application -------- */
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
        icon: "success",
        title: "Application Submitted!",
        text: "Your loan application has been successfully submitted.",
        confirmButtonColor: "#3b82f6",
      });

      reset({
        loanTitle: loan.title,
        interestRate: loan.interest,
        userEmail: user.email,
      });
    },

    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      loanId: id,
      loanTitle: loan.title,
      interestRate: loan.interest,
      userEmail: user.email,
      submittedAt: new Date(),
    };

    mutation.mutate(payload);
  };

  /* -------- Field Components -------- */
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
        rows={rows}
        className="textarea border-0 w-full bg-base-300 mt-2"
      />
      {errors[name] && <p className="text-red-500 text-sm">Required</p>}
    </div>
  );

  return (
    <>
      {showConfetti && <div />}

      {/* Page Header */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
      >
        <PageHeader title="Apply for Loan" subtitle={loan?.title} />
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
            {/* -------- Loan Details -------- */}
            <div className="mb-10">
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

            {/* -------- Personal Details -------- */}
            <div className="mb-10">
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

            {/* -------- Address -------- */}
            <div className="mb-10">
              <h2 className="text-4xl font-rajdhani font-bold mb-6 text-gradient border-l-4 border-blue-600 pl-2">
                Address Details
              </h2>

              {renderTextarea("Address", "address")}
            </div>

            {/* -------- Extra Notes -------- */}
            <div className="mb-10">
              <h2 className="text-4xl font-rajdhani font-bold mb-6 text-gradient border-l-4 border-blue-600 pl-2">
                Other Details
              </h2>

              {renderTextarea("Extra Notes (Optional)", "notes", 3, false)}
            </div>

            {/* -------- Submit Button -------- */}
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
