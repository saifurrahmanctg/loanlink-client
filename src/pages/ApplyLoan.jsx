import { motion } from "framer-motion";
import { useLoaderData, useParams } from "react-router";
import PageHeader from "../Components/Shared/PageHeader";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../Provider/AuthProvider";
import Swal from "sweetalert2";

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

  // 🔥 Submit Loan Application using TanStack Mutation
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${API}/loan-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
    onSuccess: () => {
      Swal.fire({
        title: "Application Submitted!",
        text: "Your loan application has been successfully sent.",
        icon: "success",
        confirmButtonColor: "#3b82f6",
      });
      reset();
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      userEmail: user.email,
      loanId: id,
      loanTitle: loan["Loan Title"],
      interest: loan.Interest,
      status: "Pending",
      applicationFeeStatus: "Unpaid",
      submittedAt: new Date(),
    };

    mutation.mutate(payload);
  };

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <PageHeader title="Apply for Loan" subtitle={loan["Loan Title"]} />
      </motion.div>

      <section className="py-20 px-6 bg-base-200">
        <motion.div
          className="max-w-4xl mx-auto bg-base-100 shadow-lg rounded-2xl p-10"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h2 className="text-3xl font-rajdhani font-bold mb-8 text-center text-gradient">
            Loan Application Form
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Read-only Auto Fields */}
            <div className="col-span-2">
              <label className="font-semibold">User Email</label>
              <input
                readOnly
                value={user.email}
                className="input input-bordered w-full bg-base-200"
              />
            </div>

            <div>
              <label className="font-semibold">Loan Title</label>
              <input
                readOnly
                value={loan["Loan Title"]}
                className="input input-bordered w-full bg-base-200"
              />
            </div>

            <div>
              <label className="font-semibold">Interest Rate</label>
              <input
                readOnly
                value={`${loan.Interest}%`}
                className="input input-bordered w-full bg-base-200"
              />
            </div>

            {/* User Input Fields */}
            <div>
              <label className="font-semibold">First Name</label>
              <input
                {...register("firstName", { required: true })}
                className="input input-bordered w-full"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">Required</p>
              )}
            </div>

            <div>
              <label className="font-semibold">Last Name</label>
              <input
                {...register("lastName", { required: true })}
                className="input input-bordered w-full"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">Required</p>
              )}
            </div>

            <div>
              <label className="font-semibold">Contact Number</label>
              <input
                {...register("contactNumber", { required: true })}
                className="input input-bordered w-full"
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-sm">Required</p>
              )}
            </div>

            <div>
              <label className="font-semibold">
                National ID / Passport Number
              </label>
              <input
                {...register("nationalId", { required: true })}
                className="input input-bordered w-full"
              />
              {errors.nationalId && (
                <p className="text-red-500 text-sm">Required</p>
              )}
            </div>

            <div>
              <label className="font-semibold">Income Source</label>
              <input
                {...register("incomeSource", { required: true })}
                className="input input-bordered w-full"
              />
              {errors.incomeSource && (
                <p className="text-red-500 text-sm">Required</p>
              )}
            </div>

            <div>
              <label className="font-semibold">Monthly Income</label>
              <input
                type="number"
                {...register("monthlyIncome", { required: true })}
                className="input input-bordered w-full"
              />
              {errors.monthlyIncome && (
                <p className="text-red-500 text-sm">Required</p>
              )}
            </div>

            <div>
              <label className="font-semibold">Loan Amount</label>
              <input
                type="number"
                {...register("loanAmount", { required: true })}
                className="input input-bordered w-full"
              />
              {errors.loanAmount && (
                <p className="text-red-500 text-sm">Required</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="font-semibold">Reason for Loan</label>
              <textarea
                {...register("reason", { required: true })}
                className="textarea textarea-bordered w-full"
                rows={3}
              ></textarea>
              {errors.reason && (
                <p className="text-red-500 text-sm">Required</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="font-semibold">Address</label>
              <textarea
                {...register("address", { required: true })}
                className="textarea textarea-bordered w-full"
                rows={3}
              ></textarea>
              {errors.address && (
                <p className="text-red-500 text-sm">Required</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="font-semibold">Extra Notes (Optional)</label>
              <textarea
                {...register("notes")}
                className="textarea textarea-bordered w-full"
                rows={3}
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="col-span-2 mt-4 flex justify-center">
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
