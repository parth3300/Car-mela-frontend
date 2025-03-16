import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BACKEND_URL } from "../../Constants/constant";
import Notification from "../../components/Globle/Notification";

const CarownerModal = ({ isOpen, closeModal, carowner, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });

  const authToken = localStorage.getItem("authToken");


  if (!isOpen || !carowner) return null;

  const handleDelete = async () => {
    if (!authToken) {
      setNotification({
        message: "Please login to manage car owners.",
        type: "info",
      });
      return;
    }

    setLoading(true);
    console.log("Starting DELETE request for car owner...");

    try {
      const url = `${BACKEND_URL}/store/carowners/${carowner.id}/`;
      console.log("DELETE URL:", url);

      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log("DELETE successful:", response.status);

      setNotification({
        message: "Car owner successfully removed!",
        type: "success",
      });

      if (onDeleteSuccess) {
        onDeleteSuccess(carowner.id);
      }

      closeModal();
    } catch (error) {
      console.error("DELETE failed:", error.response || error);
      setNotification({
        message: "Failed to remove car owner. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <motion.div
          className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg relative overflow-y-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ maxHeight: "80vh" }}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            disabled={loading}
          >
            &times;
          </button>

          {/* Car Owner Name */}
          <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
            {carowner.name}
          </h2>

          {/* Car Owner Profile Pic */}
          <div className="flex justify-center mb-6">
            <img
              src={
                carowner.profile_pic ||
                "https://via.placeholder.com/150?text=No+Image"
              }
              alt={carowner.name}
              className="rounded-full object-cover w-32 h-32 border-4 border-blue-500 shadow-md"
            />
          </div>

          {/* Car Owner Details */}
          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between">
              <span className="font-semibold">Email:</span>
              <span>{carowner.email || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Contact:</span>
              <span>{carowner.contact || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Total Cars:</span>
              <span>{carowner.cars_count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Cars:</span>
              <div className="flex flex-col items-end"> {/* Align items to the right */}
              {carowner.cars.length > 0 ? (

                  carowner.cars.map((car) => (
                    <span key={car.id} className="text-gray-600">
                    {car}
                  </span>
                  ))

                ) : (
                  <span className="text-gray-600">No cars found</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            {authToken ? (
              <button
                onClick={() => setShowConfirm(true)}
                disabled={loading}
                className={`px-5 py-2 rounded-lg transition-all ${
                  loading
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                } text-white`}
              >
                Delete
              </button>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Login to manage this car owner
              </p>
            )}
          </div>

          {/* Confirm Delete Modal */}
          {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Confirm Removal
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to remove{" "}
                  <span className="font-bold text-red-500">{carowner.name}</span>
                  ?
                </p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg text-white ${
                      loading
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    } transition-all`}
                  >
                    {loading ? "Processing..." : "Yes, Delete"}
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Global Notification */}
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "" })}
        />
      )}
    </>
  );
};

export default CarownerModal;