import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import { BACKEND_URL } from "../../Constants/constant";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

const UpdateCarownerModal = ({ isOpen, closeModal, carowner, onUpdateSuccess, setNotification }) => {
  const [formData, setFormData] = useState({ contact: "" });
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userId, setUserId] = useState("");

  // ✅ Get user id from token on mount
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("❌ Unauthorized! Please log in.");
      return;
    }

    try {
      const decoded = jwtDecode(authToken);
      const userIdFromToken = decoded.user_id || decoded.id || decoded.sub;

      if (userIdFromToken) {
        setUserId(userIdFromToken);
      } else {
        setError("❌ User ID missing in token.");
      }
    } catch (error) {
      console.error("JWT Decode Error:", error);
      setError("❌ Invalid token.");
    }
  }, []);

  // ✅ Pre-fill form data when carowner prop changes
  useEffect(() => {
    if (carowner) {
      setFormData({
        contact: carowner.contact || "",
      });
    }
  }, [carowner]);

  // ✅ Form input handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("❌ User not authenticated.");
      return;
    }

    setLoading(true);
    setError("");

    const authToken = localStorage.getItem("authToken");

    try {
      const data = new FormData();
      data.append("user", userId);
      data.append("contact", formData.contact);

      // If no new profile picture is provided, pass the existing image URL
      if (profilePic  instanceof File) {

        data.append("profile_pic", profilePic);
      } else if (carowner.profile_pic instanceof File || formData.profilePic instanceof File) {
        data.append("profile_pic", carowner.profile_pic);
      }

      const response = await axios.put(`${BACKEND_URL}/store/carowners/${carowner.id}/`, data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset form data
      setFormData({ contact: "" });
      setProfilePic(null);

      // ✅ Show success modal
      setShowSuccessModal(true);

      // Notify parent component
      if (setNotification) {
        setNotification({
          message: "Car owner details updated successfully! 🎉",
          type: "success",
        });

        // Clear the notification after 5 seconds
        setTimeout(() => {
          setNotification({ message: "", type: "" });
        }, 5000); // 5 seconds
      }

      if (onUpdateSuccess) {
        onUpdateSuccess(response.data);
      }
    } catch (error) {
      console.error("❌ Error updating car owner:", error);

      if (error.response) {
        const { data } = error.response;
        if (data && typeof data === "object") {
          const errorMessages = Object.values(data).flat().join(" ");
          setError(errorMessages);
        } else if (typeof data === "string") {
          setError(data);
        } else {
          setError("An error occurred. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Closes the success modal AND the form modal
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    closeModal();
  };

  return (
    <>
      {/* MAIN FORM MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {/* ❌ Close Button */}
              <button
                onClick={() => {
                  setError("");
                  closeModal();
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                Update Car Owner
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Contact</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    placeholder="Enter your contact"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      closeModal();
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2 text-white rounded-lg transition-all ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loading ? "Updating..." : "Update Car Owner"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS POPUP MODAL */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center relative"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
            >
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />

              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Success!
              </h3>

              <p className="text-gray-600 mb-6">
                Car owner details updated successfully.
              </p>

              <button
                onClick={handleSuccessClose}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UpdateCarownerModal;