import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDebouncedCallback } from "use-debounce"; // Import useDebouncedCallback
import ButtonStart from "./ui/button";
import { BACKEND_URL } from "../Constants/constant";

const Home = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch car data from the backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/store/cars`);
        // Filter cars with IDs 7, 8, and 9
        const filteredCars = response.data.filter((car) =>
          [8, 9, 10].includes(car.id)
        );
        setCars(filteredCars);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Click Handlers for buttons
  const handleBrowseCars = () => {
    navigate("/cars");
  };

  const handleSellYourCar = () => {
    navigate("/sell-car");
  };

  // Debounced handleViewDetails function
  const handleViewDetails = useDebouncedCallback((id) => {
    navigate(`/cars/${id}`); // Redirect to the car details page
  }, 300); // 300ms debounce delay

  // Animation variants for staggered car cards
  const carCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Find Your Dream Car Today
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Buy and sell cars effortlessly with our seamless platform. Get the
          best deals and find your perfect ride in just a few clicks.
        </p>

        {/* Buttons with navigation */}
        <div className="flex gap-4 justify-center">
          <ButtonStart
            className="px-6 py-3 text-lg bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
            onClick={handleBrowseCars}
          >
            Browse Cars
          </ButtonStart>

          <ButtonStart
            className="px-6 py-3 text-lg bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-900"
            onClick={handleSellYourCar}
          >
            Sell Your Car
          </ButtonStart>
        </div>
      </motion.div>

      {/* Featured Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="mt-16 w-full max-w-7xl"
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2, // Stagger the animation of each car card
                },
              },
            }}
          >
            {cars.map((car) => (
              <motion.div
                key={car.id}
                variants={carCardVariants} // Apply animation variants
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-xl shadow-xl"
              >
                <img
                  src={car.image} // Assuming the car object has an image property
                  alt={car.title} // Assuming the car object has a name property
                  className="rounded-lg w-full h-40 object-cover"
                />
                <h2 className="text-xl font-semibold mt-4">{car.title}</h2>
                <p className="text-gray-600 mt-2">{car.description}</p>

                <ButtonStart
                  className="mt-4 w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
                  onClick={() => handleViewDetails(car.id)} // Debounced click handler
                >
                  View Details
                </ButtonStart>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Home;