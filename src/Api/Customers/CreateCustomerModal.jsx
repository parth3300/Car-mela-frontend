import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import { BACKEND_URL } from "../../Constants/constant";
import { CheckCircleIcon, ChevronDownIcon, PhotoIcon } from "@heroicons/react/24/solid";

// Reuse the same DIAL_CODES array from CreateCarOwnerModal
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

// Reuse the same DialCodeSelector component
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

const CreateCustomerModal = ({ isOpen, closeModal, onCreateSuccess, setNotification }) => {
  const [formData, setFormData] = useState({
    dial_code: DIAL_CODES[1], // Default to India (+91)
    phone_number: "",
    profile_pic: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userId, setUserId] = useState("");

  const modalRef = useRef(null);
  const successModalRef = useRef(null);
  const fileInputRef = useRef(null);

  // Get user id from token on mount
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      // Allow only numeric input and limit to 10 digits
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      setError("❌ Please select an image file (JPEG, PNG)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("❌ Image size should be less than 5MB");
      return;
    }

    setFormData((prev) => ({ ...prev, profile_pic: file }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("❌ User not authenticated.");
      return;
    }

    // Validate phone number field
    if (formData.phone_number.length !== 10) {
      setError("❌ Phone number must be exactly 10 digits.");
      return;
    }

    setLoading(true);
    setError("");

    const authToken = localStorage.getItem("authToken");

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("user", userId);
      formDataToSend.append("dial_code", formData.dial_code.code);
      formDataToSend.append("phone_number", formData.phone_number);
      if (formData.profile_pic) {
        formDataToSend.append("profile_pic", formData.profile_pic);
      }

      const response = await axios.post(
        `${BACKEND_URL}/store/customers/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Reset form data
      setFormData({ 
        dial_code: DIAL_CODES[1], 
        phone_number: "",
        profile_pic: null
      });
      setPreviewImage(null);

      // Show success modal
      setShowSuccessModal(true);

      // Notify parent component
      if (setNotification) {
        setNotification({
          message: "Congratulations! You are now a customer. 🎉",
          type: "success",
        });

        setTimeout(() => {
          setNotification({ message: "", type: "" });
        }, 5000);
      }

      if (onCreateSuccess) {
        onCreateSuccess(response.data);
      }
    } catch (error) {
      console.error("❌ Error creating customer:", error);

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

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    closeModal();
  };

  // Handle clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        isOpen
      ) {
        closeModal();
      }
      if (
        successModalRef.current &&
        !successModalRef.current.contains(event.target) &&
        showSuccessModal
      ) {
        handleSuccessClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, showSuccessModal, closeModal]);

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


              <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                Register as Customer
              </h2>

              {/* Bonus Message */}
              <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-lg">
                <p className="text-sm">
                  🔔 <strong>Note:</strong> You'll receive important notifications on this number
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Profile Picture Upload */}
                <div>
                  <label className="block text-gray-700 mb-2">Profile Picture (Optional)</label>
                  <div className="flex items-center gap-4">
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors overflow-hidden"
                    >
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="Profile preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <PhotoIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                      >
                        {formData.profile_pic ? "Change Photo" : "Upload Photo"}
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        JPEG or PNG (max 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Combined Dial Code and Phone Number Field */}
                <div>
                  <label className="block text-gray-700 mb-2">Phone Number</label>
                  <div className="flex gap-2 items-center">
                    <DialCodeSelector
                      selectedCode={formData.dial_code}
                      onChange={(selected) =>
                        setFormData((prev) => ({ ...prev, dial_code: selected }))
                      }
                    />

                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                      placeholder="Enter phone number"
                      required
                      maxLength={10}
                    />
                  </div>
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
                    {loading ? "Registering..." : "Register"}
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
              ref={successModalRef}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center relative"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
            >
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />

              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Registration Complete!
              </h3>

              <p className="text-gray-600 mb-6">
                You're now a registered customer.
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

export default CreateCustomerModal;