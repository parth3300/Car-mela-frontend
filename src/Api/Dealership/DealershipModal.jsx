import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BACKEND_URL } from "../../Constants/constant";
import Notification from "../../components/Globle/Notification";
import { PhotoIcon } from "@heroicons/react/24/solid";

const DealershipModal = ({
  isOpen,
  closeModal,
  dealership,
  onDeleteSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });

  const authToken = localStorage.getItem("authToken");

  // Ref for the modal container
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  if (!isOpen || !dealership) return null;

  const handleDelete = async () => {
    if (!authToken) {
      setNotification({
        message: "Please login to manage dealerships.",
        type: "info",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/store/dealerships/${dealership.id}/`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setNotification({
        message: "Dealership successfully removed!",
        type: "success",
      });

      if (onDeleteSuccess) {
        onDeleteSuccess(dealership.id);
      }

      closeModal();
    } catch (error) {
      setNotification({
        message: "Failed to remove dealership. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  // Function to handle image error
  const handleImageError = (e) => {
    e.target.style.display = 'none'; // Hide the broken image
  };

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <motion.div
          ref={modalRef}
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

          {/* Dealership Name */}
          <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
            {dealership.dealership_name}
          </h2>

          {/* Dealership Image */}
          <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {dealership.image ? (
              <>
                <img
                  src={dealership.image}
                  alt={dealership.dealership_name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
                {/* Fallback if image fails to load */}
                {!dealership.image && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PhotoIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <PhotoIcon className="h-16 w-16 text-gray-400" />
                <span className="sr-only">No image available</span>
              </div>
            )}
          </div>

          {/* Dealership Details */}
          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between">
              <span className="font-semibold">Contact:</span>
              <span>
                {dealership.dial_code && dealership.phone_number
                  ? `+${dealership.dial_code} ${dealership.phone_number}`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Address:</span>
              <span className="text-right">{dealership.address || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Ratings:</span>
              <span>{dealership.ratings || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Featured Cars:</span>
              <span>{dealership.featured_cars?.length || 0}</span>
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
                Login to manage this dealership
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
                  <span className="font-bold text-red-500">
                    {dealership.dealership_name}
                  </span>
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
                    } transition-all flex items-center justify-center min-w-[120px]`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      "Yes, Delete"
                    )}
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

export default DealershipModal;