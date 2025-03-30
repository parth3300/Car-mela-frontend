import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon, ChatBubbleLeftRightIcon, PaperAirplaneIcon, UserIcon } from '@heroicons/react/24/solid';
import Notification from './Globle/Notification';
import { jwtDecode } from "jwt-decode";
import { BACKEND_URL } from '../Constants/constant';

// Helper function to get CSRF token
const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const Support = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [faqs, setFaqs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState('');
  const [newReview, setNewReview] = useState({
    ratings: 0,
    comment: '',
    name: ''
  });
  const [notification, setNotification] = useState({
    message: '',
    type: ''
  });
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [faqResponse, reviewResponse] = await Promise.all([
          axios.get(`${BACKEND_URL}/store/faqs/`),
          axios.get(`${BACKEND_URL}/store/reviews/`)
        ]);
        setFaqs(faqResponse.data);
        setReviews(reviewResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setNotification({
          message: 'Failed to load support data. Please try again later.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      const response = await axios.post(`${BACKEND_URL}/store/faqs/`, {
        question: newQuestion
      });
      setFaqs([...faqs, response.data]);
      setNewQuestion('');
      setNotification({
        message: 'Your question has been submitted!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error submitting question:', error);
      setNotification({
        message: 'Failed to submit question. Please try again.',
        type: 'error'
      });
    }
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

      if (authToken) {
        const decoded = jwtDecode(authToken);
        const userName = decoded?.username || "Authenticated User";

        formData.append("name", userName);
      } else {
        if (!newReview.name.trim()) {
          setNotification({
            message: "Please provide your name!",
            type: "error",
          });
          return;
        }
        formData.append("user_name", newReview.name);
      }

      const response = await axios.post(`${BACKEND_URL}/store/reviews/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
      });

      setReviews([...reviews, response.data]);
      setNotification({
        message: "Review submitted successfully! 🎉",
        type: "success",
      });
      setNewReview({ ratings: 0, comment: "", name: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
      setNotification({
        message: "Failed to submit review. Please try again.",
        type: "error",
      });
    }
  };

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Support Center</h1>
          <p className="text-xl text-gray-600">How can we help you today?</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${activeTab === 'faq' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-2" />
            FAQs
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <StarIcon className="h-5 w-5 inline mr-2" />
            Customer Reviews
          </button>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification.message && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification({ message: '', type: '' })}
            />
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse h-20"></div>
            ))}
          </div>
        )}

        {/* FAQ Section */}
        {!loading && activeTab === 'faq' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4 mb-8">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                  >
                    <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                    <svg
                      className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {expandedFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-6 pb-6 pt-0"
                      >
                        <p className="text-gray-600">{faq.answer || 'Our team will answer this question soon.'}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Ask Question Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ask a Question</h3>
              <form onSubmit={handleSubmitQuestion}>
                <div className="mb-4">
                  <label htmlFor="question" className="sr-only">Your Question</label>
                  <textarea
                    id="question"
                    rows="3"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 border"
                    placeholder="Type your question here..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                  Submit Question
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Reviews Section */}
        {!loading && activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6 mb-8">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {review.user_name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          {review.user_name || 'Anonymous User'}
                        </h4>
                        <div className="flex mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={`h-5 w-5 ${star <= review.ratings ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.description}</p>
                    <p className="text-sm text-gray-500 mt-3">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>

            {/* Submit Review Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Share Your Experience</h3>
              <form onSubmit={handleSubmitReview}>
                {!localStorage.getItem("authToken") && (
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                        placeholder="Your name"
                        value={newReview.name}
                        onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                        required={!localStorage.getItem("authToken")}
                      />
                    </div>
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, ratings: star })}
                        className="focus:outline-none"
                      >
                        <StarIcon
                          className={`h-8 w-8 ${star <= newReview.ratings ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="review" className="sr-only">Your Review</label>
                  <textarea
                    id="review"
                    rows="3"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 border"
                    placeholder="Share your experience with us..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Support;