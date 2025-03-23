import React, { useState, useEffect } from "react";
import axios from "axios";
import StarRating from "../../components/StarRating";
import { BACKEND_URL } from "../../Constants/constant";
import { motion, AnimatePresence } from "framer-motion";
import { BuildingStorefrontIcon, MapPinIcon } from "@heroicons/react/24/solid";
import CreateDealershipModal from "./CreateDealershipModal";
import DealershipModal from "./DealershipModal";
import Notification from "../../components/Globle/Notification";
import SkeletonLoader from "../../components/SkeletonLoader";

const Dealership = () => {
  const [dealerships, setDealerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDealership, setSelectedDealership] = useState(null);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });
  const [processing, setProcessing] = useState(false); // Track processing state

  const authToken = localStorage.getItem("authToken");

  const fetchDealerships = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/store/dealerships`);
      setDealerships(response.data);
    } catch (error) {
      console.error("Error fetching dealerships:", error);
      setNotification({
        message: "Failed to fetch dealerships. Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealerships();
  }, []);

  const handleCreateDealership = async () => {
    setProcessing(true); // Start processing
    try {
      await fetchDealerships(); // Refetch dealerships after creation
      setNotification({
        message: "Dealership created successfully! 🎉",
        type: "success",
      });
      setShowCreateModal(false); // Close the modal after successful creation
    } catch (error) {
      console.error("Error creating dealership:", error);
      setNotification({
        message: "Failed to create dealership. Please try again.",
        type: "error",
      });
    } finally {
      setProcessing(false); // End processing
    }
  };

  const filteredDealerships = dealerships.filter((dealership) => {
    const query = searchQuery.toLowerCase();
    return (
      dealership.dealership_name.toLowerCase().includes(query) ||
      (dealership.address && dealership.address.toLowerCase().includes(query))
    );
  });

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen p-8 flex flex-col items-center">
      {/* Title */}
      <motion.h1
        className="text-5xl font-extrabold mb-10 text-center text-blue-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🏢 Explore Dealerships
      </motion.h1>

      {/* Search and Create Section */}
      <motion.div
        className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-12 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search Dealerships..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-3 w-full md:w-1/3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
        />

        {/* Create Dealership Button */}
        {authToken ? (
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Create Dealership
          </motion.button>
        ) : (
          <p className="text-gray-500 text-sm italic">
            Login to create a dealership
          </p>
        )}
      </motion.div>

      {/* Skeleton Loading */}
      {loading && <SkeletonLoader />}

      {/* Dealerships Grid */}
      {!loading && (
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
          {filteredDealerships.map((dealership, index) => (
            <motion.div
              key={dealership.id}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="h-full" // Ensure all cards have the same height
            >
              <div
                onClick={() => setSelectedDealership(dealership)}
                className="relative bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer group transform transition-all duration-300 border border-gray-100 h-full flex flex-col"
              >
                {/* Dealership Icon */}
                <div className="relative w-full h-48 flex justify-center items-center bg-blue-50">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <BuildingStorefrontIcon className="h-10 w-10 text-blue-600" />
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white px-4">
                    <div className="text-2xl font-bold mb-2">
                      {dealership.dealership_name}
                    </div>
                    <p className="text-sm text-blue-300">Tap for details</p>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="p-4 bg-gradient-to-r from-blue-100 to-white flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-blue-800 font-bold text-lg truncate">
                      {dealership.dealership_name}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mt-2">
                      <MapPinIcon className="h-5 w-5 mr-2 text-blue-400" />
                      <span className="truncate">
                        {dealership.address || "Unknown Location"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <StarRating rating={parseFloat(dealership.ratings)} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* No Dealerships Found */}
      {!loading && filteredDealerships.length === 0 && (
        <motion.div
          className="text-gray-600 text-lg mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No dealerships found 😕
        </motion.div>
      )}

      {/* Create Dealership Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateDealershipModal
            onClose={() => !processing && setShowCreateModal(false)} // Prevent closing during processing
            onCreated={handleCreateDealership}
            processing={processing} // Pass processing state to modal
          />
        )}
      </AnimatePresence>

      {/* View Dealership Modal */}
      <AnimatePresence>
        {selectedDealership && (
          <DealershipModal
            isOpen={!!selectedDealership}
            dealership={selectedDealership}
            closeModal={() => setSelectedDealership(null)}
            onDeleteSuccess={(deletedId) => {
              setDealerships((prev) => prev.filter((d) => d.id !== deletedId));
              setSelectedDealership(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Notification */}
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "" })}
        />
      )}
    </div>
  );
};

export default Dealership;