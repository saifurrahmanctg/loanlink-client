import { motion } from "framer-motion";
import { useLoaderData, useParams } from "react-router";
import PageHeader from "../Components/Shared/PageHeader";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../Provider/AuthProvider";
import Swal from "sweetalert2";
import { LiaMinusSolid } from "react-icons/lia";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const API = import.meta.env.VITE_API_URL;

export default function ApplyLoan() {
  const { loan } = useLoaderData();
  const { id } = useParams();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // 🔥 Submit Loan Application Mutation
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

      // Auto fields — backend will also set default values
      userEmail: user.email,
      loanId: id,
      loanTitle: loan["Loan Title"],
      interestRate: loan.Interest,
      submittedAt: new Date(),
    };

    mutation.mutate(payload);
  };

  return (
    <>
      {/* Page Header */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <PageHeader title="Apply for Loan" subtitle={loan["Loan Title"]} />
      </motion.div>

      <section className="py-10 px-6 bg-base-200">
        <motion.div
          className="max-w-5xl mx-auto bg-base-100 shadow-lg rounded p-6 md:p-10"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h2 className="text-3xl font-rajdhani font-bold mb-8 text-center text-gradient">
            Loan Application Form
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Loan Details */}
            <div>
              <p className="flex items-center gap-1 mb-1 text-gray-600">
                Calculate Your Loan Amount{" "}
                <LiaMinusSolid size={36} fill="#3B82F6" />
              </p>
              <h2 className="text-4xl font-rajdhani font-bold mb-8 text-gradient border-l-4 border-blue-600 p-0 pl-1">
                Loan Details
              </h2>
              <div className="md:grid grid-cols-1 md:grid-cols-6 gap-5">
                <div className="col-span-3">
                  <label className="font-semibold ">Loan Title</label>
                  <input
                    readOnly
                    value={loan["Loan Title"]}
                    className="input border-0 w-full bg-base-300 mt-2"
                  />
                </div>
                <div className="col-span-3">
                  <label className="font-semibold">Interest Rate</label>
                  <input
                    readOnly
                    value={`${loan.Interest}%`}
                    className="input border-0 w-full bg-base-300 mt-2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="font-semibold">Loan Amount</label>
                  <input
                    type="number"
                    {...register("loanAmount", { required: true })}
                    className="input border-0 w-full bg-base-300 mt-2"
                  />
                  {errors.loanAmount && (
                    <p className="text-red-500 text-sm">Required</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="font-semibold">Monthly Income</label>
                  <input
                    type="number"
                    {...register("monthlyIncome", { required: true })}
                    className="input border-0 w-full bg-base-300 mt-2"
                  />
                  {errors.monthlyIncome && (
                    <p className="text-red-500 text-sm">Required</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="font-semibold">Income Source</label>
                  <input
                    {...register("incomeSource", { required: true })}
                    className="input border-0 w-full bg-base-300 mt-2"
                  />
                  {errors.incomeSource && (
                    <p className="text-red-500 text-sm">Required</p>
                  )}
                </div>

                <div className="col-span-6">
                  <label className="font-semibold">Reason for Loan</label>
                  <textarea
                    {...register("reason", { required: true })}
                    className="textarea border-0 w-full bg-base-300 mt-2"
                    rows={3}
                  ></textarea>
                  {errors.reason && (
                    <p className="text-red-500 text-sm">Required</p>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="mt-8">
              <p className="flex items-center gap-1 mb-1 text-gray-600">
                Ask for More Details <LiaMinusSolid size={36} fill="#3B82F6" />
              </p>
              <h2 className="text-4xl font-rajdhani font-bold mb-8 text-gradient border-l-4 border-blue-600 p-0 pl-1">
                Personal Details
              </h2>
              <div className="md:grid grid-cols-1 md:grid-cols-6 gap-5">
                <div className="col-span-3">
                  <label className="font-semibold">First Name</label>
                  <input
                    {...register("firstName", { required: true })}
                    className="input border-0 w-full bg-base-300 mt-2"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">Required</p>
                  )}
                </div>
                <div className="col-span-3">
                  <label className="font-semibold">Last Name</label>
                  <input
                    {...register("lastName", { required: true })}
                    className="input border-0 w-full bg-base-300 mt-2"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">Required</p>
                  )}
                </div>
                <div className="col-span-6">
                  <label className="font-semibold">User Email</label>
                  <input
                    readOnly
                    value={user.email}
                    className="input border-0 w-full bg-base-300 mt-2"
                  />
                </div>
                <div className="col-span-3">
                  <label className="font-semibold">Contact Number</label>
                  <input
                    {...register("contactNumber", { required: true })}
                    className="input border-0 w-full bg-base-300 mt-2"
                  />
                  {errors.contactNumber && (
                    <p className="text-red-500 text-sm">Required</p>
                  )}
                </div>
                <div className="col-span-3">
                  <label className="font-semibold">
                    National ID / Passport Number
                  </label>
                  <input
                    {...register("nationalId", { required: true })}
                    className="input border-0 w-full bg-base-300 mt-2"
                  />
                  {errors.nationalId && (
                    <p className="text-red-500 text-sm">Required</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="mt-8">
              <p className="flex items-center gap-1 mb-1 text-gray-600">
                Street, City And State{" "}
                <LiaMinusSolid size={36} fill="#3B82F6" />
              </p>
              <h2 className="text-4xl font-rajdhani font-bold mb-8 text-gradient border-l-4 border-blue-600 p-0 pl-1">
                Address Details
              </h2>
              <div className="col-span-2">
                <label className="font-semibold">Address</label>
                <textarea
                  {...register("address", { required: true })}
                  className="textarea border-0 w-full bg-base-300 mt-2"
                  rows={3}
                ></textarea>
                {errors.address && (
                  <p className="text-red-500 text-sm">Required</p>
                )}
              </div>
            </div>

            {/* Address Details */}
            <div className="mt-8">
              <p className="flex items-center gap-1 mb-1 text-gray-600">
                Write About Your Plans{" "}
                <LiaMinusSolid size={36} fill="#3B82F6" />
              </p>
              <h2 className="text-4xl font-rajdhani font-bold mb-8 text-gradient border-l-4 border-blue-600 p-0 pl-1">
                Other Details
              </h2>
              <div className="col-span-2">
                <label className="font-semibold">Extra Notes (Optional)</label>
                <textarea
                  {...register("notes")}
                  className="textarea border-0 w-full bg-base-300 mt-2"
                  rows={3}
                ></textarea>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-6">
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
