import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { BACKEND_URL } from "../../Constants/constant";
import { CheckCircleIcon, ChevronDownIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import ResponseHandler from "../../components/Globle/ResponseHandler";

const DIAL_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳🇩" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
];

const DialCodeSelector = ({ selectedCode, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const filteredDialCodes = DIAL_CODES.filter(
    (dial) =>
      dial.country.toLowerCase().includes(search.toLowerCase()) ||
      dial.code.includes(search)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-1/2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg flex items-center justify-between focus:ring-2 focus:ring-blue-400 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-1"> {/* Reduced gap from gap-2 to gap-1 */}
          <span className="text-lg">{selectedCode.flag}</span>
          <span className="font-medium">{selectedCode.code}</span>
        </div>
        <ChevronDownIcon 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden"
        >
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search country or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                autoFocus
              />
              <svg
                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredDialCodes.length > 0 ? (
              filteredDialCodes.map((dial) => (
                <div
                  key={dial.code}
                  onClick={() => {
                    onChange(dial);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`flex items-center gap-3 px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors ${
                    selectedCode.code === dial.code ? 'bg-blue-50' : ''
                  }`}
                >
                  <span className="text-lg">{dial.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {dial.country}
                    </p>
                    <p className="text-xs text-gray-500">{dial.code}</p>
                  </div>
                  {selectedCode.code === dial.code && (
                    <CheckCircleIcon className="h-4 w-4 text-blue-500" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-sm text-gray-500">
                No matching countries found
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const CreateCustomerModal = ({ isOpen, closeModal, onCreateSuccess }) => {
  const [formData, setFormData] = useState({
    dial_code: DIAL_CODES[1], // Default to India (+91)
    phone_number: "",
    profile_pic: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [notification, setNotification] = useState({
    type: null,
    message: null,
    details: null
  });

  const modalRef = useRef(null);
  const successModalRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setNotification({
        type: 'error',
        message: 'Unauthorized',
        details: 'Please log in to continue'
      });
      return;
    }

    try {
      const decoded = jwtDecode(authToken);
      const userIdFromToken = decoded.user_id || decoded.id || decoded.sub;

      if (userIdFromToken) {
        setUserId(userIdFromToken);
      } else {
        setNotification({
          type: 'error',
          message: 'Authentication error',
          details: 'User ID missing in token'
        });
      }
    } catch (error) {
      console.error("JWT Decode Error:", error);
      setNotification({
        type: 'error',
        message: 'Invalid token',
        details: 'Please log in again'
      });
    }
  }, []);

  const clearNotification = () => {
    setNotification({
      type: null,
      message: null,
      details: null
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setNotification({
        type: 'error',
        message: 'Invalid file type',
        details: 'Please select an image file (JPEG, PNG)'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotification({
        type: 'error',
        message: 'File too large',
        details: 'Image size should be less than 5MB'
      });
      return;
    }

    setFormData((prev) => ({ ...prev, profile_pic: file }));
    clearNotification();

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearNotification();

    if (!userId) {
      setNotification({
        type: 'error',
        message: 'Authentication required',
        details: 'Please log in to continue'
      });
      setLoading(false);
      return;
    }

    if (formData.phone_number.length !== 10) {
      setNotification({
        type: 'error',
        message: 'Invalid phone number',
        details: 'Phone number must be exactly 10 digits'
      });
      setLoading(false);
      return;
    }

    try {
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
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setNotification({
        type: 'success',
        message: 'Registration successful!',
        details: 'You are now a registered customer'
      });

      setFormData({ 
        dial_code: DIAL_CODES[1], 
        phone_number: "",
        profile_pic: null
      });
      setPreviewImage(null);

      setShowSuccessModal(true);
      
      if (onCreateSuccess) {
        onCreateSuccess(response.data);
      }

      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      console.error("Error creating customer:", error);
      
      let errorMessage = "Registration failed";
      let errorDetails = "Please try again";
      
      if (error.response) {
        if (error.response.data) {
          errorDetails = typeof error.response.data === 'object' 
            ? Object.entries(error.response.data).map(([field, messages]) => (
                <div key={field}>
                  <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(" ") : messages}
                </div>
              ))
            : error.response.data;
        } else {
          errorDetails = error.response.statusText || "Unknown error occurred";
        }
      } else if (error.message) {
        errorDetails = error.message;
      }

      setNotification({
        type: 'error',
        message: errorMessage,
        details: errorDetails
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    closeModal();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && isOpen) {
        closeModal();
      }
      if (successModalRef.current && !successModalRef.current.contains(event.target) && showSuccessModal) {
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative"
            >
              <button
                onClick={closeModal}
                disabled={loading}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-blue-700">Register as Customer</h2>

              <ResponseHandler
                type={notification.type}
                message={notification.message}
                details={notification.details}
                onClear={clearNotification}
              />

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
                      onClick={() => !loading && fileInputRef.current.click()}
                      className={`w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors overflow-hidden ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                        onClick={() => !loading && fileInputRef.current.click()}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      disabled={loading}
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
                      disabled={loading}
                      className="w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-50"
                      placeholder="Enter phone number"
                      required
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={loading}
                    className={`px-4 py-2 ${
                      loading ? "bg-gray-200" : "bg-gray-300"
                    } text-gray-700 rounded-lg hover:bg-gray-400 transition-all disabled:opacity-50`}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2 ${
                      loading ? "bg-blue-700" : "bg-blue-600"
                    } text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center min-w-[100px] disabled:opacity-50`}
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
                        Registering...
                      </>
                    ) : (
                      "Register"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
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