import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { BACKEND_URL } from "../../Constants/constant";

// Predefined list of countries (you can replace this with an API call to fetch countries)
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
  "Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
  "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany",
  "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
  "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali",
  "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
  "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
  "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
  "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa",
  "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
  "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
  "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand",
  "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const UpdateCompanyModal = ({ isOpen, onClose, company, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    logo: null, // For file upload
    country: "",
    since: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const [searchCountryQuery, setSearchCountryQuery] = useState("");

  // Populate form data when company is selected
  useEffect(() => {
    if (company) {
      setFormData({
        title: company.title || "",
        logo: company.logo || null,
        country: company.country || "",
        since: company.since || "",
      });
      setSearchCountryQuery(company.country || ""); // Pre-fill the country search input
    }
  }, [company]);

  // Handle country search input change
  const handleCountrySearchChange = (e) => {
    const query = e.target.value;
    setSearchCountryQuery(query);

    if (query) {
      const filteredCountries = COUNTRIES.filter((country) =>
        country.toLowerCase().includes(query.toLowerCase())
      );
      setCountrySuggestions(filteredCountries);
    } else {
      setCountrySuggestions([]);
    }
  };

  // Handle country selection from suggestions
  const handleCountrySelect = (country) => {
    setFormData((prev) => ({ ...prev, country }));
    setSearchCountryQuery(country);
    setCountrySuggestions([]);
  };

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
      if (formData.logo) data.append("logo", formData.logo); // Append the file if it exists
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
                    value={searchCountryQuery}
                    onChange={handleCountrySearchChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  {/* Show country suggestions */}
                  {countrySuggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {countrySuggestions.map((country) => (
                        <div
                          key={country}
                          onClick={() => handleCountrySelect(country)}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {country}
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