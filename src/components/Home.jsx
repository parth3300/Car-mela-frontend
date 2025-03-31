import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";   
import axios from "axios";
import { useDebouncedCallback } from "use-debounce";
import { jwtDecode } from "jwt-decode";
import ButtonStart from "./ui/button";
import { BACKEND_URL } from "../Constants/constant";
import SkeletonLoader from "./SkeletonLoader";
import CreateCarOwnerModal from "../Api/Carowner/CreateCarownerModal";
import CreateCarModal from "../Api/Car/CreateCarModal";
import ResponseHandler from "../components/Globle/ResponseHandler";

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
  const [processing, setProcessing] = useState(false);
  const [createCarProcessing, setCreateCarProcessing] = useState(false);
  const [createCarOwnerProcessing, setCreateCarOwnerProcessing] = useState(false);

  // Fetch car data from the backend
  useEffect(() => {
    const fetchCars = async () => {
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
    };

    fetchCars();
  }, []);

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

  const carCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  console.log(currentCarOwnerId)
  return (
    <div className="relative w-full min-h-screen bg-gray-100">
      {/* Response Handler */}
      <ResponseHandler
        resourceName="Car"
        action={notification.action}
        error={notification.type === "error" ? { message: notification.message } : null}
        success={notification.type === "success" ? { message: notification.message } : null}
        onClear={() => setNotification({ message: "", type: "", action: "" })}
      />

      {/* Hero Section */}
      <div className="relative w-full h-screen flex items-center justify-center bg-black">
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-2xl px-6 py-12 bg-black bg-opacity-60 rounded-2xl"
        >
          <motion.h1 className="text-5xl font-extrabold text-white mb-6">
            Find Your Dream Car Today
          </motion.h1>

          <motion.p className="text-lg text-gray-200 mb-8 leading-relaxed">
            Buy and sell cars seamlessly. Get the best deals on your perfect ride in just a few clicks.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonStart
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl shadow-md hover:from-blue-700 hover:to-blue-600 transition-all"
              onClick={handleBrowseCars}
            >
              Browse Cars
            </ButtonStart>

            <ButtonStart
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-xl shadow-md hover:from-gray-900 hover:to-gray-800 transition-all"
              onClick={handleSellCarClick}
              disabled={buttonLoading}
            >
              {buttonLoading ? "Processing..." : "Sell Your Car"}
            </ButtonStart>
          </motion.div>
        </motion.div>
      </div>

      {/* Featured Cars */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <motion.h2 className="text-4xl font-bold text-center mb-12">
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
                <div className="p-4 flex flex-col h-[250px]"> 
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
        <motion.h2 className="text-4xl font-bold text-center text-white mb-12">
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
        closeModal={() => !createCarOwnerProcessing && setShowCreateCarOwnerModal(false)}
        onCreateSuccess={handleCarOwnerCreated}
        processing={createCarOwnerProcessing}
        setProcessing={setCreateCarOwnerProcessing}
      />

      <CreateCarModal
        isOpen={isCreateCarModalOpen}
        closeModal={() => !createCarProcessing && setIsCreateCarModalOpen(false)}
        onCreateSuccess={handleCarCreated}
        carOwnerId={currentCarOwnerId}
        processing={createCarProcessing}
        setProcessing={setCreateCarProcessing}
      />
    </div>
  );
};

export default Home;