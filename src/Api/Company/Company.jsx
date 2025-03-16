import React, { useState, useEffect } from "react";
import axios from "axios";
import CompanyModal from "./CompanyModal";
import CreateCompanyModal from "./CreateCompanyModal";
import { BACKEND_URL } from "../../Constants/constant";
import { motion } from "framer-motion";
import Notification from "../../components/Globle/Notification";
import UpdateCompanyModal from "./UpdateCompanyModal.jsx";
import { PencilSquareIcon } from "@heroicons/react/24/solid"; // For edit icon

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // State for UpdateCompanyModal visibility
  const [companyToUpdate, setCompanyToUpdate] = useState(null); // State to store the company to update
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/store/companies/`);
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setNotification({
          message: "Failed to fetch companies. Please try again later.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (company) => {
    setSelectedCompany(company);
  };

  const closeModal = () => {
    setSelectedCompany(null);
  };

  const handleDeleteSuccess = (deletedCompanyId) => {
    setCompanies((prevCompanies) =>
      prevCompanies.filter((company) => company.id !== deletedCompanyId)
    );
    closeModal();
  };

  const handleCreateCompany = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/store/companies/`);
      setCompanies(response.data);
      setNotification({
        message: "Company created successfully! 🎉",
        type: "success",
      });
      setIsCreateModalOpen(false); // Close the modal after successful creation
    } catch (error) {
      console.error("Error fetching companies:", error);
      setNotification({
        message: "Failed to create company. Please try again.",
        type: "error",
      });
    }
  };

  const handleUpdateSuccess = (updatedCompany) => {
    setCompanies((prevCompanies) =>
      prevCompanies.map((company) =>
        company.id === updatedCompany.id ? updatedCompany : company
      )
    );
    setIsUpdateModalOpen(false); // Close the modal after successful update
    setNotification({
      message: "Company updated successfully! 🎉",
      type: "success",
    });
  };

  const filteredCompanies = companies.filter((company) =>
    company.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen p-8 flex flex-col items-center">
      {/* Title */}
      <motion.h1
        className="text-5xl font-extrabold mb-10 text-center text-blue-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🏭 Explore Companies
      </motion.h1>

      {/* Search and Create Section */}
      <motion.div
        className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-12 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search Companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-3 w-full md:w-1/3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
        />

        {/* Create Company Button */}
        {authToken ? (
          <motion.button
            onClick={() => setIsCreateModalOpen(true)} // Open CreateCompanyModal
            className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Create Company
          </motion.button>
        ) : (
          <p className="text-gray-500 text-sm italic">
            Login to create a company
          </p>
        )}
      </motion.div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </div>
      )}

      {/* Companies Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-center">
        {filteredCompanies.map((company, index) => (
          <motion.div
            key={company.id}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <div
              onClick={() => openModal(company)}
              className="relative bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer group transform transition-all duration-300 border border-gray-100"
            >
              {/* Company Logo */}
              <div className="relative w-full h-[300px] flex justify-center items-center bg-blue-50">
                <img
                  className="w-40 h-40 object-cover rounded-full border-4 border-blue-500 transition-transform duration-300 group-hover:scale-110 shadow-md z-10 bg-white"
                  src={company.logo}
                  alt={`Company ${company.title}`}
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white px-4">
                  <div className="text-2xl font-bold mb-2">{company.title}</div>
                  <p className="text-sm text-blue-300">Tap for details</p>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="p-4 bg-gradient-to-r from-blue-100 to-white">
                <div className="text-blue-800 font-bold text-lg truncate">
                  {company.title}
                </div>
              </div>

              {/* Update Button */}
              {authToken && ![28, 29, 30].includes(company.id) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening the details modal
                    setCompanyToUpdate(company); // Set the company to update
                    setIsUpdateModalOpen(true); // Open the update modal
                  }}
                  className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Companies Found */}
      {!loading && filteredCompanies.length === 0 && (
        <motion.div
          className="text-gray-600 text-lg mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No companies found 😕
        </motion.div>
      )}

      {/* Company Modal */}
      {selectedCompany && (
        <CompanyModal
          isOpen={!!selectedCompany}
          closeModal={closeModal}
          company={selectedCompany}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}

      {/* Create Company Modal */}
      {isCreateModalOpen && (
        <CreateCompanyModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={handleCreateCompany}
        />
      )}

      {/* Update Company Modal */}
      {isUpdateModalOpen && (
        <UpdateCompanyModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          company={companyToUpdate} // Pass the company to update directly
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* Notification */}
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "" })}
        />
      )}
    </div>
  );
};

export default Company;