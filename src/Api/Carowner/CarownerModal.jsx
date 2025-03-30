import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BACKEND_URL } from "../../Constants/constant";
import Notification from "../../components/Globle/Notification";
import { jwtDecode } from "jwt-decode";
import { XMarkIcon } from "@heroicons/react/24/solid";

const CarownerModal = ({ isOpen, closeModal, carowner, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });

  const authToken = localStorage.getItem("authToken");
  const [userId, setUserId] = useState("");

  // Get user ID from token
  useEffect(() => {
    if (authToken) {
      try {
        const decoded = jwtDecode(authToken);
        setUserId(decoded?.user_id || "");
      } catch (error) {
        console.error("JWT decode error:", error);
      }
    }
  }, [authToken]);

  // Ref for the modal container
  const modalRef = useRef(null);

  // Handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeModal]);

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

    try {
      const response = await axios.delete(
        `${BACKEND_URL}/store/carowners/${carowner.id}/`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setNotification({
        message: "Car owner successfully removed!",
        type: "success",
      });

      if (onDeleteSuccess) {
        onDeleteSuccess(carowner.id);
      }

      closeModal();
    } catch (error) {
      console.error("DELETE failed:", error);
      setNotification({
        message: error.response?.data?.message || 
               "Failed to remove car owner. Please try again.",
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
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Car Owner Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-800">{carowner.name}</h2>
            <p className="text-gray-500">{carowner.email}</p>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <img
              src={
                carowner.profile_pic ||
                "https://via.placeholder.com/150?text=No+Image"
              }
              alt={carowner.name}
              className="rounded-full object-cover w-32 h-32 border-4 border-blue-100 shadow-md"
            />
          </div>

          {/* Details Section */}
          <div className="space-y-4 text-gray-700 mb-6">
            <div className="flex justify-between">
              <span className="font-semibold">Contact:</span>
              <span>
                {carowner.dial_code && carowner.phone_number
                  ? `+${carowner.dial_code} ${carowner.phone_number}`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Balance:</span>
              <span>₹{carowner.balance?.toLocaleString() || "0"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Cars Owned:</span>
              <span>{carowner.cars_count || 0}</span>
            </div>
          </div>

          {/* Delete Button (only show if current user owns this profile) */}
          {userId && userId === carowner.user && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowConfirm(true)}
                disabled={loading}
                className={`px-5 py-2 rounded-lg transition-all ${
                  loading
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                } text-white`}
              >
                Delete Profile
              </button>
            </div>
          )}

          {/* Confirm Delete Modal */}
          {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Confirm Profile Deletion
                </h3>
                <p className="text-gray-600 mb-6">
                  This will permanently delete your car owner profile and all associated data.
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
                    {loading ? "Deleting..." : "Confirm Delete"}
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

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
    </>
  );
};

export default CarownerModal;