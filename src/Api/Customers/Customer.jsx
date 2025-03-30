import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../Constants/constant";
import { motion, AnimatePresence } from "framer-motion";
import { UserIcon, PhoneIcon } from "@heroicons/react/24/solid";
import CreateCustomerModal from "./CreateCustomerModal";
import CustomerModal from "./CustomerModal";
import UpdateCustomerModal from "./UpdateCustomerModal";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { jwtDecode } from "jwt-decode";
import SkeletonLoader from "../../components/SkeletonLoader";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [customerToUpdate, setCustomerToUpdate] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const authToken = localStorage.getItem("authToken");
  let user_id = "";
  if (authToken) {
    let decoded = jwtDecode(authToken);
    user_id = decoded?.user_id;
  }

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/store/customers/`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setNotification({
        message: "Failed to fetch customers. Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteSuccess = (deletedId) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== deletedId));
    setSelectedCustomer(null);
  };

  const handleCreateSuccess = (newCustomer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    setShowCreateModal(false);
    setNotification({
      message: "Customer created successfully! 🎉",
      type: "success",
    });
  };

  const handleUpdateSuccess = (updatedCustomer) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
    setIsUpdateModalOpen(false);
    setNotification({
      message: "Customer updated successfully! 🎉",
      type: "success",
    });
  };

  let user_is_customer = customers.find((customer) => customer.user == user_id);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen p-8 flex flex-col items-center">
      {/* Heading */}
      <motion.h1
        className="text-5xl font-extrabold mb-10 text-center text-blue-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        👥 Manage Customers
      </motion.h1>

      {/* Notification */}
      <AnimatePresence>
        {notification.message && (
          <motion.div
            className="fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              backgroundColor:
                notification.type === "success" ? "#D1FAE5" : "#FEE2E2",
              color: notification.type === "success" ? "#065F46" : "#991B1B",
            }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search + Create */}
      <motion.div
        className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-12 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Search */}
        <input
          type="text"
          placeholder="Search Customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-3 w-full md:w-1/3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
        />

        {/* Create button */}
        {user_is_customer ? (
          ""
        ) : authToken ? (
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Register as Customer
          </motion.button>
        ) : (
          <p className="text-gray-500 text-sm italic">
            Login to register as a customer
          </p>
        )}
      </motion.div>

      {/* Loading Skeleton */}
      {loading && <SkeletonLoader />}

      {/* Customers List */}
      {!loading && (
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
          {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.id}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="w-full"
            >
              <div
                onClick={() => setSelectedCustomer(customer)}
                className="relative flex flex-col items-center bg-white rounded-2xl p-6 shadow-md hover:shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 group h-full"
              >
                {/* Profile Picture */}
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <UserIcon className="h-10 w-10 text-blue-600" />
                </div>

                {/* Info */}
                <div className="text-center">
                  <h2 className="text-xl font-bold text-blue-800 mb-2">
                    {customer.first_name} {customer.last_name}
                  </h2>

                  <div className="flex items-center justify-center text-gray-600 text-sm mb-3">
                    <PhoneIcon className="h-4 w-4 mr-1 text-blue-400" />
                    +{customer.dial_code} {customer.phone_number}
                  </div>
                </div>

                {/* User Info on Hover */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white px-4">
                  <p className="text-lg font-semibold">Username:</p>
                  <p className="text-xl font-bold">{customer.user.username}</p>
                </div>

                {/* Update Button */}
                {authToken && user_id && user_id === customer?.user && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCustomerToUpdate(customer);
                      setIsUpdateModalOpen(true);
                    }}
                    className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                )}

                {/* View Details Link */}
                <motion.div
                  className="mt-4 text-left text-sm text-blue-600 font-medium hover:text-blue-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  View Details →
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* No Customers Found */}
      {!loading && filteredCustomers.length === 0 && (
        <motion.div
          className="text-gray-600 text-lg mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No customers found 😕
        </motion.div>
      )}

      {/* Create Customer Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateCustomerModal
            isOpen={showCreateModal}
            closeModal={() => setShowCreateModal(false)}
            onCreateSuccess={handleCreateSuccess}
            setNotification={setNotification}
          />
        )}
      </AnimatePresence>

      {/* View Customer Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <CustomerModal
            isOpen={!!selectedCustomer}
            customer={selectedCustomer}
            closeModal={() => setSelectedCustomer(null)}
            onDeleteSuccess={handleDeleteSuccess}
          />
        )}
      </AnimatePresence>

      {/* Update Customer Modal */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <UpdateCustomerModal
            isOpen={isUpdateModalOpen}
            customer={customerToUpdate}
            closeModal={() => setIsUpdateModalOpen(false)}
            onUpdateSuccess={handleUpdateSuccess}
            setNotification={setNotification}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Customers;