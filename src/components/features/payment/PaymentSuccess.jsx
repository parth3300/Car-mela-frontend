import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Download, X } from "lucide-react";
import { BACKEND_URL } from "../../../Constants/constant";
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfGenerator from "../../PdfGenerator";

// // PDF Generator Component


// Main Payment Success Component
const PaymentSuccess = () => {
  const [paymentStatus, setPaymentStatus] = useState({
    loading: true,
    success: false,
    error: null,
    carDetails: null,
    paymentDetails: null,
    customerDetails: null
  });

  const navigate = useNavigate();
  const location = useLocation();
  const hasFetched = useRef(false);
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  const verifyPayment = async () => {
    try {
      if (!sessionId || hasFetched.current) return;
      hasFetched.current = true;

      const authToken = localStorage.getItem("authToken");
      if (!authToken) throw new Error("User not authenticated");

      const response = await axios.get(`${BACKEND_URL}/store/verify-payment/${sessionId}/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const carDetails = await axios.get(`${BACKEND_URL}/store/cars/${response?.data?.car_id}/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const carOwnerDetails = await axios.get(`${BACKEND_URL}/store/carowners/${response?.data?.carowner_id}/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // Extract only the needed properties from the payment intent
      const paymentIntent = response.data.session.payment_intent;
      const amountTotal = response.data.session.amount_total / 100;

      
      setPaymentStatus({
        loading: false,
        success: true,
        error: null,
        carDetails: carDetails.data,
        paymentDetails: {
          transactionId: typeof paymentIntent === 'object' ? paymentIntent.id : paymentIntent,
          amount: amountTotal,
          date: new Date().toISOString(),
        },
        customerDetails: carOwnerDetails.data
      });
    } catch (error) {
      console.error("Payment verification failed:", error);
      setPaymentStatus({
        loading: false,
        success: false,
        error: error.response?.data?.message || "Payment verification failed",
        carDetails: null,
        paymentDetails: null,
        customerDetails: null
      });
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [sessionId]);

  const handleClose = () => {
    navigate("/");
  };

  if (paymentStatus.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verifying Your Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we confirm your purchase...
          </p>
        </motion.div>
      </div>
    );
  }

    console.log('paymentStatus',paymentStatus);
    
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto relative"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Close"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>

        {paymentStatus.success ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="mb-6 p-4 bg-green-100 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Payment Successful!
                </h1>
                <p className="mt-3 text-lg text-gray-500">
                  Thank you for your purchase
                </p>
              </div>

              {paymentStatus.carDetails && (
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Your New Car
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={
                          paymentStatus.carDetails.image ||
                          "https://via.placeholder.com/300"
                        }
                        alt={paymentStatus.carDetails.title}
                        className="h-40 w-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {paymentStatus.carDetails.title}{" "}
                        {paymentStatus.carDetails.carmodel}
                      </h3>
                      <div className="mt-2 flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-5 w-5 ${
                                i < paymentStatus.carDetails.average_rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600">
                          ({paymentStatus.carDetails.ratings}/5)
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">
                        ${paymentStatus.carDetails.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10 border-t border-gray-200 pt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Transaction ID</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {paymentStatus.paymentDetails?.transactionId || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Amount Paid</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      ${paymentStatus.paymentDetails?.amount?.toLocaleString() || '0.00'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(paymentStatus.paymentDetails?.date).toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {paymentStatus.customerDetails?.name || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-gray-200 pt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Next Steps
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          className="h-3 w-3 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="ml-3 text-gray-700">
                      You'll receive a confirmation email with your purchase
                      details
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          className="h-3 w-3 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="ml-3 text-gray-700">
                      Your car will be prepared for delivery within 3-5 business
                      days
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          className="h-3 w-3 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="ml-3 text-gray-700">
                      A representative will contact you to schedule delivery
                    </p>
                  </li>
                </ul>
              </div>

              {/* Updated Button Section */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/cars")}
                  className="flex-1 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Browse More Cars
                </button>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => navigate(`/cars/${paymentStatus.carDetails.id}`)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Your Orders
                  </button>
                  {paymentStatus.carDetails && paymentStatus.customerDetails && paymentStatus.paymentDetails && (
                    <PDFDownloadLink
                      document={
                        <PdfGenerator
                          carDetails={paymentStatus.carDetails}
                          customerDetails={paymentStatus.customerDetails}
                          paymentDetails={paymentStatus.paymentDetails}
                        />
                      }
                      fileName={`purchase-confirmation-for-${paymentStatus.carDetails.title}-${paymentStatus.paymentDetails.transactionId}.pdf`}
                      className="flex-1"
                    >
                      {({ loading }) => (
                        <button
                          className="w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 inline-flex items-center justify-center"
                        >
                          <Download className="h-5 w-5 mr-2" />
                          {loading ? 'Generating...' : 'Download PDF'}
                        </button>
                      )}
                    </PDFDownloadLink>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 sm:p-10 text-center">
              <div className="mb-6 p-4 bg-red-100 rounded-full inline-flex">
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-3">
                Payment Verification Failed
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {paymentStatus.error ||
                  "We couldn't verify your payment. Please check your account or contact support."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to Home Page
                </button>
                <button
                  onClick={() => navigate("/support")}
                  className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;