import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { XMarkIcon, PhotoIcon, ArrowPathIcon, ChevronDownIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { BACKEND_URL } from "../../Constants/constant";
import ResponseHandler from "../../components/Globle/ResponseHandler";

const DIAL_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
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
    <div className="relative w-24">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 h-full border border-gray-300 rounded-l-md flex items-center justify-between focus:ring-2 focus:ring-blue-400 bg-white hover:bg-gray-50 transition-colors"
      >
      <div className="flex items-center gap-2 mr-[10px]">
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
          className="absolute mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden"
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

const UpdateCustomerModal = ({
  isOpen,
  customer,
  closeModal,
  onUpdateSuccess,
}) => {
  const [formData, setFormData] = useState({
    dial_code: "+91",
    phone_number: "",
    profile_pic: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    type: null,
    message: null,
    details: null
  });

  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (customer) {
      setFormData({
        dial_code: customer.dial_code ? `+${customer.dial_code}` : "+91",
        phone_number: customer.phone_number || "",
        profile_pic: null
      });
      
      if (customer.profile_pic) {
        setPreviewImage(`${customer.profile_pic}`);
      }
    }
  }, [customer]);

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

  const clearNotification = () => {
    setNotification({
      type: null,
      message: null,
      details: null
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDialCodeChange = (dialCode) => {
    setFormData(prev => ({
      ...prev,
      dial_code: dialCode.code
    }));
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

    try {
      const authToken = localStorage.getItem("authToken");
      const formDataToSend = new FormData();
      
      const dialCodeWithoutPlus = formData.dial_code.replace('+', '');
      formDataToSend.append("dial_code", dialCodeWithoutPlus);
      formDataToSend.append("phone_number", formData.phone_number);
      
      if (formData.profile_pic) {
        formDataToSend.append("profile_pic", formData.profile_pic);
      }

      const response = await axios.patch(
        `${BACKEND_URL}/store/customers/${customer.id}/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setNotification({
        type: 'success',
        message: 'Customer updated successfully!',
        details: null
      });

      onUpdateSuccess(response.data);
      
      // Don't set loading to false here - let the modal close first
    } catch (error) {
      console.error("Error updating customer:", error);
      
      let errorMessage = "Failed to update customer";
      let errorDetails = null;
      
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
      
      setLoading(false);
    }
  };

  // Handle modal closing after success
  useEffect(() => {
    if (notification.type === 'success') {
      const timer = setTimeout(() => {
        closeModal();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [notification.type, closeModal]);

  // Reset loading state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedDialCode = DIAL_CODES.find(dial => dial.code === formData.dial_code) || DIAL_CODES[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">Update Customer</h3>
          <button
            onClick={closeModal}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 transition disabled:opacity-50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <ResponseHandler
          type={notification.type}
          message={notification.message}
          details={notification.details}
          onClear={clearNotification}
        />

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div 
                onClick={() => !loading && fileInputRef.current.click()}
                className={`w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors overflow-hidden ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
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
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="flex">
              <DialCodeSelector 
                selectedCode={selectedDialCode}
                onChange={handleDialCodeChange}
              />
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Phone number"
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                required
                maxLength={15}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                        Updating...
                      </>
                    ) : (
                      "Update Car Owner"
                    )}
                  </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdateCustomerModal;