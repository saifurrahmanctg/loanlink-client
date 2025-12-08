import { motion } from "framer-motion";

const colors = ["#3BADE3", "#06D6A0", "#118AB2", "#073B4C"];

const squareVariants = {
  animate: (i) => ({
    x: [0, 45, 45, 0, 0],
    y: [0, 0, 45, 45, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
      delay: i * 0.5,
    },
  }),
};

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100">
      <div className="relative w-24 h-24">
        {colors.map((c, i) => (
          <motion.span
            key={c}
            className="absolute w-5 h-5 rounded-sm"
            style={{ backgroundColor: c }}
            custom={i}
            variants={squareVariants}
            animate="animate"
          />
        ))}
      </div>
    </div>
  );
}
