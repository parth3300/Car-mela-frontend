import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { BACKEND_URL } from "../../Constants/constant";
import { countries } from "countries-list"; // Import the countries dataset

const CreateCompanyModal = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [logo, setLogo] = useState(null); // For file upload
  const [country, setCountry] = useState("");
  const [since, setSince] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State to store backend errors
  const [searchQuery, setSearchQuery] = useState(""); // For country search
  const [filteredCountries, setFilteredCountries] = useState([]); // Filtered countries
  const [showDropdown, setShowDropdown] = useState(false); // Show/hide dropdown
  const authToken = localStorage.getItem("authToken");

  // Ref for the modal container
  const modalRef = useRef(null);

  // Convert countries object to an array
  const allCountries = Object.values(countries).map((country) => ({
    name: country.name,
    code: country.code,
  }));

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("title", title);
      formData.append("logo", logo); // Append the file
      formData.append("country", country);
      formData.append("since", since);

      const response = await axios.post(`${BACKEND_URL}/store/companies/`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data", // Required for file upload
        },
      });

      console.log("Company created:", response.data);
      onCreated(); // Notify parent to refetch and close modal
    } catch (error) {
      console.error("Error creating company:", error);

      // Handle backend errors
      if (error.response) {
        // Extract error messages from Django backend
        const { data } = error.response;
        if (data && typeof data === "object") {
          // If the error is an object (e.g., { "title": ["This field is required."] })
          const errorMessages = Object.values(data).flat().join(" ");
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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file); // Set the selected file
    }
  };

  // Handle country search input
  const handleCountrySearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCountry(query); // Update the country state

    if (query) {
      const filtered = allCountries.filter((country) =>
        country.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCountries(filtered);
      setShowDropdown(true);
    } else {
      setFilteredCountries([]);
      setShowDropdown(false);
    }
  };

  // Handle country selection
  const handleCountrySelect = (country) => {
    setCountry(country.name); // Set the selected country
    setSearchQuery(country.name); // Update the search query
    setShowDropdown(false); // Hide the dropdown
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredCountries.length > 0) {
      e.preventDefault(); // Prevent form submission
      const firstCountry = filteredCountries[0];
      setCountry(firstCountry.name); // Set the first country in the list
      setSearchQuery(firstCountry.name); // Update the search query
      setShowDropdown(false); // Hide the dropdown
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
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Create New Company</h2>

        {/* Display backend errors */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Company Title */}
          <div>
            <label className="block text-gray-700 mb-2">Company Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Company Logo (Image Upload) */}
          <div>
            <label className="block text-gray-700 mb-2">Company Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-gray-700 mb-2">Country</label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleCountrySearch}
              onKeyDown={handleKeyDown} // Handle Enter key press
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Search for a country"
            />
            {showDropdown && (
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg">
                {filteredCountries.map((country) => (
                  <div
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {country.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Since */}
          <div>
            <label className="block text-gray-700 mb-2">Since (Year)</label>
            <input
              type="number"
              value={since}
              onChange={(e) => setSince(e.target.value)}
              required
              onInput={(e) => {
                if (e.target.value.length > 2) {
                  e.target.value = e.target.value.slice(0, 4); // trim to 2 digits
                }
              }}
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

export default CreateCompanyModal;