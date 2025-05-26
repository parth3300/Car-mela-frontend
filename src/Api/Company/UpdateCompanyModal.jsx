import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { BACKEND_URL } from "../../Constants/constant";
import { countries } from "countries-list";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import ResponseHandler from "../../components/Globle/ResponseHandler";

const UpdateCompanyModal = ({ isOpen, onClose, company, onUpdateSuccess }) => {
  const [title, setTitle] = useState("");
  const [logo, setLogo] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [country, setCountry] = useState("");
  const [since, setSince] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notification, setNotification] = useState({
    type: null,
    message: null,
    details: null
  });

  const modalRef = useRef(null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const authToken = localStorage.getItem("authToken");

  const allCountries = Object.values(countries).map((country) => ({
    name: country.name,
    code: country.code,
  }));

  useEffect(() => {
    if (company) {
      setTitle(company.title || "");
      setCountry(company.country ? company.country.slice(0, 30) : "");
      setSearchQuery(company.country ? company.country.slice(0, 30) : "");
      setSince(company.since || "");
      
      if (company.logo) {
        setPreviewImage(company.logo);
      }
    }
  }, [company]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const clearNotification = () => {
    setNotification({
      type: null,
      message: null,
      details: null
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setNotification({
        type: 'error',
        message: 'Invalid file type',
        details: 'Please select an image file (JPEG, PNG)'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotification({
        type: 'error',
        message: 'File too large',
        details: 'Image size should be less than 5MB'
      });
      return;
    }

    setLogo(file);
    clearNotification();

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCountrySearch = (e) => {
    const query = e.target.value;
    const limitedQuery = query.slice(0, 30);
    setSearchQuery(limitedQuery);
    setCountry(limitedQuery);

    if (limitedQuery) {
      const filtered = allCountries.filter((country) =>
        country.name.toLowerCase().includes(limitedQuery.toLowerCase())
      );
      setFilteredCountries(filtered);
      setShowDropdown(true);
    } else {
      setFilteredCountries([]);
      setShowDropdown(false);
    }
  };

  const handleCountrySelect = (country) => {
    const limitedCountryName = country.name.slice(0, 30);
    setCountry(limitedCountryName);
    setSearchQuery(limitedCountryName);
    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredCountries.length > 0) {
      e.preventDefault();
      const firstCountry = filteredCountries[0];
      handleCountrySelect(firstCountry);
    }
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setSince(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearNotification();
// const cars = [
//     {
//         "title": "Fortuner",
//         "carmodel": "Legender 4x4 AT",
//         "color": "White",
//         "registration_year": "2023",
//         "fuel_type": "Diesel",
//         "mileage": 15000,
//         "description": "Premium SUV with 2.8L engine, 4WD, and advanced safety features",
//         "price": 5200000,
//         "ratings": "4",
//         "company": 2  
//     },
//     {
//         "title": "Virtus",
//         "carmodel": "GT Plus 1.5 TSI",
//         "color": "Grey",
//         "registration_year": "2022",
//         "fuel_type": "Petrol",
//         "mileage": 18000,
//         "description": "Sporty sedan with sunroof and premium interiors",
//         "price": 1850000,
//         "ratings": "4",
//         "company": 4  
//     },
//     {
//         "title": "Nexon",
//         "carmodel": "EV Max XZ+ Lux",
//         "color": "Blue",
//         "registration_year": "2023",
//         "fuel_type": "Electric",
//         "mileage": 5000,
//         "description": "Electric SUV with 437km range and premium features",
//         "price": 1950000,
//         "ratings": "5",
//         "company": 7  
//     },
//     {
//         "title": "Camaro",
//         "carmodel": "SS 6.2L V8",
//         "color": "Yellow",
//         "registration_year": "2021",
//         "fuel_type": "Petrol",
//         "mileage": 12000,
//         "description": "American muscle car with 455 HP engine",
//         "price": 8500000,
//         "ratings": "5",
//         "company": 10  
//     },
//     {
//         "title": "XC90",
//         "carmodel": "Recharge T8 Inscription",
//         "color": "Black",
//         "registration_year": "2022",
//         "fuel_type": "Electric",
//         "mileage": 10000,
//         "description": "Luxury plug-in hybrid SUV with premium sound system",
//         "price": 12500000,
//         "ratings": "5",
//         "company": 9  
//     },
//     {
//         "title": "Kwid",
//         "carmodel": "Climber AMT",
//         "color": "Red",
//         "registration_year": "2023",
//         "fuel_type": "Petrol",
//         "mileage": 8000,
//         "description": "Compact SUV-style hatchback with rugged looks",
//         "price": 650000,
//         "ratings": "3",
//         "company": 8  
//     },
//     {
//         "title": "Ioniq 5",
//         "carmodel": "Premium RWD",
//         "color": "Teal",
//         "registration_year": "2023",
//         "fuel_type": "Electric",
//         "mileage": 3000,
//         "description": "Futuristic electric crossover with ultra-fast charging",
//         "price": 4800000,
//         "ratings": "4",
//         "company": 5  
//     },
//     {
//         "title": "Roma",
//         "carmodel": "Spider 3.9L V8",
//         "color": "Red",
//         "registration_year": "2022",
//         "fuel_type": "Petrol",
//         "mileage": 5000,
//         "description": "Elegant grand tourer with 620 HP turbo engine",
//         "price": 45000000,
//         "ratings": "5",
//         "company": 6  
//     },
//     {
//         "title": "Seltos",
//         "carmodel": "HTX 1.5 Diesel",
//         "color": "Blue",
//         "registration_year": "2023",
//         "fuel_type": "Diesel",
//         "mileage": 12000,
//         "description": "Feature-packed compact SUV with connected car tech",
//         "price": 1650000,
//         "ratings": "4",
//         "company": 11  
//     },
//     {
//         "title": "Mustang",
//         "carmodel": "GT 5.0L V8",
//         "color": "Blue",
//         "registration_year": "2021",
//         "fuel_type": "Petrol",
//         "mileage": 15000,
//         "description": "Iconic American muscle car with 450 HP",
//         "price": 8500000,
//         "ratings": "5",
//         "company": 3  
//     }
// ]

// for (const company of cars) {
//   const formData = new FormData();
//   formData.append("title", company.title);
//   formData.append("carmodel", company.carmodel);
//   formData.append("color", company.color);
//   formData.append("registration_year", company.registration_year);
//   formData.append("fuel_type", company.fuel_type);
//   formData.append("mileage", company.mileage);
//   formData.append("description", company.description);
//   formData.append("price", company.price);
//   formData.append("ratings", company.ratings);
//   formData.append("company", company.company);

//   try {
//     const res = await axios.post(`${BACKEND_URL}/store/cars/`, formData, {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     console.log(`Inserted ${company.title}`, res.data);
//   } catch (error) {
//     console.error(`Error inserting ${company.title}`, error.response?.data || error);
//   }
// }
const dealerships = [
  {
    dealership_name: "AutoDrive Mumbai",
    dial_code: 91,
    phone_number: 9876543210,
    address: "123 Linking Road, Mumbai, Maharashtra",
    ratings: "5",
    image: null,  // Add Cloudinary image URL if needed
  },
  {
    dealership_name: "Speed Motors Delhi",
    dial_code: 91,
    phone_number: 9898989898,
    address: "Karol Bagh, New Delhi",
    ratings: "4",
    image: null,
  },
  {
    dealership_name: "USA AutoHub",
    dial_code: 1,
    phone_number: 2025550191,
    address: "101 Main Street, Dallas, TX",
    ratings: "5",
    image: null,
  },
  {
    dealership_name: "Berlin Autohaus",
    dial_code: 49,
    phone_number: 3055551010,
    address: "Unter den Linden, Berlin, Germany",
    ratings: "4",
    image: null,
  },
  {
    dealership_name: "Tokyo Car Center",
    dial_code: 81,
    phone_number: 8012345678,
    address: "Shinjuku, Tokyo, Japan",
    ratings: "5",
    image: null,
  },
  {
    dealership_name: "Milan Speed Wheels",
    dial_code: 39,
    phone_number: 3216549870,
    address: "Via Roma, Milan, Italy",
    ratings: "4",
    image: null,
  },
  {
    dealership_name: "Hyderabad RideMart",
    dial_code: 91,
    phone_number: 9247123456,
    address: "Madhapur, Hyderabad",
    ratings: "3",
    image: null,
  },
  {
    dealership_name: "Chennai AutoWorld",
    dial_code: 91,
    phone_number: 9361123456,
    address: "T. Nagar, Chennai",
    ratings: "5",
    image: null,
  },
  {
    dealership_name: "Paris Auto Store",
    dial_code: 33,
    phone_number: 612345678,
    address: "Rue de Rivoli, Paris, France",
    ratings: "4",
    image: null,
  },
  {
    dealership_name: "London Car House",
    dial_code: 44,
    phone_number: 7911123456,
    address: "Oxford Street, London, UK",
    ratings: "5",
    image: null,
  }
];
for (let data of dealerships) {
  const formData = new FormData();
  formData.append("dealership_name", data.dealership_name);
  formData.append("dial_code", data.dial_code);
  formData.append("phone_number", data.phone_number);
  formData.append("address", data.address);
  formData.append("ratings", data.ratings);

  if (data.image) {
    formData.append("image", data.image); // if you use local uploads or Cloudinary URLs
  }

  await axios.post(`${BACKEND_URL}/store/dealerships/`, formData, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
}
    try {
      const formData = new FormData();
      formData.append("title", title);
      if (logo) formData.append("logo", logo);
      formData.append("country", country);
      formData.append("since", since);

      const response = await axios.put(
        `${BACKEND_URL}/store/companies/${company.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setNotification({
        type: 'success',
        message: 'Company updated successfully!',
        details: null
      });

      onUpdateSuccess(response.data);
      
      // Don't set loading to false here - let the modal close first
    } catch (error) {
      console.error("Error updating company:", error);
      
      let errorMessage = "Failed to update company";
      let errorDetails = null;
      
      if (error.response) {
        if (error.response.data) {
          errorDetails = typeof error.response.data === 'object' 
            ? Object.entries(error.response.data).map(([field, messages]) => (
                <div key={field}>
                  <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(" ") : messages}
                </div>
              ))
            : error.response.data;
        } else {
          errorDetails = error.response.statusText || "Unknown error occurred";
        }
      } else if (error.message) {
        errorDetails = error.message;
      }

      setNotification({
        type: 'error',
        message: errorMessage,
        details: errorDetails
      });
      
      setLoading(false);
    }
  };

  // This effect handles the modal closing after success
  useEffect(() => {
    if (notification.type === 'success') {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [notification.type, onClose]);

  // This effect resets loading state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setLoading(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative"
          >
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-blue-700">Update Company</h2>

            <ResponseHandler
              type={notification.type}
              message={notification.message}
              details={notification.details}
              onClear={clearNotification}
            />

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Company Title */}
              <div>
                <label className="block text-gray-700 mb-2">Company Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-50"
                />
              </div>

              {/* Company Logo */}
              <div>
                <label className="block text-gray-700 mb-2">Company Logo</label>
                <div className="flex items-center gap-4">
                  <div 
                    onClick={() => !loading && fileInputRef.current.click()}
                    className={`w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors overflow-hidden ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                      onClick={() => !loading && fileInputRef.current.click()}
                      disabled={loading}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {logo || previewImage ? "Change Logo" : "Upload Logo"}
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
                    disabled={loading}
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
                  onClick={() => !loading && setShowDropdown(true)}
                  required
                  maxLength={30}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-50"
                  placeholder="Search for a country"
                />
                <div className="absolute right-2 top-10 text-xs text-gray-400">
                  {searchQuery.length}/30
                </div>
                {showDropdown && !loading && (
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
                          {country.name.slice(0, 30)}
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
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:opacity-50"
                  placeholder="YYYY"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
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
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpdateCompanyModal;