import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1920&q=80",
    title: "Fast Micro-Loans, Fair Terms",
    desc: "Get approved in minutes and access funds instantly with LoanLink’s transparent, data-driven lending.",
    cta: "Apply for Loan",
    link: "/login",
  },
  {
    img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1920&q=80",
    title: "Build Credit, Borrow Smarter",
    desc: "Every repayment boosts your credit score—unlock higher limits and lower rates over time.",
    cta: "Explore Loans",
    link: "/all-loans",
  },
  {
    img: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?auto=format&fit=crop&w=1920&q=80",
    title: "Zero Paperwork, 100% Digital",
    desc: "Upload documents once, reuse forever. LoanLink keeps everything secure and seamless.",
    cta: "Get Started",
    link: "/register",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[350px] md:h-[500px] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="h-full"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <img
                src={s.img}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#1a1b29]/70 backdrop-blur-[1px]" />

              {/* Content */}
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-6"
              >
                <h1 className="font-rajdhani text-4xl md:text-6xl font-bold mb-4">
                  {s.title}
                </h1>
                <p className="max-w-2xl text-base md:text-lg mb-8">{s.desc}</p>
                <Link
                  to={s.link}
                  className="btn bg-gradient btn-lg px-8 py-3 rounded shadow hover:shadow-xl transition"
                >
                  {s.cta}
                </Link>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
