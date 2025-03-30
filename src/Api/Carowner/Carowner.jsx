import React, { useState, useEffect } from "react";
import axios from "axios";
import StarRating from "../../components/StarRating";
import { BACKEND_URL } from "../../Constants/constant";
import { motion, AnimatePresence } from "framer-motion";
import { UserIcon, IdentificationIcon } from "@heroicons/react/24/solid";
import CreateCarownerModal from "./CreateCarownerModal";
import CarownerModal from "./CarownerModal";
import UpdateCarownerModal from "./UpdateCarownerModal";
import { PencilSquareIcon } from "@heroicons/react/24/solid"; // For edit icon
import { jwtDecode } from "jwt-decode";
import SkeletonLoader from "../../components/SkeletonLoader";

const Carowners = () => {
  const [carowners, setCarowners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCarowner, setSelectedCarowner] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // State for UpdateCarownerModal visibility
  const [carownerToUpdate, setCarownerToUpdate] = useState(null); // State to store the car owner to update
  const [notification, setNotification] = useState({ message: "", type: "" });

  const authToken = localStorage.getItem("authToken");
  let user_id = "";
  if (authToken) {
    let decoded = jwtDecode(authToken);
    user_id = decoded?.user_id;
  }


  const fetchCarowners = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/store/carowners/`);
      setCarowners(response.data);
    } catch (error) {
      console.error("Error fetching car owners:", error);
      setNotification({
        message: "Failed to fetch car owners. Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarowners();
  }, []);

  const filteredCarowners = carowners.filter((carowner) =>
    carowner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteSuccess = (deletedId) => {
    setCarowners((prev) => prev.filter((owner) => owner.id !== deletedId));
    setSelectedCarowner(null);
    setNotification({
      message: "Customer deleted successfully!",
      type: "success",
    });
  };

  const handleCreateSuccess = (newCarowner) => {
    setCarowners((prev) => [newCarowner, ...prev]);
    setShowCreateModal(false);
    setNotification({
      message: "Car owner created successfully! 🎉",
      type: "success",
    });
  };

  const handleUpdateSuccess = (updatedCarowner) => {
    setCarowners((prev) =>
      prev.map((owner) =>
        owner.id === updatedCarowner.id ? updatedCarowner : owner
      )
    );
    setIsUpdateModalOpen(false); // Close the modal after successful update
    setNotification({
      message: "Car owner updated successfully! 🎉",
      type: "success",
    });
  };

  let user_is_carowner = "";
  user_is_carowner = carowners.find(
    (owner) => {
      return owner.user === user_id}
  );
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen p-8 flex flex-col items-center">
      {/* Heading */}
      <motion.h1
        className="text-5xl font-extrabold mb-10 text-center text-blue-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🚘 Explore Car Owners
      </motion.h1>

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

      {/* Search + Create */}
      <motion.div
        className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-12 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Search */}
        <input
          type="text"
          placeholder="Search Car Owners..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-3 w-full md:w-1/3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
        />

        {/* Create button */}
        {user_is_carowner ? (
          "" // Nothing is rendered if the user is already a car owner
        ) : authToken ? (
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Become Car Owner
          </motion.button>
        ) : (
          <p className="text-gray-500 text-sm italic">
            Login to create a car owner
          </p>
        )}
      </motion.div>

      {/* Loading Skeleton */}
      {loading && <SkeletonLoader />}

      {/* Car Owners List */}
      {!loading && (
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
          {filteredCarowners.map((carowner, index) => (
            <motion.div
              key={carowner.id}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}

              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="w-full" // Ensure the motion.div takes full width
            >
              <div
                onClick={() => setSelectedCarowner(carowner)}
                className="relative flex flex-col items-center bg-white rounded-2xl p-6 shadow-md hover:shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 group h-full" // Add h-full for consistent height
                style={{ transformOrigin: "center" }} // Ensure scaling originates from the center
              >
                {/* Profile Picture */}
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  {carowner.profile_pic ? (
                    <img
                      src={carowner.profile_pic}
                      alt={carowner.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-10 w-10 text-blue-600" />
                  )}
                </div>

                {/* Info */}
                <div className="text-center">
                  <h2 className="text-xl font-bold text-blue-800 mb-2">
                    {carowner.name}
                  </h2>

                  <div className="flex items-center justify-center text-gray-600 text-sm mb-3">
                    <IdentificationIcon className="h-4 w-4 mr-1 text-blue-400" />
                    {carowner.cars_count || 0} Cars
                  </div>

                  {/* Star Rating */}
                  <StarRating rating={parseFloat(carowner.ratings || 0)} />
                </div>

                {/* Balance on Hover */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white px-4">
                  <p className="text-lg font-semibold">Balance:</p>
                  <p className="text-2xl font-bold">${carowner.balance || 0}</p>
                </div>

                {/* Update Button */}
                {authToken && user_id && user_id === carowner?.user && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening the details modal
                      setCarownerToUpdate(carowner); // Set the car owner to update
                      setIsUpdateModalOpen(true); // Open the update modal
                    }}
                    className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                )}

                {/* View Details Link */}
                <motion.div
                  className="mt-4 text-left text-sm text-blue-600 font-medium hover:text-blue-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  View Details →
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* No Car Owners Found */}
      {!loading && filteredCarowners.length === 0 && (
        <motion.div
          className="text-gray-600 text-lg mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No car owners found 😕
        </motion.div>
      )}

      {/* Create Car Owner Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateCarownerModal
            isOpen={showCreateModal}
            closeModal={() => setShowCreateModal(false)}
            onCreateSuccess={handleCreateSuccess}
            setNotification={setNotification}
          />
        )}
      </AnimatePresence>

      {/* View Car Owner Modal */}
      <AnimatePresence>
        {selectedCarowner && (
          <CarownerModal
            isOpen={!!selectedCarowner}
            carowner={selectedCarowner}
            closeModal={() => setSelectedCarowner(null)}
            onDeleteSuccess={handleDeleteSuccess}
          />
        )}
      </AnimatePresence>

      {/* Update Car Owner Modal */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <UpdateCarownerModal
            isOpen={isUpdateModalOpen}
            carowner={carownerToUpdate} // Pass the car owner to update directly
            closeModal={() => setIsUpdateModalOpen(false)}
            onUpdateSuccess={handleUpdateSuccess}
            setNotification={setNotification}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Carowners;