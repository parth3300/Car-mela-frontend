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
  const [searchCompanyQuery, setSearchCompanyQuery] = useState("");
  const [searchColorQuery, setSearchColorQuery] = useState("");
  const [colorSuggestions, setColorSuggestions] = useState([]);
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [highlightedCompanyIndex, setHighlightedCompanyIndex] = useState(-1);
  const [highlightedColorIndex, setHighlightedColorIndex] = useState(-1);

  // Refs for the modals
  const modalRef = useRef(null);
  const companyModalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        (!showCompanyModal || !companyModalRef.current?.contains(event.target))
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

  // Fetch companies on mount
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
  }, [car, companies]);
  const companiy_titles = companies.map((company) => company.title.toLowerCase())
  // Handle company search input change
  const handleCompanySearchChange = (e) => {
    const query = e.target.value;
    setSearchCompanyQuery(query);
    setHighlightedCompanyIndex(-1);

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
    if (company?.id) {
      setFormData({ ...formData, company: company.id });
      setSearchCompanyQuery(company.title);
      
      setCompanySuggestions([]);
    }
  };


  // Handle company keydown events (arrow navigation)
  const handleCompanyKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = searchCompanyQuery.trim().toLowerCase();
      
      // If there are suggestions, select the first one
      if (companySuggestions.length > 0) {
        const firstSuggestion = companySuggestions[0];
        handleCompanySelect(firstSuggestion);
      } else if (companiy_titles.includes(query)){
        console.log(query);        
        handleCompanySelect(query);
      } else if (query) {
        // If no suggestions and the query is not empty, open the CreateCompanyModal
        setShowCompanyModal(true);
      } else {
        // If the input is empty, show all companies
        setCompanySuggestions(companies);
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
    }
  };

  // Handle color search input change
  const handleColorSearchChange = (e) => {
    const query = e.target.value;
    setSearchColorQuery(query);
    setHighlightedColorIndex(-1);

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

  // Handle color keydown events (arrow navigation)
  const handleColorKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (colorSuggestions.length > 0) {
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
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
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
      setMessage("❌ Failed to update car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle company creation
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
              style={{ maxHeight: "90vh", overflowY: "auto" }} // Add scrollbar

            >
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

                    <div>
                      <label className="block text-gray-700">Company:</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search company..."
                          value={searchCompanyQuery}
                          onChange={handleCompanySearchChange}
                          onKeyDown={handleCompanyKeyDown}
                          className="w-full p-2 border rounded-md"
                          required
                        />
                        {companySuggestions.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
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
                        {(!companiy_titles.includes(searchCompanyQuery.toLowerCase()) || !searchCompanyQuery) && (
                          <p className="text-sm text-gray-500 mt-1">
                            Company is not available. Press <span className="font-semibold">Enter</span> to create company.
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

                    <div>
                      <label className="block text-gray-700">Color:</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search color..."
                          value={searchColorQuery}
                          onChange={handleColorSearchChange}
                          onKeyDown={handleColorKeyDown}
                          className="w-full p-2 border rounded-md"
                        />
                        {colorSuggestions.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
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
                            e.target.value = e.target.value.slice(0, 2); // trim to 2 digits
                          }
                        }}
                        max="99" // Optional but reinforces the limit
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
                  className={`w-full p-2 rounded-md text-white transition ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Updating..." : "Update Car"}
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
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default UpdateCarModal;