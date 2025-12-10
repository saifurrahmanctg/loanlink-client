/* Contact.jsx */
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { useForm } from "react-hook-form";
import PageHeader from "../../Components/Shared/PageHeader";

const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
};

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Contact form:", data);
    await new Promise((r) => setTimeout(r, 1200));
    alert("Message sent (demo)");
    reset();
  };

  return (
    <>
      {/* Page Header */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <PageHeader title="Contact Us" />
      </motion.div>

      <div className="bg-base-100 px-6 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* LEFT: FORM */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div custom={1} variants={fadeInVariants}>
              <h2 className="font-rajdhani text-3xl font-bold mb-2">
                Get in <span className="text-gradient">Touch</span>
              </h2>
              <p className="text-gray-600 mb-8">We'd love to hear from you.</p>
            </motion.div>

            <motion.form
              custom={2}
              variants={fadeInVariants}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Name */}
              <motion.div custom={3} variants={fadeInVariants}>
                <label className="block mb-1 font-semibold">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
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
              </motion.div>

              {/* Email */}
              <motion.div custom={4} variants={fadeInVariants}>
                <label className="block mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
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

              {/* Message */}
              <motion.div custom={5} variants={fadeInVariants}>
                <label className="block mb-1 font-semibold">Message</label>
                <textarea
                  rows="4"
                  placeholder="Tell us how we can help..."
                  className={`textarea textarea-bordered w-full rounded ${
                    errors.message ? "textarea-error" : ""
                  }`}
                  {...register("message", { required: "Message is required" })}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </motion.div>

              {/* Submit */}
              <motion.div custom={6} variants={fadeInVariants}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded font-semibold bg-gradient hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Sending…" : "Send Message"}
                </button>
              </motion.div>
            </motion.form>
          </motion.div>

          {/* RIGHT: MAP + CARDS */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="space-y-8"
          >
            {/* Google Map */}
            <motion.div
              custom={1}
              variants={fadeInVariants}
              className="rounded-2xl overflow-hidden shadow"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3685.1!2d91.8089!3d22.3269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDE5JzM2LjkiTiA5McKwNDgnMzIuMCJF!5e0!3m2!1sen!2sbd!4v1679999999999"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="LoanLink Chittagong Office"
              />
            </motion.div>

            {/* Contact Cards */}
            <motion.div
              custom={2}
              variants={fadeInVariants}
              className="grid sm:grid-cols-3 gap-4 text-center"
            >
              <div className="bg-base-200 p-4 rounded shadow">
                <FiMail className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm text-gray-600">Email</p>
                <a
                  href="mailto:info@loanlink.com"
                  className="text-sm font-medium"
                >
                  info@loanlink.com
                </a>
              </div>
              <div className="bg-base-200 p-4 rounded shadow">
                <FiPhone className="w-6 h-6 mx-auto mb-2 text-accent" />
                <p className="text-sm text-gray-600">Phone</p>
                <a href="tel:+8802333316321" className="text-sm font-medium">
                  +880 23333 16321-5
                </a>
              </div>
              <div className="bg-base-200 p-4 rounded shadow">
                <FiMapPin className="w-6 h-6 mx-auto mb-2 text-info" />
                <p className="text-sm text-gray-600">Address</p>
                <p className="text-sm font-medium">
                  11 Agrabad C/A, Chittagong - 4100
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
