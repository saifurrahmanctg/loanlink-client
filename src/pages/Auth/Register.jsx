/* Register.jsx */
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import PageHeader from "../../Components/Shared/PageHeader";
import authImage from "../../assets/auth-image.jpg";
import authBg from "../../assets/auth-bg.png";
import authBgDark from "../../assets/auth-bg-dark.png";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { BsUpload } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useAuth } from "../../Provider/AuthProvider";

const MySwal = withReactContent(Swal);

/* ------------- tiny hook to read DaisyUI theme ------------- */
const useDaisyTheme = () => {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light"
  );
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setTheme(document.documentElement.getAttribute("data-theme") || "light")
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);
  return theme;
};

/* ------------- animation variants (unchanged) ------------- */
const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
};
const floatVariants = {
  hover: {
    y: [-4, 4, -4],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

/* ------------- page component ------------- */
export default function Register() {
  const location = useLocation();
  const [role, setRole] = useState("borrower");
  const roleOptions = [
    { value: "borrower", label: "Borrower" },
    { value: "manager", label: "Manager" },
  ];
  const {
    register: hookFormRegister,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const { signUp, signInWithGoogle } = useAuth(); // ← Firebase hooks
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  /* 🎯 live theme */
  const theme = useDaisyTheme();
  const bgImage = theme === "dark" ? authBgDark : authBg;

  /* ---------- imgBB upload (unchanged) ---------- */
  const uploadToImgBB = async (file) => {
    setUploading(true);
    const body = new FormData();
    body.append("image", file);
    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
        { method: "POST", body }
      );
      const data = await res.json();
      if (data.success) {
        setValue("photo", data.data.url);
        setPreview(data.data.url);
      } else {
        MySwal.fire({ icon: "error", title: "Upload failed" });
      }
    } catch {
      MySwal.fire({ icon: "error", title: "Network error" });
    } finally {
      setUploading(false);
    }
  };

  const onSelectFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    uploadToImgBB(file);
  };

  /* ---------- Firebase register ---------- */
  const onSubmit = async ({ name, email, password, photo, role }) => {
    try {
      // Firebase auth create user
      await signUp(email, password, name, photo, role);

      // Save to MongoDB
      await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          photo,
          role,
          createdAt: new Date(),
        }),
      });

      MySwal.fire({
        icon: "success",
        title: "Account created!",
        text: "User saved in MongoDB successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/dashboard");
    } catch (err) {
      MySwal.fire({
        icon: "error",
        title: "Registration failed",
        text: err.message,
      });
    }
  };

  /* ---------- Google register ---------- */
  const googleRegister = async () => {
    try {
      const user = await signInWithGoogle();

      // Save to MongoDB
      await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName || "No Name",
          email: user.email,
          photo: user.photoURL || "",
          role: "borrower", // default role
          createdAt: new Date(),
        }),
      });

      MySwal.fire({
        icon: "success",
        title: "Signed up with Google!",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/dashboard");
    } catch (err) {
      MySwal.fire({
        icon: "error",
        title: "Google sign-up failed",
        text: err.message,
      });
    }
  };

  return (
    <>
      {/* PageHeader + animations (unchanged) */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <PageHeader title="Register" />
      </motion.div>

      <div className="bg-base-100">
        <section className="lg:flex max-w-7xl mx-auto px-4 py-20">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover="hover"
            variants={floatVariants}
            className="hidden lg:block flex-1 mb-10 lg:mb-0"
          >
            <img
              src={authImage}
              alt="auth icon"
              className="w-full h-full mx-auto rounded shadow-lg"
            />
          </motion.div>

          {/* Right Register Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto flex-1 py-12 px-8 rounded shadow-lg"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
              className="w-full max-w-lg mx-auto rounded-2xl relative"
            >
              {/* TITLE */}
              <motion.div
                custom={1}
                variants={fadeInVariants}
                className="flex items-center justify-between gap-5 mb-8"
              >
                <div>
                  <h2 className="font-rajdhani text-3xl font-bold mb-2">
                    Register & Manage Your{" "}
                    <span className="text-gradient">LoanLink</span>
                  </h2>
                  <p className="text-gray-500">
                    Create your account in seconds
                  </p>
                </div>
                <div>
                  <Link
                    to="/login"
                    state={{ from: location }}
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
              </motion.div>

              {/* FORM */}
              <motion.form
                custom={2}
                variants={fadeInVariants}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Name */}
                <motion.div custom={3} variants={fadeInVariants}>
                  <label className="block mb-1 font-semibold">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    className={`input input-bordered w-full rounded ${
                      errors.name ? "input-error" : ""
                    }`}
                    {...hookFormRegister("name", {
                      required: "Name is required",
                    })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </motion.div>

                {/* Photo + Role Row */}
                <motion.div
                  custom={4}
                  variants={fadeInVariants}
                  className="grid grid-cols-2 gap-4"
                >
                  {/* LEFT - Photo Upload (unchanged) */}
                  <div>
                    <label className="block mb-1 font-semibold">
                      Profile Photo
                    </label>
                    <div className="flex items-center gap-4">
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer flex items-center gap-2 btn btn-outline btn-sm normal-case"
                      >
                        <BsUpload /> {uploading ? "Uploading…" : "Choose image"}
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
                          className="w-14 h-14 rounded object-cover shadow"
                        />
                      )}
                    </div>
                    <input
                      type="hidden"
                      {...hookFormRegister("photo", {
                        required: "Please upload a photo",
                      })}
                    />
                    {errors.photo && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.photo.message}
                      </p>
                    )}
                  </div>

                  {/* RIGHT - Role Dropdown (NEW) */}
                  <div>
                    <label className="block mb-1 font-semibold">Role</label>
                    <select
                      className="select select-bordered w-full rounded"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      {...hookFormRegister("role", {
                        required: "Please select a role",
                      })}
                    >
                      {roleOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    {errors.role && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.role.message}
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div custom={5} variants={fadeInVariants}>
                  <label className="block mb-1 font-semibold">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`input input-bordered w-full rounded ${
                      errors.email ? "input-error" : ""
                    }`}
                    {...hookFormRegister("email", {
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
                </motion.div>

                {/* Password */}
                <motion.div custom={6} variants={fadeInVariants}>
                  <label className="block mb-1 font-semibold">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className={`input input-bordered w-full rounded ${
                      errors.password ? "input-error" : ""
                    }`}
                    {...hookFormRegister("password", {
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
                </motion.div>

                {/* Register Button */}
                <motion.div custom={7} variants={fadeInVariants}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded font-semibold bg-gradient hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Creating account…" : "Register"}
                  </button>
                </motion.div>
              </motion.form>

              {/* Divider */}
              <motion.div custom={8} variants={fadeInVariants}>
                <div className="divider my-8">OR</div>
              </motion.div>

              {/* Social Register */}
              <motion.div
                custom={9}
                variants={fadeInVariants}
                className="flex items-center gap-4 mt-4"
              >
                <button
                  type="button"
                  onClick={googleRegister}
                  className="flex-1 btn btn-outline btn-accent rounded normal-case"
                >
                  <FcGoogle className="mr-2 text-xl" /> Sign up with Google
                </button>
                <button
                  type="button"
                  onClick={() => alert("GitHub sign-up (demo)")}
                  className="flex-1 btn btn-outline rounded normal-case"
                >
                  <FaGithub className="mr-2 text-xl" /> Sign up with GitHub
                </button>
              </motion.div>

              {/* Login Link */}
              <motion.p
                custom={10}
                variants={fadeInVariants}
                className="text-center mt-6"
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="text-[#3BADE3] font-semibold hover:underline"
                >
                  Login Now
                </Link>
              </motion.p>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </>
  );
}
