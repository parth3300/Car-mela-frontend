import React, { useState, useEffect, useRef } from "react";
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
  // Initialize empty form data
  const initialFormData = {
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
  };

  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [searchCompanyQuery, setSearchCompanyQuery] = useState("");
  const [searchColorQuery, setSearchColorQuery] = useState("");
  const [colorSuggestions, setColorSuggestions] = useState([]);
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [highlightedCompanyIndex, setHighlightedCompanyIndex] = useState(-1);
  const [highlightedColorIndex, setHighlightedColorIndex] = useState(-1);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);

  // Refs for the modals and dropdowns
  const modalRef = useRef(null);
  const companyModalRef = useRef(null);
  const companyInputRef = useRef(null);
  const colorInputRef = useRef(null);

  // Reset form when modal opens or car changes
  useEffect(() => {
    if (isOpen && car) {
      const newFormData = {
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
      };
      
      setFormData(newFormData);
      setFile(null);
      setMessage("");
      
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
  }, [isOpen, car, companies]);

  // Fetch companies when modal opens
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

    if (isOpen) {
      fetchCompanies();
    }
  }, [isOpen, showCompanyModal]);

  const companiy_titles = companies.map((company) => company.title.toLowerCase());

  const handleCompanySearchChange = (e) => {
    const query = e.target.value;
    setSearchCompanyQuery(query);
    setHighlightedCompanyIndex(-1);
    setShowCompanyDropdown(true);

    if (query) {
      const filteredCompanies = companies.filter((company) =>
        company.title.toLowerCase().includes(query.toLowerCase())
      );
      setCompanySuggestions(filteredCompanies);
    } else {
      setCompanySuggestions(companies);
    }
  };

  const handleCompanySelect = (company) => {
    if (company?.id) {
      setFormData({ ...formData, company: company.id });
      setSearchCompanyQuery(company.title);
      setCompanySuggestions([]);
      setShowCompanyDropdown(false);
    } else {
      setMessage("❌ Invalid company selected.");
    }
  };

  const handleCompanyKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = searchCompanyQuery.trim().toLowerCase();

      if (highlightedCompanyIndex !== -1 && companySuggestions.length > 0) {
        const selectedSuggestion = companySuggestions[highlightedCompanyIndex];
        handleCompanySelect(selectedSuggestion);
      } else if (companySuggestions.length > 0) {
        const firstSuggestion = companySuggestions[0];
        handleCompanySelect(firstSuggestion);
      } else if (companiy_titles.includes(query)) {
        handleCompanySelect(query);
      } else if (query) {
        setShowCompanyModal(true);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedCompanyIndex((prevIndex) =>
        prevIndex < companySuggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedCompanyIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : 0
      );
    } else if (e.key === "Escape") {
      setShowCompanyDropdown(false);
    }
  };

  const handleColorSearchChange = (e) => {
    const query = e.target.value;
    setSearchColorQuery(query);
    setHighlightedColorIndex(-1);
    setShowColorDropdown(true);

    if (query) {
      const filteredColors = colorNames.filter((color) =>
        color.toLowerCase().includes(query.toLowerCase())
      );
      setColorSuggestions(filteredColors);
    } else {
      setColorSuggestions(colorNames);
    }
  };

  const handleColorKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedColorIndex !== -1 && colorSuggestions.length > 0) {
        const selectedColor = colorSuggestions[highlightedColorIndex];
        handleColorSelect(selectedColor);
      } else if (colorSuggestions.length > 0) {
        const firstSuggestion = colorSuggestions[0];
        handleColorSelect(firstSuggestion);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedColorIndex((prevIndex) =>
        prevIndex < colorSuggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedColorIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : 0
      );
    } else if (e.key === "Escape") {
      setShowColorDropdown(false);
    }
  };

  const handleColorSelect = (color) => {
    setFormData({ ...formData, color });
    setSearchColorQuery(color);
    setColorSuggestions([]);
    setShowColorDropdown(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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

    try {
      const response = await axios.put(
        `${BACKEND_URL}/store/cars/${car.id}/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setMessage("✅ Car updated successfully!");
      if (onUpdateSuccess) {
        onUpdateSuccess(response.data);
      }

      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (error) {
      console.error("❌ Error updating car:", error);

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
    if (newCompany?.id) {
      setCompanies((prev) => [...prev, newCompany]);
      setFormData((prev) => ({ ...prev, company: newCompany.id }));
      setSearchCompanyQuery(newCompany.title);
      setShowCompanyModal(false);
    } else {
      setMessage("❌ Failed to create company.");
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        (!showCompanyModal || !companyModalRef.current?.contains(event.target)) &&
        !companyInputRef.current?.contains(event.target) &&
        !colorInputRef.current?.contains(event.target)
      ) {
        closeModal();
      }
    };

    if (!showCompanyModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal, showCompanyModal]);

  return (
    <>
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
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
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
                Update Car
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="w-full">
                  <label className="block text-gray-700">Car Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded-md mb-3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
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

                    <div ref={companyInputRef}>
                      <label className="block text-gray-700">Company:</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search company..."
                          value={searchCompanyQuery}
                          onChange={handleCompanySearchChange}
                          onKeyDown={handleCompanyKeyDown}
                          onFocus={() => setShowCompanyDropdown(true)}
                          className="w-full p-2 border rounded-md"
                          required
                        />
                        {showCompanyDropdown && companySuggestions.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {companySuggestions.map((company, index) => (
                              <div
                                key={company.id}
                                onClick={() => handleCompanySelect(company)}
                                className={`p-2 hover:bg-gray-100 cursor-pointer ${
                                  index === highlightedCompanyIndex ? "bg-gray-200" : ""
                                }`}
                              >
                                {company.title}
                              </div>
                            ))}
                          </div>
                        )}
                        {searchCompanyQuery && 
                          !companySuggestions.some(c => 
                            c.title.toLowerCase() === searchCompanyQuery.toLowerCase()
                          ) && !companiy_titles.includes(searchCompanyQuery.toLowerCase()) && (
                          <p className="text-sm text-gray-500 mt-1">
                            Company not found. Press <span className="font-semibold">Enter</span> to create company.
                          </p>
                        )}
                      </div>
                    </div>

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

                    <div ref={colorInputRef}>
                      <label className="block text-gray-700">Color:</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search color..."
                          value={searchColorQuery}
                          onChange={handleColorSearchChange}
                          onKeyDown={handleColorKeyDown}
                          onFocus={() => setShowColorDropdown(true)}
                          className="w-full p-2 border rounded-md"
                        />
                        {showColorDropdown && colorSuggestions.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {colorSuggestions.map((color, index) => (
                              <div
                                key={color}
                                onClick={() => handleColorSelect(color)}
                                className={`p-2 hover:bg-gray-100 cursor-pointer ${
                                  index === highlightedColorIndex ? "bg-gray-200" : ""
                                }`}
                              >
                                {color}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
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

                    <div>
                      <label className="block text-gray-700">Mileage:</label>
                      <input
                        type="number"
                        name="mileage"
                        value={formData.mileage}
                        onChange={handleChange}
                        onInput={(e) => {
                          if (e.target.value.length > 2) {
                            e.target.value = e.target.value.slice(0, 2);
                          }
                        }}
                        max="99"
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">Price:</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        onInput={(e) => {
                          if (e.target.value.length > 2) {
                            e.target.value = e.target.value.slice(0, 6);
                          }
                        }}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>

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
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[120px] ${
                    loading ? "bg-blue-700 cursor-wait" : ""
                  }`}
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
                    Updating...
                  </>
                  ) : (
                    "Update"
                  )}
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

      <AnimatePresence>
        {showCompanyModal && (
          <CreateCompanyModal
            isOpen={showCompanyModal}
            onClose={() => setShowCompanyModal(false)}
            onCreated={handleCompanyCreated}
            modalRef={companyModalRef}
            initialTitle={searchCompanyQuery}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default UpdateCarModal;