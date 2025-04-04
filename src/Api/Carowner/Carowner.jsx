import React, { useState, useEffect } from "react";
import axios from "axios";
import StarRating from "../../components/common/StarRating";
import { BACKEND_URL } from "../../Constants/constant";
import { motion, AnimatePresence } from "framer-motion";
import { UserIcon, IdentificationIcon } from "@heroicons/react/24/solid";
import CreateCarownerModal from "./CreateCarownerModal";
import CarownerModal from "./CarownerModal";
import UpdateCarownerModal from "./UpdateCarownerModal";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { jwtDecode } from "jwt-decode";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import ResponseHandler from "../../components/Globle/ResponseHandler";

const Carowners = () => {
  const [carowners, setCarowners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCarowner, setSelectedCarowner] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [carownerToUpdate, setCarownerToUpdate] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [processing, setProcessing] = useState({
    create: false,
    update: false,
    delete: false
  });

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
      message: "Carowner deleted successfully!",
      type: "success",
    });
    setProcessing({ ...processing, delete: false });
  };

  const handleCreateSuccess = (newCarowner) => {
    setCarowners((prev) => [newCarowner, ...prev]);
    setShowCreateModal(false);
    setNotification({
      message: "Car owner created successfully! 🎉",
      type: "success",
    });
    setProcessing({ ...processing, create: false });
  };

  const handleUpdateSuccess = (updatedCarowner) => {
    setCarowners((prev) =>
      prev.map((owner) =>
        owner.id === updatedCarowner.id ? updatedCarowner : owner
      )
    );
    setIsUpdateModalOpen(false);
    setNotification({
      message: "Car owner updated successfully! 🎉",
      type: "success",
    });
    setProcessing({ ...processing, update: false });
  };

  let user_is_carowner = carowners.find((owner) => owner.user === user_id);

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

      {/* Response Handler */}
      <ResponseHandler
        resourceName="Car Owner"
        action={
          processing.create ? "create" : 
          processing.update ? "update" : 
          processing.delete ? "delete" : ""
        }
        error={notification.type === "error" ? { message: notification.message } : null}
        success={notification.type === "success" ? { message: notification.message } : null}
        onClear={() => setNotification({ message: "", type: "" })}
      />

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
          ""
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
              className="w-full"
            >
              <div
                onClick={() => setSelectedCarowner(carowner)}
                className="relative flex flex-col items-center bg-white rounded-2xl p-6 shadow-md hover:shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 group h-full"
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
                      e.stopPropagation();
                      setCarownerToUpdate(carowner);
                      setIsUpdateModalOpen(true);
                    }}
                    className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                )}

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
            closeModal={() => !processing.create && setShowCreateModal(false)}
            onCreateSuccess={handleCreateSuccess}
            setNotification={setNotification}
            processing={processing.create}
            setProcessing={(value) => setProcessing({ ...processing, create: value })}
          />
        )}
      </AnimatePresence>

      {/* View Car Owner Modal */}
      <AnimatePresence>
        {selectedCarowner && (
          <CarownerModal
            isOpen={!!selectedCarowner}
            carowner={selectedCarowner}
            closeModal={() => !processing.delete && setSelectedCarowner(null)}
            onDeleteSuccess={handleDeleteSuccess}
            processing={processing.delete}
            setProcessing={(value) => setProcessing({ ...processing, delete: value })}
          />
        )}
      </AnimatePresence>

      {/* Update Car Owner Modal */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <UpdateCarownerModal
            isOpen={isUpdateModalOpen}
            carowner={carownerToUpdate}
            closeModal={() => !processing.update && setIsUpdateModalOpen(false)}
            onUpdateSuccess={handleUpdateSuccess}
            setNotification={setNotification}
            processing={processing.update}
            setProcessing={(value) => setProcessing({ ...processing, update: value })}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Carowners;