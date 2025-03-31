import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Notification from "../../components/Globle/Notification";
import { PhotoIcon } from "@heroicons/react/24/solid";

const DealershipModal = ({ isOpen, closeModal, dealership }) => {
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });

  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setNotification({ message: "", type: "" });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeModal]);

  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  if (!isOpen || !dealership) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <motion.div
          ref={modalRef}
          className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg relative overflow-y-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ maxHeight: "80vh" }}
        >

          <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
            {dealership.dealership_name}
          </h2>

          <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {dealership.image ? (
              <>
                <img
                  src={dealership.image}
                  alt={dealership.dealership_name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <PhotoIcon className="h-16 w-16 text-gray-400" />
                <span className="sr-only">No image available</span>
              </div>
            )}
          </div>

          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between">
              <span className="font-semibold">Contact:</span>
              <span>
                {dealership.dial_code && dealership.phone_number
                  ? `+${dealership.dial_code} ${dealership.phone_number}`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Address:</span>
              <span className="text-right">{dealership.address || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Ratings:</span>
              <span>{dealership.ratings || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Featured Cars:</span>
              <span>{dealership.featured_cars?.length || 0}</span>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={closeModal}
              className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
    </>
  );
};

export default DealershipModal;
