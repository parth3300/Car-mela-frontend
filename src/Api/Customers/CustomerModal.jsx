import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  XMarkIcon, 
  PhoneIcon, 
  UserIcon, 
  EnvelopeIcon,
  CalendarIcon 
} from "@heroicons/react/24/solid";
import { jwtDecode } from "jwt-decode";
import { BACKEND_URL } from "../../Constants/constant";

const CustomerModal = ({
  isOpen,
  customer,
  closeModal,
  onDeleteSuccess,
  setNotification
}) => {
  const [loading, setLoading] = useState(false);
  const authToken = localStorage.getItem("authToken");
  let user_id = "";
  if (authToken) {
    let decoded = jwtDecode(authToken);
    user_id = decoded?.user_id;
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    
    setLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}/store/customers/${customer.id}/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      onDeleteSuccess(customer.id);
      setNotification({
        message: "Customer deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting customer:", error);
      setNotification({
        message: "Failed to delete customer. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">Customer Details</h3>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <UserIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {customer.first_name} {customer.last_name}
            </h2>
            <p className="text-gray-600">@{customer.user.username}</p>
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-start">
              <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-3 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-800">{customer.user.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start">
              <PhoneIcon className="h-5 w-5 text-gray-500 mr-3 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-gray-800">
                  +{customer.dial_code} {customer.phone_number}
                </p>
              </div>
            </div>

            {/* Registration Date */}
            <div className="flex items-start">
              <CalendarIcon className="h-5 w-5 text-gray-500 mr-3 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Registered</p>
                <p className="text-gray-800">
                  {new Date(customer.user.date_joined).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between p-6 border-t">
          {authToken && user_id === customer.user.id && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Deleting..." : "Delete Account"}
            </button>
          )}
          <button
            onClick={closeModal}
            className="ml-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerModal;