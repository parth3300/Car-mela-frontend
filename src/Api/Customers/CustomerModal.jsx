import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  XMarkIcon, 
  PhoneIcon, 
  UserIcon, 
  EnvelopeIcon,
  CalendarIcon,
  PhotoIcon
} from "@heroicons/react/24/solid";
import { jwtDecode } from "jwt-decode";
import { BACKEND_URL } from "../../Constants/constant";
import Notification from "../../components/Globle/Notification";

const CustomerModal = ({
  isOpen,
  customer,
  closeModal,
  onDeleteSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });
  const [userId, setUserId] = useState("");
  const authToken = localStorage.getItem("authToken");
  const modalRef = useRef(null);

  // Default profile picture if none is provided
  const defaultProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

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

  const handleDelete = async () => {
    if (!authToken) {
      setNotification({
        message: "Please login to manage customers.",
        type: "info",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.delete(
        `${BACKEND_URL}/store/customers/${customer.id}/`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setNotification({
        message: "Customer successfully removed!",
        type: "success",
      });

      if (onDeleteSuccess) {
        onDeleteSuccess(customer.id);
      }

      closeModal();
    } catch (error) {
      console.error("DELETE failed:", error);
      setNotification({
        message: error.response?.data?.message || 
               "Failed to remove customer. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  if (!isOpen || !customer) return null;
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

          {/* Customer Header */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {customer.profile_pic ? (
                  <img
                    src={customer.profile_pic}
                    alt={customer.name}
                    className="h-24 w-24 rounded-full object-cover border-4 border-blue-100"
                    onError={(e) => {
                      e.target.src = defaultProfilePic;
                    }}
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-100">
                    <PhotoIcon className="h-12 w-12 text-blue-600" />
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {customer.name}
              </h2>
              <p className="text-gray-600">@{customer.name}</p>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4 text-gray-700 mb-6">
            <div className="flex items-start">
              <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-3 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-800">{customer.email}</p>
              </div>
            </div>

            <div className="flex items-start">
              <PhoneIcon className="h-5 w-5 text-gray-500 mr-3 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-gray-800">
                  +{customer.dial_code} {customer.phone_number}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CalendarIcon className="h-5 w-5 text-gray-500 mr-3 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Registered</p>
                <p className="text-gray-800">
                  {new Date(customer.registered_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Delete Button (only show if current user owns this profile) */}
          {userId && userId === customer.user && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowConfirm(true)}
                disabled={loading}
                className={`px-5 py-2 rounded-lg transition-all flex items-center justify-center ${
                  loading
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                } text-white`}
              >
                Delete Account
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
                  Confirm Account Deletion
                </h3>
                <p className="text-gray-600 mb-6">
                  This will permanently delete your customer account and all associated data.
                </p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg text-white flex items-center justify-center min-w-[150px] ${
                      loading
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    } transition-all`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                      </div>
                    ) : (
                      "Confirm Delete"
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

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
    </>
  );
};

export default CustomerModal;