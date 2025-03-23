import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { BACKEND_URL } from "../../Constants/constant";
import { countries } from "countries-list"; // Import the countries dataset

const UpdateCompanyModal = ({ isOpen, onClose, company, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    logo: null, // For file upload
    country: "",
    since: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // For country search
  const [filteredCountries, setFilteredCountries] = useState([]); // Filtered countries
  const [showDropdown, setShowDropdown] = useState(false); // Show/hide dropdown

  const modalRef = useRef(null);

  // Convert countries object to an array
  const allCountries = Object.values(countries).map((country) => ({
    name: country.name,
    code: country.code,
  }));

  // Populate form data when company is selected
  useEffect(() => {
    if (company) {
      setFormData({
        title: company.title || "",
        logo: company.logo || null,
        country: company.country || "",
        since: company.since || "",
      });
      setSearchQuery(company.country || ""); // Pre-fill the country search input
    }
  }, [company]);

  // Handle country search input
  const handleCountrySearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFormData((prev) => ({ ...prev, country: query }));

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
    setFormData((prev) => ({ ...prev, country: country.name }));
    setSearchQuery(country.name);
    setShowDropdown(false);
  };

  // Handle keydown event for country search input
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredCountries.length > 0) {
      e.preventDefault(); // Prevent form submission
      handleCountrySelect(filteredCountries[0]); // Select the first country in the filtered list
    }
  };

  // Handle clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setMessage("❌ Unauthorized! Please log in.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      if (formData.logo instanceof File) {
        // Append the logo only if it's a new file
        data.append("logo", formData.logo);
      }
      data.append("country", formData.country);
      data.append("since", formData.since);

      const response = await axios.put(
        `${BACKEND_URL}/store/companies/${company.id}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data", // Required for file upload
          },
        }
      );

      setMessage("✅ Company updated successfully!");
      onUpdateSuccess(response.data); // Notify parent component of successful update

      setTimeout(() => {
        setMessage(""); // Clear the success message
        onClose(); // Close the modal
      }, 2000);
    } catch (error) {
      console.error("❌ Error updating company:", error);
      setMessage("❌ Failed to update company. Please try again.");
      setTimeout(() => {
        setMessage(""); // Clear the error message after 5 seconds
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
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
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
              Update Company
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Company Title */}
              <div>
                <label className="block text-gray-700 mb-2">Company Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              {/* Country Search with Suggestions */}
              <div>
                <label className="block text-gray-700 mb-2">Country</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={searchQuery}
                    onChange={handleCountrySearch}
                    onKeyDown={handleKeyDown} // Add keydown event handler
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  {/* Show country suggestions */}
                  {showDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {filteredCountries.map((country) => (
                        <div
                          key={country.code}
                          onClick={() => handleCountrySelect(country)}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {country.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Since */}
              <div>
                <label className="block text-gray-700 mb-2">Since (Year)</label>
                <input
                  type="number"
                  name="since"
                  value={formData.since}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

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
                {loading ? "Updating..." : "Update Company"}
              </button>
            </form>

            {message && (
              <p
                className={`text-center mt-4 ${
                  message.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateCompanyModal;