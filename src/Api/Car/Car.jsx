import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import StarRating from "../../components/StarRating";
import { BACKEND_URL } from "../../Constants/constant";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce"; // Install using `npm install use-debounce`
import CreateCarModal from "./CreateCarModal"; // Import the CreateCarModal
import UpdateCarModal from "./UpdateCarModal"; // Import the UpdateCarModal
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/solid"; // For clear search button and edit icon

const Car = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300); // 300ms debounce
  const [isCreateCarModalOpen, setIsCreateCarModalOpen] = useState(false);
  const [isUpdateCarModalOpen, setIsUpdateCarModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null); // Car to update
  const [notification, setNotification] = useState({ message: "", type: "" }); // For notifications

  const authToken = localStorage.getItem("authToken");

  // Fetch cars data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/store/cars`);
        setCars(response.data);
      } catch (error) {
        console.error("Error fetching car data:", error);
        setNotification({
          message: "Failed to fetch cars. Please try again later.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter cars based on search query
  const filteredCars = cars.filter((car) => {
    const query = debouncedQuery.toLowerCase();
    return (
      car.title.toLowerCase().includes(query) ||
      (car.carowner && car.carowner.name.toLowerCase().includes(query))
    );
  });

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

  // Handle successful car update
  const handleUpdateCarSuccess = (updatedCar) => {
    setCars((prevCars) =>
      prevCars.map((car) => (car.id === updatedCar.id ? updatedCar : car))
    );
    setIsUpdateCarModalOpen(false); // Close the modal
    setNotification({
      message: "Car updated successfully! 🎉",
      type: "success",
    });

    // Clear notification after 5 seconds
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 5000);
  };

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
      {[...Array(8)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="w-full h-[300px] bg-gray-200 animate-pulse"></div>
          <div className="p-4">
            <div className="h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen p-8 flex flex-col items-center">
      {/* Notification */}
      <AnimatePresence>
        {notification.message && (
          <motion.div
            className="fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              backgroundColor:
                notification.type === "success" ? "#D1FAE5" : "#FEE2E2",
              color: notification.type === "success" ? "#065F46" : "#991B1B",
            }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <motion.h1
        className="text-5xl font-extrabold mb-10 text-center text-blue-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🚗 Explore Our Cars
      </motion.h1>

      {/* Search and Create Section */}
      <motion.div
        className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-12 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Search Input with Clear Button */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search Car..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
            aria-label="Search for cars"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Create Car Button */}
        {authToken ? (
          <motion.button
            onClick={() => setIsCreateCarModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Create Car
          </motion.button>
        ) : (
          <p className="text-gray-500 text-sm italic">
            Login to create a car
          </p>
        )}
      </motion.div>

      {/* Loading Spinner */}
      {loading && <SkeletonLoader />}

      {/* Car Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
        {filteredCars.map((car, index) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="w-full"
          >
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer group transform transition-all duration-300 border border-gray-100 hover:shadow-2xl hover:border-blue-200">
              {/* Car Image with Link */}
              <Link to={`/cars/${car.id}`}>
                <motion.div
                  className="relative w-full h-[300px] flex justify-center items-center bg-blue-50"
                  whileHover={{ scale: 1.02 }} // Subtle scale effect on hover
                >
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={car.image || "https://via.placeholder.com/300?text=No+Image"}
                    alt={car.title}
                  />

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white px-4">
                    <div className="text-2xl font-bold mb-2">{car.title}</div>
                    <div className="text-lg mb-2">₹{car.price}</div>
                    <StarRating rating={parseFloat(car.ratings)} />
                    <div className="text-sm text-blue-300 mt-2">
                      {car.carowner ? car.carowner.name : "Unknown Owner"}
                    </div>
                  </div>
                </motion.div>
              </Link>

              {/* Bottom Info */}
              <div className="p-4 bg-gradient-to-r from-blue-100 to-white">
                <div className="text-blue-800 font-bold text-lg truncate">
                  {car.title}
                </div>
                <div className="text-gray-700 font-semibold mt-1">
                  ₹{car.price}
                </div>
              </div>

              {/* Update Button */}
              {authToken && ![8, 9, 10].includes(car.id) && (
                <button
                  onClick={() => {
                    setSelectedCar(car);
                    setIsUpdateCarModalOpen(true);
                  }}
                  className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Cars Found */}
      {!loading && filteredCars.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center mt-10 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/7486/7486747.png"
            alt="No cars found"
            className="w-24 h-24 mb-4 opacity-75"
          />
          <p className="text-lg font-semibold">No cars found 😕</p>
          <p className="text-sm text-gray-500">Try adjusting your search or create a new car.</p>
        </motion.div>
      )}

      {/* Create Car Modal */}
      <CreateCarModal
        isOpen={isCreateCarModalOpen}
        closeModal={() => setIsCreateCarModalOpen(false)}
        onCreateSuccess={handleCreateCarSuccess}
      />

      {/* Update Car Modal */}
      <UpdateCarModal
        isOpen={isUpdateCarModalOpen}
        closeModal={() => setIsUpdateCarModalOpen(false)}
        car={selectedCar}
        onUpdateSuccess={handleUpdateCarSuccess}
      />
    </div>
  );
};

export default Car;