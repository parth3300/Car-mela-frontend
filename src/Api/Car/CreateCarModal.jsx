import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../Constants/constant";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";
import CreateCompanyModal from "../Company/CreateCompanyModal";

// Predefined list of color names
const colorNames = [
  "Red", "Blue", "Green", "Yellow", "Black", "White", "Silver", "Gray", "Orange", "Purple",
  "Pink", "Brown", "Gold", "Beige", "Teal", "Navy", "Maroon", "Cyan", "Magenta", "Lime"
];

// Fuel type choices
const FUEL_CHOICES = [
  { value: "Petrol", label: "Petrol" },
  { value: "Diesel", label: "Diesel" },
  { value: "Electric", label: "Electric" },
  { value: "CNG", label: "CNG" }
];

const CreateCarModal = ({ isOpen, closeModal, onCreateSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    carmodel: "",
    color: "",
    registration_year: "",
    fuel_type: "",
    mileage: "",
    description: "",
    price: "",
    ratings: "",
  });

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [searchCompanyQuery, setSearchCompanyQuery] = useState(""); // For company search
  const [searchColorQuery, setSearchColorQuery] = useState(""); // For color search
  const [colorSuggestions, setColorSuggestions] = useState([]); // For color suggestions
  const [companySuggestions, setCompanySuggestions] = useState([]); // For company suggestions

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/store/companies/`);
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setMessage("❌ Failed to fetch companies.");
      }
    };

    fetchCompanies();
  }, []);

  // Handle company search input change
  const handleCompanySearchChange = (e) => {
    const query = e.target.value;
    setSearchCompanyQuery(query);

    // Filter companies based on the search query
    if (query) {
      const filteredCompanies = companies.filter((company) =>
        company.title.toLowerCase().includes(query.toLowerCase())
      );
      setCompanySuggestions(filteredCompanies);
    } else {
      setCompanySuggestions([]);
    }
  };

  // Handle company selection from suggestions
  const handleCompanySelect = (company) => {
    setFormData({ ...formData, company: company.id });
    setSearchCompanyQuery(company.title);
    setCompanySuggestions([]); // Clear suggestions after selection
  };

  // Handle color search input change
  const handleColorSearchChange = (e) => {
    const query = e.target.value;
    setSearchColorQuery(query);

    // Filter color names based on the search query
    if (query) {
      const filteredColors = colorNames.filter((color) =>
        color.toLowerCase().includes(query.toLowerCase())
      );
      setColorSuggestions(filteredColors);
    } else {
      setColorSuggestions([]);
    }
  };

  // Handle color selection from suggestions
  const handleColorSelect = (color) => {
    setFormData({ ...formData, color });
    setSearchColorQuery(color);
    setColorSuggestions([]); // Clear suggestions after selection
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("❌ Please select a car image.");
      return;
    }

    if (!formData.company) {
      setMessage("❌ Please select a company.");
      return;
    }

    setLoading(true);
    setMessage("");

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setMessage("❌ Unauthorized! Please log in.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("image", file);
    data.append("title", formData.title);
    data.append("company", formData.company);
    data.append("carmodel", formData.carmodel);
    data.append("color", formData.color);
    data.append("registration_year", formData.registration_year);
    data.append("fuel_type", formData.fuel_type);
    data.append("mileage", formData.mileage);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("ratings", formData.ratings);

    try {
      const response = await axios.post(`${BACKEND_URL}/store/cars/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });

      setMessage("✅ Car created successfully!");

      setFormData({
        title: "",
        company: "",
        carmodel: "",
        color: "",
        registration_year: "",
        fuel_type: "",
        mileage: "",
        description: "",
        price: "",
        ratings: "",
      });
      setFile(null);

      if (onCreateSuccess) {
        onCreateSuccess(response.data);
      }

      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (error) {
      console.error("❌ Error creating car:", error);

      let errorMessage = "An error occurred. Please try again.";
      if (error.response) {
        const { data } = error.response;
        if (data && typeof data === "object") {
          errorMessage = Object.values(data).flat().join(" ");
        } else if (typeof data === "string") {
          errorMessage = data;
        }
      } else {
        errorMessage = "Network error. Please check your connection.";
      }

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyCreated = (newCompany) => {
    setCompanies((prev) => [...prev, newCompany]);
    setFormData((prev) => ({ ...prev, company: newCompany.id }));
    setShowCompanyModal(false);
  };

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
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {/* ❌ Close Button */}
              <button
                onClick={() => {
                  setMessage("");
                  closeModal();
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                Create New Car
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* File Upload */}
                <div className="w-full">
                  <label className="block text-gray-700">Car Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded-md mb-3"
                    required
                  />
                </div>

                {/* Two-Column Grid for Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-gray-700">Title:</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>

                    {/* Company Search with Suggestions */}
                    <div>
                      <label className="block text-gray-700">Company:</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search company..."
                          value={searchCompanyQuery}
                          onChange={handleCompanySearchChange}
                          className="w-full p-2 border rounded-md"
                        />
                        {/* Show company suggestions */}
                        {companySuggestions.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                            {companySuggestions.map((company) => (
                              <div
                                key={company.id}
                                onClick={() => handleCompanySelect(company)}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {company.title}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowCompanyModal(true)}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        + Add Company
                      </button>
                    </div>

                    {/* Car Model */}
                    <div>
                      <label className="block text-gray-700">Car Model:</label>
                      <input
                        type="text"
                        name="carmodel"
                        value={formData.carmodel}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>

                    {/* Color Search with Suggestions */}
                    <div>
                      <label className="block text-gray-700">Color:</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search color..."
                          value={searchColorQuery}
                          onChange={handleColorSearchChange}
                          className="w-full p-2 border rounded-md"
                        />
                        {/* Show color suggestions */}
                        {colorSuggestions.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                            {colorSuggestions.map((color) => (
                              <div
                                key={color}
                                onClick={() => handleColorSelect(color)}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {color}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Registration Year Dropdown */}
                    <div>
                      <label className="block text-gray-700">Registration Year:</label>
                      <select
                        name="registration_year"
                        value={formData.registration_year}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                      >
                        <option value="">Select a year</option>
                        {Array.from({ length: 26 }, (_, i) => 2000 + i)
                          .reverse() // Reverse the array to show 2025 first
                          .map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Fuel Type Dropdown */}
                    <div>
                      <label className="block text-gray-700">Fuel Type:</label>
                      <select
                        name="fuel_type"
                        value={formData.fuel_type}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                      >
                        <option value="">Select a fuel type</option>
                        {FUEL_CHOICES.map((fuel) => (
                          <option key={fuel.value} value={fuel.value}>
                            {fuel.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Mileage */}
                    <div>
                      <label className="block text-gray-700">Mileage:</label>
                      <input
                        type="number"
                        name="mileage"
                        value={formData.mileage}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-gray-700">Price:</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>

                    {/* Ratings Dropdown */}
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
                  </div>
                </div>

                {/* Description (Full Width) */}
                <div>
                  <label className="block text-gray-700">Description:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
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
                  {loading ? "Uploading..." : "Upload Car"}
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

      {/* COMPANY CREATION MODAL */}
      {showCompanyModal && (
        <CreateCompanyModal
          isOpen={showCompanyModal}
          onClose={() => setShowCompanyModal(false)}
          onCreated={handleCompanyCreated}
        />
      )}
    </>
  );
};

export default CreateCarModal;