import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { loadStripe } from "@stripe/stripe-js";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

import StarRating from "../../components/common/StarRating";
import { BACKEND_URL, STRIPE_PUBLISHABLE_KEY } from "../../Constants/constant";
import CreateCarOwnerModal from "../Carowner/CreateCarownerModal";
import ResponseHandler from "../../components/Globle/ResponseHandler";

const SkeletonLoader = () => {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse p-6">
      {/* Image Placeholder */}
      <div className="space-y-6">
        <div className="w-full h-[500px] bg-gray-300 dark:bg-gray-700 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer"></div>
        </div>

        {/* Reviews Placeholder */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6">
          <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b pb-4 space-y-2">
                <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  ))}
                </div>
                <div className="h-3 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-3 w-2/3 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        </div>
      </div>

      {/* Content Placeholder */}
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="h-10 w-3/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-6 w-1/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="h-5 w-1/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-3 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
            ))}
            <div className="h-3 w-2/3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-5 w-1/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="space-y-1">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded"></div>
            ))}
          </div>
        </div>

        <div className="h-14 w-full bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
      </div>
    </div>
  );
};

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const PaymentMethodModal = ({ isOpen, onClose, onSelectPaymentMethod }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Select Payment Method
                </Dialog.Title>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Choose how you would like to pay for this car.
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <button
                    type="button"
                    className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => onSelectPaymentMethod('cash')}
                  >
                    Pay with Cash (Balance Deduction)
                  </button>
                  <button
                    type="button"
                    className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => onSelectPaymentMethod('card')}
                  >
                    Pay with Credit/Debit Card
                  </button>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [newReview, setNewReview] = useState({
    ratings: 0,
    comment: "",
  });
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });
  const [showCreateCarOwnerModal, setShowCreateCarOwnerModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        action: "delete"  // Added action type
      });
  
      setTimeout(() => {
        navigate("/cars");
      }, 2000);
    } catch (error) {
      console.error("Error deleting car:", error);
      setNotification({
        message: error.response?.data?.message || "Failed to delete car. Please try again.",
        type: "error",
        action: "delete"  // Added action type
      });
    } finally {
      setButtonLoading(false);
      setShowDeleteConfirm(false);
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
  
    setShowPaymentMethodModal(true);
  };

  const handlePaymentMethodSelect = async (method) => {
    setShowPaymentMethodModal(false);
    
    if (method === 'cash') {
      await processCashPayment();
    } else if (method === 'card') {
      await processCardPayment();
    }
  };

  const processCashPayment = async () => {
    const authToken = localStorage.getItem("authToken");
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
      const carownerResponse = await axios.get(`${BACKEND_URL}/store/carowners/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      const carowner = carownerResponse.data.find(
        (owner) => owner.user === user_id
      );
  
      if (!carowner) {
        setNotification({
          message: "Please become a Car Owner to purchase a car.",
          type: "info",
        });
        setShowCreateCarOwnerModal(true);
        return;
      }
  
      setNotification({
        message: "Processing purchase...",
        type: "loading",
      });
  
      const balance_deduct = new FormData();
      balance_deduct.append("balance", carowner.balance - car.price);
      balance_deduct.append("phone_number", carowner.phone_number);
      balance_deduct.append("user", carowner.user);

      if (carowner.balance < car.price) {
        setNotification({
          message: "You do not have enough balance!",
          type: "error",
        });
        return;
      }
      
      await axios.put(`${BACKEND_URL}/store/carowners/${carowner.id}/`, balance_deduct, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

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
  
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error processing cash payment:", error);
      setNotification({
        message: "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setButtonLoading(false);
    }
  };

  const processCardPayment = async () => {
    const authToken = localStorage.getItem("authToken");
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
      // Get car owner details
      const carownerResponse = await axios.get(`${BACKEND_URL}/store/carowners/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      const carowner = carownerResponse.data.find(
        (owner) => owner.user === user_id
      );
  
      if (!carowner) {
        setNotification({
          message: "Please become a Car Owner to purchase a car.",
          type: "info",
        });
        setShowCreateCarOwnerModal(true);
        return;
      }
  
      // Create checkout session with all parameters
      const response = await axios.post(
        `${BACKEND_URL}/store/create-checkout-session/`,
        {
          car_id: id,
          carowner_id: carowner.id,
          amount: car.price,
          currency: "usd",
          user_id: user_id,
          user_email: carowner.email,
          user_name: carowner.name,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      const sessionId = response.data.id;
      const stripe = await stripePromise;
  
      // Only pass sessionId to redirectToCheckout
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId
      });
  
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error processing card payment:", error);
      setNotification({
        message: error.response?.data?.error || "An error occurred during payment processing.",
        type: "error",
      });
    } finally {
      setButtonLoading(false);
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
      {loading ? (
        <SkeletonLoader />
      ) : (
        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-6">
            <motion.img
              src={image || "https://via.placeholder.com/500?text=No+Image"}
              alt={`${title} - ${carmodel}`}
              className="w-full h-[500px] object-cover rounded-2xl shadow-lg"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
  
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
              <motion.button
                onClick={handleBuyNow}
                disabled={buttonLoading || car.carowner}
                className={`w-full py-4 text-lg font-semibold rounded-lg shadow-md transition-all duration-300 flex items-center justify-center
                  ${car.carowner ? "bg-gray-400 text-white cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"}
                `}
                whileHover={!(car.carowner || buttonLoading) ? { scale: 1.05 } : {}}
                whileTap={!(car.carowner || buttonLoading) ? { scale: 0.95 } : {}}
              >
                {car.carowner ? (
                  "Sold Out"
                ) : buttonLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Processing...
                  </>
                ) : (
                  "Buy Now"
                )}
              </motion.button>

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

      <PaymentMethodModal
        isOpen={showPaymentMethodModal}
        onClose={() => setShowPaymentMethodModal(false)}
        onSelectPaymentMethod={handlePaymentMethodSelect}
      />
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
                <span className="font-bold text-red-500">{title}</span>? This action cannot be undone.
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDeleteCar}
                  disabled={buttonLoading}
                  className={`px-4 py-2 rounded-lg text-white flex items-center justify-center ${
                    buttonLoading
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } transition-all min-w-[100px]`}
                >
                  {buttonLoading ? (
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={buttonLoading}
                  className={`px-4 py-2 rounded-lg ${
                    buttonLoading 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } transition-all min-w-[100px]`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ResponseHandler
        resourceName="Car"
        action={notification.action}
        error={notification.type === "error" ? { message: notification.message } : null}
        success={notification.type === "success" ? { message: notification.message } : null}
        onClear={() => setNotification({ message: "", type: "", action: "" })}
      />
      <CreateCarOwnerModal
        isOpen={showCreateCarOwnerModal}
        closeModal={() => setShowCreateCarOwnerModal(false)}
        onCreateSuccess={() => {
          setShowCreateCarOwnerModal(false);
          handleBuyNow();
        }}
      />
    </div>
  );
};

export default CarDetails;