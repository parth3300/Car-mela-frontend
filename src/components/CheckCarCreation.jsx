import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import CreateCarModal from "../Api/Car/CreateCarModal";
import CreateCarOwnerModal from "../Api/Carowner/CreateCarownerModal";
import { BACKEND_URL } from "../Constants/constant";

export const useCheckCarCreation = ({ setNotification, navigate }) => {
  const [showCreateCarModal, setShowCreateCarModal] = useState(false);
  const [showCreateCarOwnerModal, setShowCreateCarOwnerModal] = useState(false);

  const handleSellYourCar = async () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setNotification({
        message: "Please log in first!",
        type: "info",
      });
      return navigate("/login");
    }

    let decoded;
    try {
      decoded = jwtDecode(authToken);
    } catch (error) {
      setNotification({
        message: "Invalid token, please log in again.",
        type: "error",
      });
      localStorage.removeItem("authToken");
      return navigate("/login");
    }

    const user_id = decoded?.user_id;
    if (!user_id) {
      setNotification({
        message: "User not found, please log in again.",
        type: "error",
      });
      localStorage.removeItem("authToken");
      return navigate("/login");
    }

    try {
      // ✅ Step 1: Check if user is a Car Owner
      const carownerResponse = await axios.get(`${BACKEND_URL}/store/carowners/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const carowner = carownerResponse.data.find(
        (owner) => owner.user === user_id
      );

      if (!carowner) {
        // ✅ Show CreateCarOwner modal if not found
        setNotification({
          message: "Please become a Car Owner to sell a car.",
          type: "info",
        });
        setShowCreateCarOwnerModal(true); // Open CreateCarOwnerModal
        return; // 👉 Exit here! Don't proceed further.
      }

      // ✅ Step 2: If user is a car owner, open CreateCarModal
      setShowCreateCarModal(true); // Open CreateCarModal
    } catch (error) {
      console.error("❌ Error checking car owner status:", error);

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

      setNotification({
        message: errorMessage,
        type: "error",
      });
    }
  };

  return {
    handleSellYourCar,
    showCreateCarModal,
    showCreateCarOwnerModal,
    setShowCreateCarModal,
    setShowCreateCarOwnerModal,
  };
};

const CheckCarCreation = ({ setNotification, navigate }) => {
  const {
    handleSellYourCar,
    showCreateCarModal,
    showCreateCarOwnerModal,
    setShowCreateCarModal,
    setShowCreateCarOwnerModal,
  } = useCheckCarCreation({ setNotification, navigate });

  return (
    <>
      {/* Create Car Modal */}
      <CreateCarModal
        isOpen={showCreateCarModal}
        closeModal={() => setShowCreateCarModal(false)}
        onCreateSuccess={() => {
          setNotification({
            message: "Car details uploaded successfully! 🎉",
            type: "success",
          });
          setShowCreateCarModal(false);
        }}
      />

      {/* Create Car Owner Modal */}
      <CreateCarOwnerModal
        isOpen={showCreateCarOwnerModal}
        closeModal={() => setShowCreateCarOwnerModal(false)}
        onCreateSuccess={() => {
          setNotification({
            message: "Congratulations! You are now a car owner. 🎉",
            type: "success",
          });
          setShowCreateCarOwnerModal(false);
          setShowCreateCarModal(true); // Open CreateCarModal after becoming a car owner
        }}
      />
    </>
  );
};

export default CheckCarCreation;