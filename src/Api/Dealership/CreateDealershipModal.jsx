import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../Constants/constant";
import { motion } from "framer-motion";

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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State to store backend errors
  const [addressSuggestions, setAddressSuggestions] = useState([]); // State for address suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // State to show/hide suggestions

  const authToken = localStorage.getItem("authToken");

  // Ref for the modal container
  const modalRef = useRef(null);

  // Handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close the modal if clicked outside
      }
    };

    // Add event listener when the modal is mounted
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the modal is unmounted
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
      setAddressSuggestions(response.data); // Set the fetched suggestions
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
    fetchAddressSuggestions(value); // Fetch suggestions as the user types
    setShowSuggestions(true); // Show suggestions dropdown
  };

  // Handle address selection from suggestions
  const handleAddressSelect = (address) => {
    setFormData({ ...formData, address: address.display_name });
    setAddressSuggestions([]); // Clear suggestions
    setShowSuggestions(false); // Hide suggestions dropdown
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const data = new FormData();
      data.append("dealership_name", formData.dealership_name);
      data.append("dial_code", formData.dial_code); // Add dial code
      data.append("phone_number", formData.phone_number); // Add phone number
      data.append("address", formData.address);
      data.append("ratings", formData.ratings);

      await axios.post(`${BACKEND_URL}/store/dealerships/`, data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data", // Required for file upload
        },
      });

      onCreated(); // Notify parent to refetch
      onClose(); // Close modal after successful insertion
    } catch (error) {
      console.error("Error creating dealership:", error);

      // Handle backend errors
      if (error.response) {
        const { data } = error.response;
        if (data && typeof data === "object") {
          // If the error is an object (e.g., { "contact": ["A valid integer is required."] })
          const errorMessages = Object.entries(data).map(([field, messages]) => (
            <div key={field}>
              <strong>{field}:</strong> {messages.join(" ")}
            </div>
          ));
          setError(errorMessages);
        } else if (typeof data === "string") {
          // If the error is a string (e.g., "Invalid data")
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
        ref={modalRef} // Attach the ref to the modal container
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
                maxLength={10} // Limit input to 10 digits
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
            <label className="block text-gray-700 mb-2">Ratings (1-5)</label>
            <input
              type="number"
              name="ratings"
              min="1"
              max="5"
              value={formData.ratings}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateDealershipModal;