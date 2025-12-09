import { Link, useNavigate } from "react-router";
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
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { login, signInWithGoogle } = useAuth(); // ← Firebase hooks
  const navigate = useNavigate();

  /* 🎯 live theme */
  const theme = useDaisyTheme();
  const bgImage = theme === "dark" ? authBgDark : authBg;

  /* ---------- Firebase email login ---------- */
  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
      MySwal.fire({
        icon: "success",
        title: "Welcome back!",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/dashboard");
    } catch (err) {
      MySwal.fire({
        icon: "error",
        title: "Login failed",
        text: err.message,
      });
    }
  };

  /* ---------- Firebase Google login ---------- */
  const googleLogin = async () => {
    try {
      await signInWithGoogle();
      MySwal.fire({
        icon: "success",
        title: "Signed in with Google!",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/dashboard");
    } catch (err) {
      MySwal.fire({
        icon: "error",
        title: "Google sign-in failed",
        text: err.message,
      });
    }
  };

  return (
    <>
      {/* -------------  PageHeader animates from top ------------- */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <PageHeader title="Login" />
      </motion.div>

      <div className="bg-base-100">
        <section className="lg:flex justify-center max-w-7xl mx-auto px-4 py-20">
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

          {/* Right Login Form */}
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
                    Welcome Back to{" "}
                    <span className="text-transparent bg-clip-text bg-gradient">
                      LoanLink
                    </span>
                  </h2>
                  <p className="text-gray-500">
                    Sign in to access your microloan dashboard
                  </p>
                </div>
                <div>
                  <Link
                    to="/login"
                    className="bg-gradient px-4 py-2.5 rounded-l cursor-pointer"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-base-100 text-blue-500 px-4 py-2.5 rounded-r cursor-pointer"
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
                {/* Email */}
                <motion.div custom={3} variants={fadeInVariants}>
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
                </motion.div>

                {/* Password */}
                <motion.div custom={4} variants={fadeInVariants}>
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
                </motion.div>

                {/* Forgot Password */}
                <div className="flex justify-between items-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#3BADE3] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <motion.div custom={5} variants={fadeInVariants}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded font-semibold bg-gradient hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>
                </motion.div>
              </motion.form>

              {/* Divider */}
              <motion.div custom={6} variants={fadeInVariants}>
                <div className="divider my-8">OR</div>
              </motion.div>

              {/* Social Login */}
              <motion.div
                custom={7}
                variants={fadeInVariants}
                className="flex items-center gap-4 mt-4"
              >
                <button
                  type="button"
                  onClick={googleLogin}
                  className="flex-1 btn btn-outline btn-accent rounded normal-case"
                >
                  <FcGoogle className="mr-2 text-xl" />
                  Login with Google
                </button>

                <button
                  type="button"
                  onClick={() => alert("GitHub login (demo)")}
                  className="flex-1 btn btn-outline rounded normal-case"
                >
                  <FaGithub className="mr-2 text-xl" />
                  Login with GitHub
                </button>
              </motion.div>

              {/* Register Link */}
              <motion.p
                custom={8}
                variants={fadeInVariants}
                className="text-center mt-6"
              >
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#3BADE3] font-semibold hover:underline"
                >
                  Register Now
                </Link>
              </motion.p>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </>
  );
}
