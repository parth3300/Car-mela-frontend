import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { BACKEND_URL } from "../../Constants/constant";

const UpdateCustomerModal = ({
  isOpen,
  customer,
  closeModal,
  onUpdateSuccess,
  setNotification,
}) => {
  const [formData, setFormData] = useState({
    dial_code: 91,
    phone_number: "",
    profile_pic: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (customer) {
      setFormData({
        dial_code: customer.dial_code || 91,
        phone_number: customer.phone_number || "",
        profile_pic: null
      });
      
      // Set preview image if customer already has a profile picture
      if (customer.profile_pic) {
        setPreviewImage(`${customer.profile_pic}`);
      }
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const authToken = localStorage.getItem("authToken");
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("dial_code", formData.dial_code);
      formDataToSend.append("phone_number", formData.phone_number);
      
      // Only append profile_pic if a new one was selected
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

      onUpdateSuccess(response.data);
      setNotification({
        message: "Customer updated successfully!",
        type: "success",
      });
      closeModal();
    } catch (error) {
      console.error("Error updating customer:", error);
      
      let errorMessage = "Failed to update customer. Please try again.";
      if (error.response) {
        if (error.response.data) {
          if (typeof error.response.data === "object") {
            errorMessage = Object.values(error.response.data).flat().join(" ");
          } else {
            errorMessage = error.response.data;
          }
        }
      }
      
      setError(errorMessage);
      setNotification({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={closeModal} // Close modal when clicking outside
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">Update Customer</h3>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Profile Picture Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
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
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
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

          {/* Phone Number */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="flex">
              <select
                name="dial_code"
                value={formData.dial_code}
                onChange={handleChange}
                className="w-24 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="91">+91 (IN)</option>
                <option value="1">+1 (US)</option>
                <option value="44">+44 (UK)</option>
                <option value="81">+81 (JP)</option>
              </select>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Phone number"
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
                maxLength={10} // Limit input to 10 digits

              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Customer"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdateCustomerModal;