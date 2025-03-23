import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDebouncedCallback } from "use-debounce";
import ButtonStart from "./ui/button";
import { BACKEND_URL } from "../Constants/constant";
import SkeletonLoader from "./SkeletonLoader";
import CreateCarModal from "../Api/Car/CreateCarModal";


const Home = () => {
  const navigate = useNavigate();
  const [isCreateCarModalOpen, setIsCreateCarModalOpen] = useState(false);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "" }); // For notifications

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

  // Handle successful car creation
  const handleCreateCarSuccess = (newCar) => {

    
    setCars((prevCars) => [newCar, ...prevCars]);
    setIsCreateCarModalOpen(false); // Close the modal
    setNotification({
      message: "Car created successfully! 🎉",
      type: "success",
    });

    // Clear notification after 5 seconds
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 5000);
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
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Hero Section */}
      <div className="w-full bg-cover bg-center h-screen flex items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl bg-black bg-opacity-50 p-8 rounded-lg z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl font-bold text-white mb-4"
          >
            Find Your Dream Car Today
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-white text-lg mb-6"
          >
            Buy and sell cars effortlessly with our seamless platform. Get the
            best deals and find your perfect ride in just a few clicks.
          </motion.p>

          {/* Buttons with navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex gap-4 justify-center"
          >
            <ButtonStart
              className="px-6 py-3 text-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all"
              onClick={handleBrowseCars}
            >
              Browse Cars
            </ButtonStart>

            <ButtonStart
              className="px-6 py-3 text-lg bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-lg shadow-lg hover:from-gray-900 hover:to-gray-800 transition-all"
              onClick={() => setIsCreateCarModalOpen(true)}
              >
              Sell Your Car
            </ButtonStart>
          </motion.div>
        </motion.div>

        {/* Parallax Background */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/path-to-your-hero-image.jpg')" }}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        ></motion.div>
      </div>

      {/* Featured Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="mt-16 w-full max-w-7xl px-4"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl font-bold text-center mb-8"
        >
          Featured Cars
        </motion.h2>
        {loading ? (<SkeletonLoader />) : (
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
                className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow"
              >
                <img
                  src={car.image} // Assuming the car object has an image property
                  alt={car.title} // Assuming the car object has a name property
                  className="rounded-lg w-full h-40 object-cover"
                />
                <h2 className="text-xl font-semibold mt-4">{car.title}</h2>
                <p className="text-gray-600 mt-2">{car.description}</p>

                <ButtonStart
                  className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg py-2 hover:from-blue-700 hover:to-blue-600 transition-all"
                  onClick={() => handleViewDetails(car.id)} // Debounced click handler
                >
                  View Details
                </ButtonStart>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Testimonials Section */}
      <div className="w-full bg-gray-800 mt-16 py-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl font-bold text-center text-white mb-8"
        >
          What Our Customers Say
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {[1, 2, 3].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 * index, duration: 0.8 }}
              className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow"
            >
              <p className="text-gray-600">"I found my dream car in just a few clicks. The process was seamless and hassle-free!"</p>
              <p className="text-gray-800 font-semibold mt-4">- John Doe</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Car Modal */}
      <CreateCarModal
        isOpen={isCreateCarModalOpen}
        closeModal={() => setIsCreateCarModalOpen(false)}
        onCreateSuccess={handleCreateCarSuccess}
      />
    </div>
  );
};

export default Home;