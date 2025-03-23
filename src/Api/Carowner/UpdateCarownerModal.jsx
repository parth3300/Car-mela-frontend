import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import { BACKEND_URL } from "../../Constants/constant";
import { XMarkIcon, CheckCircleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

// Updated DIAL_CODES array with flag emojis
const DIAL_CODES = [
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
];

// DialCodeSelector Component
const DialCodeSelector = ({ selectedCode, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredDialCodes = DIAL_CODES.filter(
    (dial) =>
      dial.country.toLowerCase().includes(search.toLowerCase()) ||
      dial.code.includes(search)
  );

  return (
    <div className="relative w-1/3">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between focus:ring-2 focus:ring-blue-400 bg-white"
      >
        <span>
          {selectedCode.flag} {selectedCode.code}
        </span>
        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
        >
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border-b border-gray-200 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <ul className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
            {filteredDialCodes.length > 0 ? (
              filteredDialCodes.map((dial) => (
                <li
                  key={dial.code}
                  onClick={() => {
                    onChange(dial);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 cursor-pointer"
                >
                  <span className="text-lg">{dial.flag}</span>
                  <span>{dial.country}</span>
                  <span className="ml-auto text-gray-500">{dial.code}</span>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-400">No matches found</li>
            )}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

const UpdateCarOwnerModal = ({ isOpen, closeModal, carowner, onUpdateSuccess, setNotification }) => {
  const [formData, setFormData] = useState({
    dial_code: DIAL_CODES[0], // Default dial code object
    phone_number: "",
    balance: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userId, setUserId] = useState("");

  const modalRef = useRef(null);

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
      const defaultDialCode = DIAL_CODES.find((dial) => dial.code === carowner.dial_code) || DIAL_CODES[0];
      setFormData({
        dial_code: defaultDialCode,
        phone_number: carowner.phone_number || "",
        balance: 0,
      });
    }
  }, [carowner]);

  // ✅ Form input handlers
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      // Allow only numeric input and limit to 10 digits
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name === "balance") {
      // Allow only numeric input and limit to 8 digits
      const numericValue = value.replace(/\D/g, "").slice(0, 8);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

    // Validate phone number field to ensure it has exactly 10 digits
    if (String(formData.phone_number).length !== 10) {
      setError("❌ Phone number must be exactly 10 digits.");
      return;
    }

    // Validate balance field to ensure it has at most 8 digits
    if (String(formData.balance).length > 8) {
      setError("❌ Balance must be at most 8 digits.");
      return;
    }

    setLoading(true);
    setError("");

    const authToken = localStorage.getItem("authToken");

    try {
      const data = new FormData();
      data.append("user", userId);
      data.append("dial_code", formData.dial_code.code); // Use the dial code value
      data.append("phone_number", formData.phone_number);
      data.append("balance", Number(carowner.balance) + Number(formData.balance));

      // If no new profile picture is provided, pass the existing image URL
      if (profilePic instanceof File) {
        data.append("profile_pic", profilePic);
      }

      const response = await axios.put(`${BACKEND_URL}/store/carowners/${carowner.id}/`, data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset form data
      setFormData({ dial_code: DIAL_CODES[0], phone_number: "", balance: "" });
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

  // Handle clicking outside the modal
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
              ref={modalRef}
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                Update Car Owner
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Combined Dial Code and Phone Number Field */}
                <div>
                  <label className="block text-gray-700 mb-2">Phone Number</label>
                  <div className="flex gap-2">
                    {/* Dial Code Dropdown */}
                    <DialCodeSelector
                      selectedCode={formData.dial_code}
                      onChange={(selected) =>
                        setFormData((prev) => ({ ...prev, dial_code: selected }))
                      }
                    />

                    {/* Phone Number Input */}
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                      placeholder="Enter phone number"
                      required
                      maxLength={10} // Limit input to 10 digits
                    />
                  </div>
                </div>

                {/* Balance Field */}
                <div>
                  <label className="block text-gray-700 mb-2">Add Balance</label>
                  <input
                    type="number"
                    name="balance"
                    value={formData.balance}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    placeholder="Enter your balance"
                    required
                    maxLength={8} // Optional: Adds client-side validation for max length
                  />
                </div>

                {/* Profile Picture Field */}
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
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-2 rounded-md text-white transition ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loading ? "Updating..." : "Update Carowner"}
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

export default UpdateCarOwnerModal;