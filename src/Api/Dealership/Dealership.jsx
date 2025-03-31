import React, { useState, useEffect } from "react";
import axios from "axios";
import StarRating from "../../components/StarRating";
import { BACKEND_URL } from "../../Constants/constant";
import { motion, AnimatePresence } from "framer-motion";
import { MapPinIcon } from "@heroicons/react/24/solid";
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
  const [processing, setProcessing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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
    setProcessing(true);
    try {
      await fetchDealerships();
      setNotification({
        message: "Dealership created successfully! 🎉",
        type: "success",
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating dealership:", error);
      setNotification({
        message: "Failed to create dealership. Please try again.",
        type: "error",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteDealership = async (id) => {
    if (deletingId) return; // Prevent multiple deletions
    
    setDeletingId(id);
    try {
      await axios.delete(`${BACKEND_URL}/store/dealerships/${id}/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setDealerships((prev) => prev.filter((d) => d.id !== id));
      setNotification({
        message: "Dealership deleted successfully!",
        type: "success",
      });
      setSelectedDealership(null);
    } catch (error) {
      console.error("Error deleting dealership:", error);
      setNotification({
        message: error.response?.data?.message || 
               "Failed to delete dealership. Please try again.",
        type: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDealerships = dealerships.filter((dealership) => {
    const query = searchQuery.toLowerCase();
    return (
      dealership.dealership_name.toLowerCase().includes(query) ||
      (dealership.address && dealership.address.toLowerCase().includes(query))
    );
  });

  const getPlaceholderImage = (name) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-red-500', 
      'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'
    ];
    const initials = name ? name.charAt(0).toUpperCase() : 'D';
    const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
    
    return (
      <div className={`w-full h-full ${colors[colorIndex]} flex items-center justify-center text-white text-6xl font-bold`}>
        {initials}
      </div>
    );
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "Unknown Location";
    return text.length > maxLength 
      ? `${text.substring(0, maxLength)}...` 
      : text;
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen p-8 flex flex-col items-center">
      <motion.h1
        className="text-5xl font-extrabold mb-10 text-center text-blue-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🏢 Explore Dealerships
      </motion.h1>

      <motion.div
        className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-12 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <input
          type="text"
          placeholder="Search Dealerships..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-3 w-full md:w-1/3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
        />

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

      {loading && <SkeletonLoader />}

      {!loading && (
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
          {filteredDealerships.map((dealership, index) => (
            <motion.div
              key={dealership.id}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="h-full"
            >
              <div
                onClick={() => setSelectedDealership(dealership)}
                className="relative bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer group transform transition-all duration-300 border border-gray-100 h-full flex flex-col"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  {dealership.image ? (
                    <img
                      src={dealership.image}
                      alt={dealership.dealership_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '';
                        e.target.alt = 'Image failed to load';
                      }}
                    />
                  ) : (
                    getPlaceholderImage(dealership.dealership_name)
                  )}
                  
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white px-4">
                    <div className="text-2xl font-bold mb-2">
                      {dealership.dealership_name}
                    </div>
                    <p className="text-sm text-blue-300">Tap for details</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-100 to-white flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-blue-800 font-bold text-lg truncate">
                      {dealership.dealership_name}
                    </div>
                    <div className="flex items-start text-gray-600 text-sm mt-2">
                      <MapPinIcon className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0" />
                      <span className="break-words line-clamp-2">
                        {truncateText(dealership.address || "Unknown Location", 50)}
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

      {!loading && filteredDealerships.length === 0 && (
        <motion.div
          className="text-gray-600 text-lg mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No dealerships found 😕
        </motion.div>
      )}

      <AnimatePresence>
        {showCreateModal && (
          <CreateDealershipModal
            onClose={() => !processing && setShowCreateModal(false)}
            onCreated={handleCreateDealership}
            processing={processing}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDealership && (
          <DealershipModal
            isOpen={!!selectedDealership}
            dealership={selectedDealership}
            closeModal={() => setSelectedDealership(null)}
            onDeleteSuccess={handleDeleteDealership}
            isDeleting={deletingId === selectedDealership.id}
          />
        )}
      </AnimatePresence>

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