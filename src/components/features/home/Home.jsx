import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";   
import axios from "axios";
import { useDebouncedCallback } from "use-debounce";
import { jwtDecode } from "jwt-decode";
import ButtonStart from "../../../components/ui/button";
import { BACKEND_URL } from "../../../Constants/constant";
import SkeletonLoader from "../../common/SkeletonLoader";
import CreateCarOwnerModal from "../../../Api/Carowner/CreateCarownerModal";
import CreateCarModal from "../../../Api/Car/CreateCarModal";
import ResponseHandler from "../../Globle/ResponseHandler";

const Home = () => {
  const navigate = useNavigate();
  const [isCreateCarModalOpen, setIsCreateCarModalOpen] = useState(false);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateCarOwnerModal, setShowCreateCarOwnerModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [currentCarOwnerId, setCurrentCarOwnerId] = useState(null);
  
  // Response handler states
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    action: ""
  });
  const [createCarProcessing, setCreateCarProcessing] = useState(false);
  const [createCarOwnerProcessing, setCreateCarOwnerProcessing] = useState(false);

  // Enhanced animations
  const pageTransition = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.4 }
    }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Fetch car data from the backend
  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/store/cars`);
      const filteredCars = response.data.filter((car) =>
        [8, 9, 10].includes(car.id)
      );
      setCars(filteredCars);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setNotification({
        message: error.message || "Failed to fetch cars",
        type: "error",
        action: ""
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleBrowseCars = () => {
    navigate("/cars");
  };

  const handleSellCarClick = async () => {
    const authToken = localStorage.getItem("authToken");
    
    if (!authToken) {
      setNotification({
        message: "Please log in first!",
        type: "info",
        action: "login"
      });
      return navigate("/login");
    }

    setButtonLoading(true);

    try {
      const decoded = jwtDecode(authToken);
      const response = await axios.get(`${BACKEND_URL}/store/carowners/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const carOwner = response.data.find(owner => owner.user === decoded.user_id);

      if (carOwner) {
        setCurrentCarOwnerId(carOwner.id);
        setIsCreateCarModalOpen(true);
      } else {
        setShowCreateCarOwnerModal(true);
        setNotification({
          message: "First, register as a Car Owner to sell cars",
          type: "info",
          action: "carowner"
        });
      }
    } catch (error) {
      console.error("Error checking car owner status:", error);
      setNotification({
        message: error.message || "An error occurred. Please try again.",
        type: "error",
        action: "carowner"
      });
    } finally {
      setButtonLoading(false);
    }
  };

  const handleCarOwnerCreated = (newCarOwner) => {
    setCurrentCarOwnerId(newCarOwner.id);
    setShowCreateCarOwnerModal(false);

    setTimeout(() => {
      setIsCreateCarModalOpen(true);
    }, 3000);
  };

  const handleCarCreated = (newCar) => {
    setCars(prevCars => [newCar, ...prevCars]);
    setIsCreateCarModalOpen(false);
    setNotification({
      message: "Car listed successfully!",
      type: "success",
      action: "create"
    });
  };

  const handleViewDetails = useDebouncedCallback((id) => {
    navigate(`/cars/${id}`);
  }, 300);

  return (
    <motion.div 
      className="relative w-full min-h-screen bg-gray-100"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageTransition}
    >
      {/* Response Handler */}
      <AnimatePresence>
        {notification.message && (
          <ResponseHandler
            resourceName="Car"
            action={notification.action}
            error={notification.type === "error" ? { message: notification.message } : null}
            success={notification.type === "success" ? { message: notification.message } : null}
            onClear={() => setNotification({ message: "", type: "", action: "" })}
          />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black z-0"
        />

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-center max-w-2xl px-8 py-16 backdrop-blur-sm bg-black/40 rounded-3xl shadow-2xl"
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-extrabold text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Find Your Dream Car Today
          </motion.h1>

          <motion.p 
            className="text-xl text-gray-200 mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Buy and sell cars seamlessly. Get the best deals on your perfect ride in just a few clicks.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemAnimation}>
              <ButtonStart
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-2xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                onClick={handleBrowseCars}
              >
                Browse Cars
              </ButtonStart>
            </motion.div>

            <motion.div variants={itemAnimation}>
              <ButtonStart
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-xl shadow-lg hover:shadow-2xl hover:from-gray-900 hover:to-gray-800 transition-all duration-300 transform hover:scale-105"
                onClick={handleSellCarClick}
                disabled={buttonLoading}
              >
                {buttonLoading ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Processing...
                  </motion.span>
                ) : "Sell Your Car"}
              </ButtonStart>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Featured Cars */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Featured Cars
        </motion.h2>

        {loading ? (
          <SkeletonLoader />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {cars.map((car) => (
              <motion.div
                key={car.id}
                variants={itemAnimation}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <motion.div
                  className="relative overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={car.image}
                    alt={car.title}
                    className="w-full h-48 object-cover transform transition-transform duration-300"
                  />
                </motion.div>
                <div className="p-6 flex flex-col h-[250px]">
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">{car.title}</h3>
                  <p className="text-gray-600 mb-6 flex-grow">{car.description}</p>
                  <ButtonStart
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg py-3 px-6 font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
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
      <section className="bg-gradient-to-b from-gray-900 to-black py-20">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center text-white mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          What Our Customers Say
        </motion.h2>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto px-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              text: "I found my dream car in just a few clicks. The process was seamless and hassle-free!",
              author: "John Doe",
              role: "Happy Customer"
            },
            {
              text: "The best car marketplace I've ever used. Professional service and great deals!",
              author: "Jane Smith",
              role: "Car Enthusiast"
            },
            {
              text: "Selling my car was incredibly easy. Got a great price and excellent support!",
              author: "Mike Johnson",
              role: "Car Seller"
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemAnimation}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <motion.p 
                className="text-gray-700 italic text-lg leading-relaxed mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                "{testimonial.text}"
              </motion.p>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-900 font-semibold">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {showCreateCarOwnerModal && (
          <CreateCarOwnerModal
            isOpen={showCreateCarOwnerModal}
            closeModal={() => !createCarOwnerProcessing && setShowCreateCarOwnerModal(false)}
            onCreateSuccess={handleCarOwnerCreated}
            processing={createCarOwnerProcessing}
            setProcessing={setCreateCarOwnerProcessing}
          />
        )}

        {isCreateCarModalOpen && (
          <CreateCarModal
            isOpen={isCreateCarModalOpen}
            closeModal={() => !createCarProcessing && setIsCreateCarModalOpen(false)}
            onCreateSuccess={handleCarCreated}
            carOwnerId={currentCarOwnerId}
            processing={createCarProcessing}
            setProcessing={setCreateCarProcessing}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;