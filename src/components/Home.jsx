import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";   
import axios from "axios";
import { useDebouncedCallback } from "use-debounce";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode
import ButtonStart from "./ui/button";
import { BACKEND_URL } from "../Constants/constant";
import SkeletonLoader from "./SkeletonLoader";
import CreateCarOwnerModal from "../Api/Carowner/CreateCarownerModal"; // Import CreateCarOwnerModal
import CreateCarModal from "../Api/Car/CreateCarModal";

const Home = () => {
  const navigate = useNavigate();
  const [isCreateCarModalOpen, setIsCreateCarModalOpen] = useState(false);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showCreateCarOwnerModal, setShowCreateCarOwnerModal] = useState(false); // Add state for CreateCarOwnerModal
  const [buttonLoading, setButtonLoading] = useState(false); // Add state for button loading

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
  const handleCreateCarSuccess = async (newCar) => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setNotification({
        message: "Please log in first!",
        type: "info",
      });
      return navigate("/login");
    }

    let decoded;
    try {
      decoded = jwtDecode(authToken);
    } catch (error) {
      setNotification({
        message: "Invalid token, please log in again.",
        type: "error",
      });
      localStorage.removeItem("authToken");
      return navigate("/login");
    }

    const user_id = decoded?.user_id;
    if (!user_id) {
      setNotification({
        message: "User not found, please log in again.",
        type: "error",
      });
      localStorage.removeItem("authToken");
      return navigate("/login");
    }

    setButtonLoading(true);

    try {
      // ✅ Step 1: Check if user is a Car Owner
      const carownerResponse = await axios.get(`${BACKEND_URL}/store/carowners/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const carowner = carownerResponse.data.find(
        (owner) => owner.user === user_id
      );

      if (!carowner) {
        // ✅ Show CreateCarOwner modal if not found
        setNotification({
          message: "Please become a Car Owner to create a car.",
          type: "info",
        });
        setShowCreateCarOwnerModal(true);
        return; // 👉 Exit here! Don't proceed to create a car.
      }

      setTimeout(() => {
        setIsCreateCarModalOpen(true);
        setNotification({ message: "", type: "" });
      }, 500);
      
      // If the user is a car owner, proceed with creating a car
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
    } catch (error) {
      console.error("Error checking car owner status:", error);
      setNotification({
        message: "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setButtonLoading(false);
    }
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
    <div className="relative w-full min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative w-full h-screen flex items-center justify-center bg-black">
        {/* Background Image */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ backgroundImage: "url('/path-to-your-hero-image.jpg')" }}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        ></motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-2xl px-6 py-12 bg-black bg-opacity-60 rounded-2xl"
        >
          <motion.h1
            className="text-5xl font-extrabold text-white mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Find Your Dream Car Today
          </motion.h1>

          <motion.p
            className="text-lg text-gray-200 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Buy and sell cars seamlessly. Get the best deals on your perfect ride in just a few clicks.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ButtonStart
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl shadow-md hover:from-blue-700 hover:to-blue-600 transition-all"
              onClick={handleBrowseCars}
            >
              Browse Cars
            </ButtonStart>

            <ButtonStart
              id="sell-your-car-button"
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-xl shadow-md hover:from-gray-900 hover:to-gray-800 transition-all"
              onClick={() => handleCreateCarSuccess(true)}
              disabled={buttonLoading}
            >
              {buttonLoading ? "Processing..." : "Sell Your Car"}
            </ButtonStart>
          </motion.div>
        </motion.div>
      </div>

      {/* Featured Cars */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Featured Cars
        </motion.h2>

        {loading ? (
          <SkeletonLoader />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          >
            {cars.map((car) => (
              <motion.div
                key={car.id}
                variants={carCardVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={car.image}
                  alt={car.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">{car.title}</h3>
                  <p className="text-gray-600 mb-4">{car.description}</p>

                  <ButtonStart
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg py-2 hover:from-blue-700 hover:to-blue-600 transition-all"
                    onClick={() => handleViewDetails(car.id)}
                  >
                    View Details
                  </ButtonStart>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Testimonials */}
      <section className="bg-gray-900 py-16">
        <motion.h2
          className="text-4xl font-bold text-center text-white mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          What Our Customers Say
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto px-4">
          {[1, 2, 3].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 * index }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <p className="text-gray-700 italic">
                "I found my dream car in just a few clicks. The process was seamless and hassle-free!"
              </p>
              <p className="text-gray-900 font-semibold mt-6">- John Doe</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modals */}
      <CreateCarOwnerModal
        isOpen={showCreateCarOwnerModal}
        closeModal={() => setShowCreateCarOwnerModal(false)}
        onCreateSuccess={() => {
          setShowCreateCarOwnerModal(false);
          setNotification({ message: "You are now a Car Owner! 🚗", type: "success" });

          setTimeout(() => {
            setIsCreateCarModalOpen(true);
            setNotification({ message: "", type: "" });
          }, 5000);
        }}
      />

      <CreateCarModal
        isOpen={isCreateCarModalOpen}
        closeModal={() => setIsCreateCarModalOpen(false)}
        onCreateSuccess={handleCreateCarSuccess}
      />
    </div>
  );
};

export default Home;