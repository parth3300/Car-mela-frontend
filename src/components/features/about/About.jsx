import React from "react";
import { motion } from "framer-motion";
import { Users, Star, CarFront } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-24">

        {/* 🚗 About Section */}
        <motion.div
          className="text-center flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-extrabold text-blue-800">
            🚗 About Our Car Project
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl leading-relaxed">
            Welcome to our car project! We provide comprehensive information, ratings, and reviews on a wide range of cars. Explore, rate, and review your favorite cars effortlessly!
          </p>
        </motion.div>

        {/* ⭐ Key Features */}
        <motion.div
          className="flex flex-col items-center gap-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl font-semibold text-gray-700">Key Features</h3>

          <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
            {/* Feature 1 */}
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col items-center gap-4 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <Star size={40} className="text-blue-600" />
              <h4 className="text-xl font-bold text-gray-700">Comprehensive Reviews</h4>
              <p className="text-gray-500 text-sm">
                In-depth car reviews to help you make informed decisions.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col items-center gap-4 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <Users size={40} className="text-blue-600" />
              <h4 className="text-xl font-bold text-gray-700">User Ratings</h4>
              <p className="text-gray-500 text-sm">
                Honest feedback and ratings from a community of car enthusiasts.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col items-center gap-4 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <CarFront size={40} className="text-blue-600" />
              <h4 className="text-xl font-bold text-gray-700">Explore Models</h4>
              <p className="text-gray-500 text-sm">
                Discover a wide selection of car models from various brands.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* 👥 Team Section */}
        <motion.div
          className="flex flex-col items-center gap-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
         
        </motion.div>
      </div>
    </div>
  );
};

export default About;
