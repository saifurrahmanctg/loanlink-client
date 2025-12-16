import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useAuth } from "../../Provider/AuthProvider";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const API = import.meta.env.VITE_API_URL;
const IMGBB_KEY = import.meta.env.VITE_IMGBB_KEY;

export default function AddLoan() {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Main mutation
  const mutation = useMutation({
    mutationFn: async (formData) => {
      if (!user?.email) throw new Error("No logged-in user found");

      // Convert EMI string to array
      const emiArray = formData.emiPlans
        .split(",")
        .map((n) => Number(n.trim()))
        .filter((n) => !isNaN(n));

      // 1️⃣ Upload Image FIRST
      let imageURL = "";
      if (formData.loanImage?.length > 0) {
        const file = formData.loanImage[0];
        const imgForm = new FormData();
        imgForm.append("image", file);

        const uploadRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
          { method: "POST", body: imgForm }
        );

        const uploadData = await uploadRes.json();
        imageURL = uploadData?.data?.url;

        if (!imageURL) {
          throw new Error("Image upload failed");
        }
      }

      // 2️⃣ Save loan with IMAGE URL included
      const payload = {
        title: formData.loanTitle,
        category: formData.loanCategory,
        interest: Number(formData.interest),
        maxLoanLimit: Number(formData.maxLoanLimit),
        description: formData.description,
        availableEMIPlans: emiArray,
        image: imageURL,
        createdBy: user.email,
        showOnHome: false,
        createdAt: new Date(),
      };

      const res = await fetch(`${API}/loans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add loan");

      return await res.json();
    },

    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Loan Added Successfully!",
        text: "Your loan has been added with image.",
        timer: 2500,
        showConfirmButton: false,
      });
      reset();
    },

    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error Occurred",
        text: err.message || "Something went wrong",
      });
    },
  });

  return (
    <section className="py-10 px-6 bg-base-100">
      <motion.div
        className="max-w-4xl mx-auto bg-base-300 shadow-lg rounded p-10"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="text-center mb-8">
          <h2 className="font-rajdhani text-3xl font-bold mb-2">
            Add <span className="text-gradient">Loan</span>
          </h2>
          <p className="text-gray-600">
            Enter the following details to add a new loan
          </p>
        </div>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="md:grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="col-span-2">
            <label className="font-semibold">Loan Title</label>
            <input
              {...register("loanTitle", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.loanTitle && <p className="text-red-500">Required</p>}
          </div>

          <div>
            <label className="font-semibold">Loan Category</label>
            <input
              {...register("loanCategory", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.loanCategory && <p className="text-red-500">Required</p>}
          </div>

          <div>
            <label className="font-semibold">Interest (%)</label>
            <input
              type="number"
              step="any"
              {...register("interest", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.interest && <p className="text-red-500">Required</p>}
          </div>

          <div>
            <label className="font-semibold">Max Loan Limit</label>
            <input
              type="number"
              {...register("maxLoanLimit", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.maxLoanLimit && <p className="text-red-500">Required</p>}
          </div>

          <div>
            <label className="font-semibold">EMI Plans</label>
            <input
              {...register("emiPlans", { required: true })}
              placeholder="e.g. 3, 6, 9, 12"
              className="input input-bordered w-full"
            />
            {errors.emiPlans && <p className="text-red-500">Required</p>}
          </div>

          <div className="col-span-2">
            <label className="font-semibold">Description</label>
            <textarea
              {...register("description", { required: true })}
              rows={3}
              className="textarea textarea-bordered w-full"
            />
            {errors.description && <p className="text-red-500">Required</p>}
          </div>

          <div className="col-span-2">
            <label className="font-semibold">Loan Image</label>
            <input
              type="file"
              {...register("loanImage", { required: true })}
              className="file-input file-input-bordered w-full"
            />
            {errors.loanImage && <p className="text-red-500">Image Required</p>}
          </div>

          <div className="col-span-2 mt-6">
            <button
              type="submit"
              className="btn w-full bg-gradient text-white flex justify-center items-center"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Uploading & Saving...
                </>
              ) : (
                "Add Loan"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
