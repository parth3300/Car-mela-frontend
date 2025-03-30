import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import StarRating from "../../components/StarRating";
import { BACKEND_URL } from "../../Constants/constant";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce";
import CreateCarModal from "./CreateCarModal";
import UpdateCarModal from "./UpdateCarModal";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import SkeletonLoader from "../../components/SkeletonLoader";

const Car = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [isCreateCarModalOpen, setIsCreateCarModalOpen] = useState(false);
  const [isUpdateCarModalOpen, setIsUpdateCarModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [selectedCars, setSelectedCars] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const authToken = localStorage.getItem("authToken");

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

  const filteredCars = cars.filter((car) => {
    const query = debouncedQuery.toLowerCase();
    return (
      car.title.toLowerCase().includes(query) ||
      (car.carowner && car.carowner.name.toLowerCase().includes(query))
    );
  });

  const toggleCarSelection = (carId) => {
    setSelectedCars(prev =>
      prev.includes(carId)
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
  };

  const deleteSelectedCars = async () => {
    if (selectedCars.length === 0) return;

    try {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");
      
      await Promise.all(
        selectedCars.map(carId =>
          axios.delete(`${BACKEND_URL}/store/cars/${carId}/`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          })
        )
      );

      setCars(prev => prev.filter(car => !selectedCars.includes(car.id)));
      setSelectedCars([]);
      setIsDeleteMode(false);
      
      setNotification({
        message: `${selectedCars.length} car(s) deleted successfully!`,
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting cars:", error);
      setNotification({
        message: "Failed to delete cars. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 5000);
    }
  };

  const handleCreateCarSuccess = (newCar) => {
    setCars((prevCars) => [newCar, ...prevCars]);
    setIsCreateCarModalOpen(false);
    setNotification({
      message: "Car created successfully! 🎉",
      type: "success",
    });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  const handleUpdateCarSuccess = (updatedCar) => {
    setCars((prevCars) =>
      prevCars.map((car) => (car.id === updatedCar.id ? updatedCar : car))
    );
    setIsUpdateCarModalOpen(false);
    setNotification({
      message: "Car updated successfully! 🎉",
      type: "success",
    });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen p-8 flex flex-col items-center">
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

      <motion.h1
        className="text-5xl font-extrabold mb-10 text-center text-blue-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🚗 Explore Our Cars
      </motion.h1>

      <motion.div
        className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-12 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search Car..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex gap-3">
          {isDeleteMode ? (
            <>
              <button
                onClick={deleteSelectedCars}
                disabled={selectedCars.length === 0}
                className={`px-4 py-3 rounded-lg shadow-md transition-all duration-300 ${
                  selectedCars.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                Delete ({selectedCars.length})
              </button>
              <button
                onClick={() => {
                  setIsDeleteMode(false);
                  setSelectedCars([]);
                }}
                className="px-4 py-3 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {authToken && (
                <>
                  <button
                    onClick={() => setIsDeleteMode(true)}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
                  >
                    Delete Cars
                  </button>
                  <button
                    onClick={() => setIsCreateCarModalOpen(true)}
                    className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
                  >
                    + Create Car
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </motion.div>

      {loading && <SkeletonLoader />}

      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
        {filteredCars.map((car, index) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="w-full"
          >
            <div className={`relative bg-white rounded-2xl overflow-hidden shadow-xl group transform transition-all duration-300 border ${
              selectedCars.includes(car.id) 
                ? "border-red-500 ring-2 ring-red-500" 
                : "border-gray-100 hover:border-blue-200"
            } hover:shadow-2xl flex flex-col h-full`}>

              {isDeleteMode ? (
                <div 
                  className={`relative cursor-pointer ${selectedCars.includes(car.id) ? 'ring-2 ring-green-500' : ''} ${
                    [8, 9, 10].includes(car.id) ? 'cursor-not-allowed opacity-70' : ''
                  }`}
                  onClick={() => ![8, 9, 10].includes(car.id) && toggleCarSelection(car.id)}
                >
                  <div className="absolute top-2 left-2 z-10">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                      selectedCars.includes(car.id) 
                        ? "bg-green-500" 
                        : [8, 9, 10].includes(car.id) 
                          ? "bg-gray-300 border-2 border-gray-400" 
                          : "bg-white/80 border-2 border-gray-300"
                    }`}>
                      {selectedCars.includes(car.id) && (
                        <svg 
                          className="w-5 h-5 text-white"
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={3} 
                            d="M5 13l4 4L19 7" 
                          />
                        </svg>
                      )}
                      {[8, 9, 10].includes(car.id) && (
                        <svg 
                          className="w-4 h-4 text-gray-600"
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={3} 
                            d="M6 18L18 6M6 6l12 12" 
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div className="relative w-full h-[200px] flex justify-center items-center bg-blue-50">
                    <img
                      className="w-full h-full object-cover"
                      src={car.image || "https://via.placeholder.com/300?text=No+Image"}
                      alt={car.title}
                    />
                  </div>
                </div>
              ) : (
                <Link to={`/cars/${car.id}`} className="flex flex-col h-full">
                  <div className="relative w-full h-[200px] flex justify-center items-center bg-blue-50">
                    <img
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      src={car.image || "https://via.placeholder.com/300?text=No+Image"}
                      alt={car.title}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white px-4">
                      <div className="text-xl font-bold mb-1">{car.title}</div>
                      <div className="text-md mb-1">${car.price}</div>
                      <StarRating rating={parseFloat(car.average_rating)} />
                    </div>
                  </div>
                </Link>
              )}

              {/* Card Content with Fixed Height */}
              <div className="p-4 flex flex-col h-[250px]"> 
                {/* Content Area (Flexible Height) */}
                <div className="flex-grow">
                  <h3 className="text-blue-800 font-bold text-lg truncate">
                    {car.title}
                  </h3>
                  <p className="text-gray-700 font-semibold mt-1">
                    ${car.price}
                  </p>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                    {car.description || "No description available"}
                  </p>
                </div>

                {/* View Details Button - Anchored at the Bottom */}
                <div className="mt-auto pt-2 border-t border-gray-200">
                  <Link 
                    to={`/cars/${car.id}`}
                    className="w-full block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Update Button */}
              {authToken && ![8, 9, 10].includes(car.id) && !isDeleteMode && (
                <button
                  onClick={() => {
                    setSelectedCar(car);
                    setIsUpdateCarModalOpen(true);
                  }}
                  className="absolute top-2 right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

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

      <CreateCarModal
        isOpen={isCreateCarModalOpen}
        closeModal={() => setIsCreateCarModalOpen(false)}
        onCreateSuccess={handleCreateCarSuccess}
      />

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