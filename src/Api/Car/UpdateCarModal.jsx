import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { BACKEND_URL } from "../../Constants/constant";
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

const UpdateCarModal = ({ isOpen, closeModal, car, onUpdateSuccess }) => {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [companies, setCompanies] = useState([]);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [searchCompanyQuery, setSearchCompanyQuery] = useState("");
  const [searchColorQuery, setSearchColorQuery] = useState("");
  const [colorSuggestions, setColorSuggestions] = useState([]);
  const [companySuggestions, setCompanySuggestions] = useState([]);

  // Populate form data when car is selected
  useEffect(() => {
    if (car) {
      setFormData({
        title: car.title || "",
        company: car.company || "",
        carmodel: car.carmodel || "",
        color: car.color || "",
        registration_year: car.registration_year || "",
        fuel_type: car.fuel_type || "",
        mileage: car.mileage || "",
        description: car.description || "",
        price: car.price || "",
        ratings: car.ratings || "",
      });

      // Set the search queries for company and color
      if (car.company) {
        const selectedCompany = companies.find((c) => c.id === car.company);
        if (selectedCompany) {
          setSearchCompanyQuery(selectedCompany.title);
        }
      }

      if (car.color) {
        setSearchColorQuery(car.color);
      }
    }
  }, [car, companies]); // Add `companies` to the dependency array

  // Fetch companies on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/store/companies/`);
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError("Failed to fetch companies.");
      }
    };

    fetchCompanies();
  }, []);

  // Handle company search input change
  const handleCompanySearchChange = (e) => {
    const query = e.target.value;
    setSearchCompanyQuery(query);

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
    setCompanySuggestions([]);
  };

  // Handle color search input change
  const handleColorSearchChange = (e) => {
    const query = e.target.value;
    setSearchColorQuery(query);

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
    setColorSuggestions([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const authToken = localStorage.getItem("authToken");

    try {
      const data = new FormData();
      if (file) data.append("image", file);
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

      const response = await axios.put(
        `${BACKEND_URL}/store/cars/${car.id}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (onUpdateSuccess) {
        onUpdateSuccess(response.data);
      }

      setError("Car updated successfully! 🎉");
      setTimeout(() => {
        setError(""); // Clear the success message after 5 seconds
        closeModal(); // Close the modal after 5 seconds
      }, 5000); // 5-second timeout
    } catch (error) {
      console.error("Error updating car:", error);
      setError("Failed to update car. Please try again.");
      setTimeout(() => {
        setError(""); // Clear the error message after 5 seconds
      }, 5000); // 5-second timeout
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
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                Update Car
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* File Upload */}
                <div>
                  <label className="block text-gray-700">Car Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded-md mb-3"
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
                          .reverse()
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
                  {loading ? "Updating..." : "Update Car"}
                </button>
              </form>

              {error && (
                <p
                  className={`text-center mt-4 ${
                    error.startsWith("Car updated") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {error}
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

export default UpdateCarModal;