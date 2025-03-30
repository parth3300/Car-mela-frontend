// src/Components/CarAnimation.js
import React from "react";
import { motion } from "framer-motion";

const CarAnimation = ({
  src = "/images/car2.jpg",
  top = "top-2",
  size = "w-16",
  duration = 2,
  zIndex = "z-50",
}) => {
  return (
    <motion.img
      src={src}
      alt="Loading Car"
      className={`absolute ${top} ${size} h-auto ${zIndex}`}
      initial={{ x: "-100%" }}
      animate={{ x: "100%" }}
      transition={{
        duration,
        ease: "linear",
        repeat: Infinity,
      }}
    />
  );
};

export default CarAnimation;
