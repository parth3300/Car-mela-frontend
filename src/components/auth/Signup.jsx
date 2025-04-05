import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../Constants/constant";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  // Create refs for each input field
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // If there's a next field, focus it
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      } 
      // If we're on the last field and all fields are filled, submit
      else if (isFormFilled()) {
        handleSignup();
      }
    }
  };

  // Check if all form fields are filled
  const isFormFilled = () => {
    return (
      formData.first_name.trim() &&
      formData.last_name.trim() &&
      formData.email.trim() &&
      formData.username.trim() &&
      formData.password.trim()
    );
  };

  const handleSignup = async () => {
    setLoading(true);
    setMessage(null);
    setErrors({});

    try {
      const signupResponse = await fetch(`${BACKEND_URL}/auth/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const signupData = await signupResponse.json();

      if (signupResponse.ok) {
        setMessage("✅ User registered successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrors(signupData);
      }
    } catch (err) {
      setErrors({ network: "❌ Network error. Please try again." });
    }

    setLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-50 overflow-hidden px-4">
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Overlay */}
      <AnimatePresence>
        {message && (
          <motion.div
            className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <CheckCircle size={48} className="text-green-600" />
              <motion.p
                className="text-lg font-semibold text-green-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {message}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signup Card */}
      <motion.div
        className="relative flex flex-col items-center gap-4 justify-center bg-white p-8 w-full max-w-md rounded-2xl shadow-2xl z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-3xl font-extrabold text-blue-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Create Account
        </motion.h2>

        {/* Feedback Messages */}
        <div className="w-full space-y-2">
          <AnimatePresence>
            {Object.keys(errors).length > 0 && (
              <motion.div
                className="w-full bg-red-50 text-red-600 p-3 rounded-lg text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {Object.entries(errors).map(([key, messages]) => (
                  <p key={key}>
                    <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                    {Array.isArray(messages) ? messages.join(" ") : messages}
                  </p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fields */}
        <div className="w-full space-y-6">
          {/* First Name */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <input
              ref={firstNameRef}
              type="text"
              name="first_name"
              id="first_name"
              value={formData.first_name}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, lastNameRef)}
              placeholder=" "
              required
              className="peer w-full border border-gray-300 rounded-md bg-transparent px-3 pt-5 pb-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <label
              htmlFor="first_name"
              className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              First Name
            </label>
          </motion.div>

          {/* Last Name */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <input
              ref={lastNameRef}
              type="text"
              name="last_name"
              id="last_name"
              value={formData.last_name}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, emailRef)}
              placeholder=" "
              required
              className="peer w-full border border-gray-300 rounded-md bg-transparent px-3 pt-5 pb-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <label
              htmlFor="last_name"
              className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Last Name
            </label>
          </motion.div>

          {/* Email */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <input
              ref={emailRef}
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, usernameRef)}
              placeholder=" "
              required
              className="peer w-full border border-gray-300 rounded-md bg-transparent px-3 pt-5 pb-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Email
            </label>
          </motion.div>

          {/* Username */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <input
              ref={usernameRef}
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, passwordRef)}
              placeholder=" "
              required
              className="peer w-full border border-gray-300 rounded-md bg-transparent px-3 pt-5 pb-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <label
              htmlFor="username"
              className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Username
            </label>
          </motion.div>

          {/* Password */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <input
              ref={passwordRef}
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, null)}
              placeholder=" "
              required
              className="peer w-full border border-gray-300 rounded-md bg-transparent px-3 pt-5 pb-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Password
            </label>
          </motion.div>
        </div>

        {/* Signup Button */}
        <motion.button
          onClick={handleSignup}
          disabled={loading}
          className={`w-full p-3 rounded-lg text-white mt-4 transition duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          whileHover={!loading ? { scale: 1.03 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          transition={{ duration: 0.2 }}
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin inline-block mr-2" />
              Signing up...
            </>
          ) : (
            "Sign Up"
          )}
        </motion.button>

        {/* Login Link */}
        <motion.p
          className="mt-3 text-gray-600 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Signup;