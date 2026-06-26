import { motion } from "framer-motion";

export default function Hero({ title, subtitle }) {
  return (
    <section className="glass-card overflow-hidden p-8 md:p-10">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-title max-w-3xl font-display text-5xl font-extrabold tracking-tight"
      >
        {title}
      </motion.h2>

      <p className="mt-4 max-w-2xl text-lg leading-8 text-secondary">
        {subtitle}
      </p>
    </section>
  );
}