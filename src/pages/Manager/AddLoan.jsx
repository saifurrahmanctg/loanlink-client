import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import DashboardHeader from "../../Components/Dashboard/DashboardHeader";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const API = import.meta.env.VITE_API_URL;
const IMGBB_KEY = import.meta.env.VITE_IMGBB_KEY;

export default function AddLoan() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const mutation = useMutation({
    mutationFn: async (formData) => {
      // ------- UPLOAD IMAGE TO IMGBB -------
      let LoanImageURL = "";

      if (formData.loanImage?.length > 0) {
        const file = formData.loanImage[0];
        const imgForm = new FormData();
        imgForm.append("image", file);

        const uploadRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
          {
            method: "POST",
            body: imgForm,
          }
        );

        const uploadData = await uploadRes.json();
        LoanImageURL = uploadData?.data?.url || "";
      }

      // ------- CONVERT EMI STRING TO ARRAY -------
      const emiArray = formData.emiPlans
        .split(",")
        .map((num) => Number(num.trim()))
        .filter((n) => !isNaN(n));

      // ------- FINAL PAYLOAD MATCHING YOUR DB FORMAT -------
      const payload = {
        id: Date.now(), // auto generate ID
        "Loan Image": LoanImageURL,
        "Loan Title": formData.loanTitle,
        "Loan Category": formData.loanCategory,
        Interest: Number(formData.interest),
        "Max Loan Limit": Number(formData.maxLoanLimit),
        description: formData.description,
        availableEMIPlans: emiArray,
      };

      const res = await fetch(`${API}/loans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      return res.json();
    },

    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Loan Added Successfully",
        text: "The loan has been stored in the database.",
      });
      reset();
    },

    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add loan. Please try again.",
      });
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <DashboardHeader title="Add Loan" />
      </motion.div>

      <section className="py-10 px-6 bg-base-100">
        <motion.div
          className="max-w-4xl mx-auto bg-base-300 shadow-lg rounded p-10"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold mb-8 text-center font-rajdhani text-gradient">
            Add New Loan
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="md:grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Loan Title */}
            <div className="col-span-2 mb-4 md:mb-0">
              <label className="font-semibold">Loan Title</label>
              <input
                {...register("loanTitle", { required: true })}
                className="input input-bordered w-full mt-2 md:mt-0"
              />
              {errors.loanTitle && <p className="text-red-500">Required</p>}
            </div>

            {/* Loan Category */}
            <div className="mb-4 md:mb-0">
              <label className="font-semibold">Loan Category</label>
              <input
                {...register("loanCategory", { required: true })}
                className="input input-bordered w-full mt-2 md:mt-0"
              />
              {errors.loanCategory && <p className="text-red-500">Required</p>}
            </div>

            {/* Interest */}
            <div className="mb-4 md:mb-0">
              <label className="font-semibold">Interest (%)</label>
              <input
                type="number"
                {...register("interest", { required: true })}
                className="input input-bordered w-full mt-2 md:mt-0"
              />
              {errors.interest && <p className="text-red-500">Required</p>}
            </div>

            {/* Max Loan Limit */}
            <div className="mb-4 md:mb-0">
              <label className="font-semibold">Max Loan Limit</label>
              <input
                type="number"
                {...register("maxLoanLimit", { required: true })}
                className="input input-bordered w-full mt-2 md:mt-0"
              />
              {errors.maxLoanLimit && <p className="text-red-500">Required</p>}
            </div>

            {/* EMI Plans */}
            <div className="mb-4 md:mb-0">
              <label className="font-semibold">EMI Plans</label>
              <input
                {...register("emiPlans", { required: true })}
                placeholder="e.g. 3, 6, 9, 12"
                className="input input-bordered w-full mt-2 md:mt-0"
              />
              {errors.emiPlans && <p className="text-red-500">Required</p>}
            </div>

            {/* Description */}
            <div className="col-span-2 mb-4 md:mb-0">
              <label className="font-semibold">Description</label>
              <textarea
                {...register("description", { required: true })}
                rows={3}
                className="textarea textarea-bordered w-full mt-2 md:mt-0"
              ></textarea>
              {errors.description && <p className="text-red-500">Required</p>}
            </div>

            {/* Loan Image */}
            <div className="col-span-2 mb-4 md:mb-0">
              <label className="font-semibold">Loan Image</label>
              <input
                type="file"
                {...register("loanImage", { required: true })}
                className="file-input file-input-bordered w-full mt-2 md:mt-0"
              />
              {errors.loanImage && <p className="text-red-500">Required</p>}
            </div>

            {/* Submit */}
            <div className="col-span-2 mt-6 flex">
              <button
                type="submit"
                className="btn w-full md:btn-wide bg-gradient px-10 text-white"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? "Submitting..." : "Add Loan"}
              </button>
            </div>
          </form>
        </motion.div>
      </section>
    </>
  );
}
