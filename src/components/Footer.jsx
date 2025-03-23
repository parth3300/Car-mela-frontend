import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h3 className="text-xl font-bold mb-4">About Us</h3>
          <p className="text-gray-400">
            We are a leading platform for buying and selling cars. Our mission is
            to make the process seamless and enjoyable for everyone.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="text-gray-400">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/cars">Browse Cars</a>
            </li>
            <li>
              <a href="/sell-car">Sell Your Car</a>
            </li>
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <p className="text-gray-400">Email: support@carplatform.com</p>
          <p className="text-gray-400">Phone: +1 234 567 890</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;