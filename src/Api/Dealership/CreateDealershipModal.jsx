import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../Constants/constant";
import { motion } from "framer-motion";
import { PhotoIcon } from "@heroicons/react/24/solid";

// Predefined list of dial codes
const DIAL_CODES = [
  { code: "+1", country: "USA" },
  { code: "+91", country: "India" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "Australia" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
  { code: "+7", country: "Russia" },
  { code: "+52", country: "Mexico" },
];

const CreateDealershipModal = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    dealership_name: "",
    dial_code: "+1", // Default dial code
    phone_number: "", // Phone number field
    address: "",
    ratings: 1,
    image: null, // Image field
  });

  const [previewImage, setPreviewImage] = useState(null); // For image preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State to store backend errors
  const [addressSuggestions, setAddressSuggestions] = useState([]); // State for address suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // State to show/hide suggestions

  const authToken = localStorage.getItem("authToken");
  const fileInputRef = useRef(null); // Ref for file input
  const modalRef = useRef(null); // Ref for the modal container

  // Handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close the modal if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Fetch address suggestions from OpenStreetMap (Nominatim)
  const fetchAddressSuggestions = async (query) => {
    if (!query) {
      setAddressSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`
      );
      setAddressSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setAddressSuggestions([]);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      // Allow only numeric input and limit to 10 digits
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle address input change
  const handleAddressChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, address: value });
    fetchAddressSuggestions(value);
    setShowSuggestions(true);
  };

  // Handle address selection from suggestions
  const handleAddressSelect = (address) => {
    setFormData({ ...formData, address: address.display_name });
    setAddressSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      setError("Please select an image file (JPEG, PNG)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setFormData({ ...formData, image: file });
    setError(null); // Clear any previous errors

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const data = new FormData();
      data.append("dealership_name", formData.dealership_name);
      data.append("dial_code", formData.dial_code);
      data.append("phone_number", formData.phone_number);
      data.append("address", formData.address);
      data.append("ratings", formData.ratings);
      if (formData.image) {
        data.append("image", formData.image);
      }

      await axios.post(`${BACKEND_URL}/store/dealerships/`, data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onCreated();
      onClose();
    } catch (error) {
      console.error("Error creating dealership:", error);

      if (error.response) {
        const { data } = error.response;
        if (data && typeof data === "object") {
          const errorMessages = Object.entries(data).map(([field, messages]) => (
            <div key={field}>
              <strong>{field}:</strong> {messages.join(" ")}
            </div>
          ));
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Create Dealership</h2>

        {/* Display backend errors */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {Array.isArray(error) ? error : error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Dealership Image */}
          <div>
            <label className="block text-gray-700 mb-2">Dealership Image (Optional)</label>
            <div className="flex items-center gap-4">
              <div 
                onClick={() => fileInputRef.current.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors overflow-hidden"
              >
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Dealership preview" 
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
                  {formData.image ? "Change Image" : "Upload Image"}
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  JPEG or PNG (max 5MB)
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Dealership Name */}
          <div>
            <label className="block text-gray-700 mb-2">Dealership Name</label>
            <input
              type="text"
              name="dealership_name"
              value={formData.dealership_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Combined Dial Code and Phone Number Field */}
          <div>
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <div className="flex gap-2">
              {/* Dial Code Dropdown */}
              <select
                name="dial_code"
                value={formData.dial_code}
                onChange={handleChange}
                className="w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              >
                {DIAL_CODES.map((dial) => (
                  <option key={dial.code} value={dial.code}>
                    {`${dial.code} (${dial.country})`}
                  </option>
                ))}
              </select>

              {/* Phone Number Input */}
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter phone number"
                required
                maxLength={10}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 mb-2">Address</label>
            <div className="relative">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleAddressChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Search address..."
              />
              {/* Address Suggestions Dropdown */}
              {showSuggestions && addressSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full max-h-40 overflow-y-auto">
                  {addressSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleAddressSelect(suggestion)}
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Ratings */}
          <div>
                      <label className="block text-gray-700">Ratings:</label>
                      <select
                        name="ratings"
                        value={formData.ratings}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                      >
                        <option value="">Select a rating</option>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <option key={rating} value={rating}>
                            {rating}
                          </option>
                        ))}
                      </select>
                    </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 ${
                loading ? "bg-blue-700" : "bg-blue-600"
              } text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center min-w-[100px]`}
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
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateDealershipModal;