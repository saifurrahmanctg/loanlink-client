/* Register.jsx */
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import PageHeader from "../../Components/PageHeader";
import authImage from "../../assets/auth-image.jpg";
import authBg from "../../assets/auth-bg.png";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { BsUpload } from "react-icons/bs";
import { useState } from "react";

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  /* ---------- imgBB upload ---------- */
  const uploadToImgBB = async (file) => {
    setUploading(true);
    const body = new FormData();
    body.append("image", file);

    const res = await fetch(
      "https://api.imgbb.com/1/upload?key=VITE_IMG_BB_KEY",
      { method: "POST", body }
    );
    const data = await res.json();
    setUploading(false);

    if (data.success) {
      setValue("photo", data.data.url);
      setPreview(data.data.url);
    } else {
      alert("Upload failed – try again");
    }
  };

  const onSelectFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    uploadToImgBB(file);
  };

  const onSubmit = async (data) => {
    console.log("Register Data:", data);
    await new Promise((r) => setTimeout(r, 1000));
    alert("Registration successful (demo)");
  };

  return (
    <div className="mt-16 bg-base-100">
      <PageHeader title="Register" />

      <section className="lg:flex gap-10 max-w-7xl mx-auto px-4 py-20">
        {/* Left Image */}
        <div className="hidden lg:flex flex-1 mb-10 lg:mb-0">
          <img
            src={authImage}
            alt="auth icon"
            className="max-w-fit h-full mx-auto rounded shadow-lg object-contain animate-elegant-swing"
          />
        </div>

        {/* Right Register Form */}
        <div
          className="flex-1 py-12 px-8 rounded shadow-lg"
          style={{
            backgroundImage: `url(${authBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full max-w-lg mx-auto rounded-2xl relative">
            {/* TITLE */}
            <div className="flex items-center justify-between gap-5 mb-8">
              <div>
                <h2 className="font-rajdhani text-3xl font-bold mb-2">
                  Register & Manage Your{" "}
                  <span className="text-transparent bg-clip-text text-gradient">
                    LoanLink
                  </span>
                </h2>
                <p className="text-gray-500">Create your account in seconds</p>
              </div>
              <div>
                <Link
                  to="/login"
                  className="bg-base-100 text-blue-500 px-4 py-2.5 rounded-l cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient px-4 py-2.5 rounded-r cursor-pointer"
                >
                  Register
                </Link>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className={`input input-bordered w-full rounded ${
                    errors.name ? "input-error" : ""
                  }`}
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Photo */}
              <div>
                <label className="block mb-1 font-semibold">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer flex items-center gap-2 btn btn-outline btn-sm normal-case"
                  >
                    <BsUpload />
                    {uploading ? "Uploading…" : "Choose image"}
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onSelectFile}
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-14 h-14 rounded-full object-cover shadow"
                    />
                  )}
                </div>
                <input
                  type="hidden"
                  {...register("photo", {
                    required: "Please upload a photo",
                  })}
                />
                {errors.photo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.photo.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`input input-bordered w-full rounded ${
                    errors.email ? "input-error" : ""
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email format",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 font-semibold">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={`input input-bordered w-full rounded ${
                    errors.password ? "input-error" : ""
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded font-semibold bg-gradient hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Creating account…" : "Register"}
              </button>
            </form>

            {/* Divider */}
            <div className="divider my-8">OR</div>

            {/* Social Register */}
            <div className="flex items-center gap-4 mt-4">
              <button
                type="button"
                onClick={() => alert("Google sign-up (demo)")}
                className="flex-1 btn btn-outline btn-accent rounded normal-case"
              >
                <FcGoogle className="mr-2 text-xl" />
                Sign up with Google
              </button>

              <button
                type="button"
                onClick={() => alert("GitHub sign-up (demo)")}
                className="flex-1 btn btn-outline rounded normal-case"
              >
                <FaGithub className="mr-2 text-xl" />
                Sign up with GitHub
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#3BADE3] font-semibold hover:underline"
              >
                Login Now
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
