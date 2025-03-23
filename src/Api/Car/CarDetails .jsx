import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import StarRating from "../../components/StarRating";
import { BACKEND_URL } from "../../Constants/constant";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import Notification from "../../components/Globle/Notification";
import CreateCarOwnerModal from "../Carowner/CreateCarownerModal";
// CHANGE: Import the SkeletonLoader component
import SkeletonLoader from "../../components/SkeletonLoader";
const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    ratings: 0,
    comment: "",
  });
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });
  const [showCreateCarOwnerModal, setShowCreateCarOwnerModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation modal

  const fetchCar = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/store/cars/${id}`);
      const reviewResponse = await axios.get(
        `${BACKEND_URL}/store/cars/${id}/reviews/`
      );
      setCar(response.data);
      setReviews(reviewResponse.data || []);
    } catch (error) {
      console.error("Error fetching car details:", error);
      setNotification({
        message: "Failed to load car details. Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCar();
  }, [fetchCar]);

  const handleAddComment = () => {
    setShowReviewForm((prev) => !prev);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`${BACKEND_URL}/store/cars/${id}/reviews/${reviewId}/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      setNotification({
        message: "Review deleted successfully!",
        type: "success",
      });
  
      // Refetch the reviews to update the list
      fetchCar();
    } catch (error) {
      console.error("Error deleting review:", error);
      setNotification({
        message: "Failed to delete review. Please try again.",
        type: "error",
      });
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleStarClick = (rating) => {
    setNewReview((prev) => ({ ...prev, ratings: rating }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (newReview.ratings === 0 || newReview.comment.trim() === "") {
      setNotification({
        message: "Please provide both a rating and comment!",
        type: "error",
      });
      return;
    }

    try {
      const csrfToken = getCookie("csrftoken");
      const authToken = localStorage.getItem("authToken");

      const formData = new FormData();
      formData.append("csrfmiddlewaretoken", csrfToken);
      formData.append("ratings", newReview.ratings);
      formData.append("description", newReview.comment);
      formData.append("car", id);

      if (authToken) {
        const decoded = jwtDecode(authToken);
        const userName = decoded?.user_id || "Anonymous";

        formData.append("user", userName);
        formData.append("name", "admin");
      } else {
        formData.append("name", newReview.name);
      }

      await axios.post(`${BACKEND_URL}/store/cars/${id}/reviews/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
      });

      setNotification({
        message: "Review submitted successfully! 🎉",
        type: "success",
      });
      setNewReview({ ratings: 0, comment: "" });
      setShowReviewForm(false);

      fetchCar();
    } catch (error) {
      console.error("Error submitting review:", error);
      setNotification({
        message: "Failed to submit review. Please try again.",
        type: "error",
      });
    }
  };

  const handleDeleteCar = async () => {
    setButtonLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}/store/cars/${id}/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setNotification({
        message: "Car deleted successfully! 🚗💨",
        type: "success",
      });

      // Redirect to the cars list after deletion
      setTimeout(() => {
        navigate("/cars");
      }, 2000);
    } catch (error) {
      console.error("Error deleting car:", error);
      setNotification({
        message: "Failed to delete car. Please try again.",
        type: "error",
      });
    } finally {
      setButtonLoading(false);
      setShowDeleteConfirm(false); // Close the confirmation modal
    }
  };

  
  const handleBuyNow = async () => {
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
  
    setButtonLoading(true);
  
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
          message: "Please become a Car Owner to purchase a car.",
          type: "info",
        });
        setShowCreateCarOwnerModal(true);
        return; // 👉 Exit here! Don't proceed to purchase or reload.
      }
  
      setNotification({
        message: "Processing purchase...",
        type: "loading",
      });
  
      const balance_deduct = new FormData();

      balance_deduct.append("balance", carowner.balance - car.price);
      balance_deduct.append("phone_number", carowner.phone_number);
      balance_deduct.append("user", carowner.user);

      console.log(carowner.balance,car.price);
      
      if(carowner.balance < car.price){
        setNotification({
          message: "You do not have enough balance!",
          type: "error",
        });
        return
      }
      await axios.put(`${BACKEND_URL}/store/carowners/${carowner.id}/`, balance_deduct, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });


      // ✅ Step 2: Proceed with car purchase
      const csrfToken = getCookie("csrftoken");
  
      const formData = new FormData();
      formData.append("csrfmiddlewaretoken", csrfToken);
      formData.append("car", id);
      formData.append("carowner", carowner.id);
  
      await axios.post(`${BACKEND_URL}/store/carownerships/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
  

      setNotification({
        message: "Car purchase successful! 🎉",
        type: "success",
      });
  
      // ✅ Reload ONLY after successful purchase
      setTimeout(() => {
        window.location.reload();
      }, 1000); // optional delay for UX (1s)
    } catch (error) {
      console.error("❌ Error purchasing car:", error);
  
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
    } finally {
      setButtonLoading(false);
      // ❌ DO NOT reload here! This was causing the issue.
    }
  };
  

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex justify-center items-center min-h-screen text-2xl font-semibold text-red-500">
        Car not found 😕
      </div>
    );
  }

  const {
    title,
    company_title,
    image,
    carmodel,
    color,
    registration_year,
    fuel_type,
    mileage,
    description,
    ratings,
    carowner,
    dealerships,
    price,
  } = car;

  const formattedPrice = price.toLocaleString();

  const decoded = authToken ? jwtDecode(authToken) : null;
  const user_id = decoded?.user_id;
  const carowner_user_id = carowner?.user_id;

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-10 px-6">
      {/* CHANGE: Conditionally render SkeletonLoader while loading */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            <motion.img
              src={image || "https://via.placeholder.com/500?text=No+Image"}
              alt={`${title} - ${carmodel}`}
              className="w-full h-[500px] object-cover rounded-2xl shadow-lg"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
  
            {/* REVIEWS SECTION */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">
                Customer Reviews
              </h3>
  
              {reviews.length > 0 ? (
                <ul className="space-y-4 mb-6">
                  {reviews.map((review) => (
                    <li key={review.id} className="border-b pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-gray-700">
                            {review.user_name || review.name}
                          </div>
                          <StarRating rating={review.ratings} />
                          <p className="text-gray-600">{review.description}</p>
                        </div>
                        {authToken && review.user === user_id && (
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mb-6">No reviews available.</p>
              )}
  
              <motion.button
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                onClick={handleAddComment}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {showReviewForm ? "Cancel" : "Add Comment"}
              </motion.button>
              {showReviewForm && (
                <motion.form
                  className="mt-6 space-y-4"
                  onSubmit={handleSubmitReview}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Star Rating */}
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-700 font-medium">Rating:</p>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.span
                        key={star}
                        className={`cursor-pointer text-2xl ${
                          newReview.ratings >= star ? "text-yellow-400" : "text-gray-400"
                        }`}
                        onClick={() => handleStarClick(star)}
                        whileHover={{ scale: 1.2 }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
  
                  {/* Name Field (if NOT logged in) */}
                  {!localStorage.getItem("authToken") && (
                    <input
                      type="text"
                      name="name"
                      value={newReview.name}
                      onChange={handleReviewChange}
                      placeholder="Your Name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  )}
  
                  {/* Comment Field */}
                  <textarea
                    name="comment"
                    value={newReview.comment}
                    onChange={handleReviewChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Write your comment here..."
                    required
                  />
  
                  <motion.button
                    type="submit"
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Submit Review
                  </motion.button>
                </motion.form>
              )}
            </div>
          </div>
  
          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-4xl font-extrabold text-blue-800 mb-2">
                {title} - {carmodel}
              </h1>
              <p className="text-2xl text-gray-800 font-semibold">
                $ {formattedPrice}
              </p>
              <div className="flex items-center mt-3">
                <StarRating rating={ratings} />
                <span className="ml-2 text-gray-600">({ratings} / 5)</span>
              </div>
            </div>
  
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="font-semibold">Color:</p>
                <p>{color}</p>
              </div>
              <div>
                <p className="font-semibold">Company:</p>
                <p>{company_title}</p>
              </div>
              <div>
                <p className="font-semibold">Year:</p>
                <p>{registration_year}</p>
              </div>
              <div>
                <p className="font-semibold">Fuel Type:</p>
                <p>{fuel_type}</p>
              </div>
              <div>
                <p className="font-semibold">Mileage:</p>
                <p>{mileage} miles</p>
              </div>
              <div>
                <p className="font-semibold">Owner:</p>
                <p>{carowner ? carowner.name : "Not Owned Yet"}</p>
              </div>
            </div>
  
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Dealerships
              </h3>
              {dealerships && dealerships.length > 0 ? (
                <ul className="space-y-2">
                  {dealerships.map((dealer, index) => (
                    <li key={dealer.id || index}>
                      <Link
                        to={`/dealerships/${dealer.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {index + 1}. {dealer.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No dealerships available.</p>
              )}
            </div>
  
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Description
              </h3>
              <p className="text-gray-600">{description}</p>
            </div>
  
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Buy Now Button */}
              <motion.button
                onClick={handleBuyNow}
                disabled={buttonLoading || car.carowner}
                className={`w-full py-4 text-white text-lg font-semibold rounded-lg shadow-md transition-all duration-300
                  ${car.carowner || buttonLoading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}
                `}
                whileHover={!(car.carowner || buttonLoading) ? { scale: 1.05 } : {}}
                whileTap={!(car.carowner || buttonLoading) ? { scale: 0.95 } : {}}
              >
                {car.carowner
                  ? "Sold Out"
                  : buttonLoading
                  ? "Processing..."
                  : "Buy Now"}
              </motion.button>
  
              {/* Delete Car Button */}
              {authToken &&
                user_id &&
                carowner_user_id &&
                user_id === carowner_user_id &&
                ![8, 9, 10].includes(car.id) && (
                  <motion.button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={buttonLoading}
                    className={`w-full py-4 text-white text-lg font-semibold rounded-lg shadow-md transition-all duration-300
                      ${buttonLoading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}
                    `}
                    whileHover={!buttonLoading ? { scale: 1.05 } : {}}
                    whileTap={!buttonLoading ? { scale: 0.95 } : {}}
                  >
                    Delete Car
                  </motion.button>
                )}
            </div>
          </div>
        </motion.div>
      )}
  
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-bold text-red-500">{title}</span>?
              </p>
  
              {/* Confirm Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDeleteCar}
                  disabled={buttonLoading}
                  className={`px-4 py-2 rounded-lg text-white ${
                    buttonLoading
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } transition-all`}
                >
                  {buttonLoading ? "Processing..." : "Yes, Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={buttonLoading}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  
      {/* Global Notification */}
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "" })}
        />
      )}
  
      {/* Create Car Owner Modal */}
      <CreateCarOwnerModal
        isOpen={showCreateCarOwnerModal}
        closeModal={() => setShowCreateCarOwnerModal(false)}
        onCreateSuccess={() => {
          setShowCreateCarOwnerModal(false);
          handleBuyNow(); // Retry the purchase after becoming a car owner
        }}
      />
    </div>
  );
};

export default CarDetails;