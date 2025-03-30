import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { BACKEND_URL } from "../../Constants/constant";
import { countries } from "countries-list";
import { PhotoIcon } from "@heroicons/react/24/solid";

const CreateCompanyModal = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [logo, setLogo] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [country, setCountry] = useState("");
  const [since, setSince] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const authToken = localStorage.getItem("authToken");

  const modalRef = useRef(null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const allCountries = Object.values(countries).map((country) => ({
    name: country.name,
    code: country.code,
  }));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      if (logo) formData.append("logo", logo);
      formData.append("country", country);
      formData.append("since", since);

      await axios.post(`${BACKEND_URL}/store/companies/`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onCreated();
    } catch (error) {
      console.error("Error creating company:", error);
      setLoading(false);

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
    }
  };

  const handleLogoChange = (e) => {
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

    setLogo(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCountrySearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCountry(query);

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

  const handleCountrySelect = (country) => {
    setCountry(country.name);
    setSearchQuery(country.name);
    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredCountries.length > 0) {
      e.preventDefault();
      const firstCountry = filteredCountries[0];
      setCountry(firstCountry.name);
      setSearchQuery(firstCountry.name);
      setShowDropdown(false);
    }
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 4 digits
    if (/^\d{0,4}$/.test(value)) {
      setSince(value);
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
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Create New Company</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {Array.isArray(error) ? error : error}
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

          {/* Company Logo */}
          <div>
            <label className="block text-gray-700 mb-2">Company Logo</label>
            <div className="flex items-center gap-4">
              <div 
                onClick={() => fileInputRef.current.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors overflow-hidden"
              >
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Company logo preview" 
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
                  {logo ? "Change Logo" : "Upload Logo"}
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  JPEG or PNG (max 5MB)
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoChange}
                accept="image/*"
                className="hidden"
                required
              />
            </div>
          </div>

          {/* Country */}
          <div className="relative">
            <label className="block text-gray-700 mb-2">Country</label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleCountrySearch}
              onKeyDown={handleKeyDown}
              onClick={() => setShowDropdown(true)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Search for a country"
            />
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto border border-gray-300 rounded-lg bg-white shadow-lg"
              >
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <div
                      key={country.code}
                      onClick={() => handleCountrySelect(country)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {country.name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">No countries found</div>
                )}
              </div>
            )}
          </div>

          {/* Since */}
          <div>
            <label className="block text-gray-700 mb-2">Since (Year)</label>
            <input
              type="text"
              value={since}
              onChange={handleYearChange}
              required
              maxLength={4}
              pattern="\d{4}"
              inputMode="numeric"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="YYYY"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-4 py-2 ${
                loading ? "bg-gray-200" : "bg-gray-300"
              } text-gray-700 rounded-lg hover:bg-gray-400 transition-all`}
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

export default CreateCompanyModal;