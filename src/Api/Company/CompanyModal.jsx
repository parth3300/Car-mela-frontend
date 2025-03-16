import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { BACKEND_URL } from "../../Constants/constant";
import Notification from "../../components/Globle/Notification";

const CompanyModal = ({ isOpen, closeModal, company, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });

  const authToken = localStorage.getItem("authToken");

  if (!isOpen || !company) return null;

  const handleDelete = async () => {
    console.log("handleDelete called!");

    if (!authToken) {
      console.log("No auth token found.");
      setNotification({
        message: "Please login to manage companies.",
        type: "info",
      });
      return;
    }

    setLoading(true);
    console.log("Starting DELETE request for company...");

    try {
      const url = `${BACKEND_URL}/store/companies/${company.id}/`;
      console.log("DELETE URL:", url);

      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log("DELETE successful:", response.status);

      setNotification({
        message: "Company successfully deleted!",
        type: "success",
      });

      if (onDeleteSuccess) {
        onDeleteSuccess(company.id);
      }

      // Close the modal after a short delay to show the success message
      setTimeout(() => {
        closeModal();
      }, 3000); // Increased delay to 3 seconds
    } catch (error) {
      console.error("DELETE failed:", error.response || error);
      setNotification({
        message: "Failed to delete company. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Modal Content */}
            <motion.div
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg relative overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ maxHeight: "80vh" }}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>

              {/* Company Name */}
              <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
                {company.title}
              </h2>

              {/* Company Logo */}
              <div className="flex justify-center mb-6">
                <img
                  src={company.logo}
                  alt={company.title}
                  className="rounded-lg object-cover w-32 h-32 border shadow-md"
                />
              </div>

              {/* Company Details */}
              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold">Country:</span>
                  <span>{company.country || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Since:</span>
                  <span>{company.since || "N/A"}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-semibold">Listed Cars:</span>
                  {company.listed_cars && company.listed_cars.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {company.listed_cars.map((car, index) => (
                        <li key={car.id || index}>
                          {index + 1}. {car.title}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500 text-sm">No cars listed</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 mt-8">
                {authToken ? (
                  <button
                    onClick={() => {
                      console.log("Clicked delete, showing confirm dialog");
                      setShowConfirm(true);
                    }}
                    disabled={loading}
                    className={`px-5 py-2 rounded-lg transition-all ${
                      loading
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white`}
                  >
                    Delete
                  </button>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Login to manage this company
                  </p>
                )}
              </div>

              {/* Confirm Delete Modal */}
              <AnimatePresence>
                {showConfirm && (
                  <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Confirm Deletion
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Are you sure you want to delete{" "}
                        <span className="font-bold text-red-500">
                          {company.title}
                        </span>
                        ?
                      </p>

                      {/* Confirm Buttons */}
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={handleDelete}
                          disabled={loading}
                          className={`px-4 py-2 rounded-lg text-white ${
                            loading
                              ? "bg-red-400 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700"
                          } transition-all`}
                        >
                          {loading ? "Processing..." : "Yes, Delete"}
                        </button>
                        <button
                          onClick={() => {
                            console.log("Cancel deletion");
                            setShowConfirm(false);
                          }}
                          disabled={loading}
                          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
    </>
  );
};

export default CompanyModal;