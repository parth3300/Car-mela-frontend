import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../Constants/constant";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextFieldRef) {
        nextFieldRef.current.focus();
      } else if (formData.username && formData.password) {
        handleLogin();
      }
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/auth/jwt/create/`, formData);

      if (response.data.access) {
        login(response.data.access, formData.username);
        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError("Login failed. No token returned.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.detail) {
          setError(data.detail);
        } else if (data.non_field_errors) {
          setError(data.non_field_errors.join(" "));
        } else {
          const fieldErrors = Object.entries(data)
            .map(([field, errors]) => `${field}: ${errors.join(" ")}`)
            .join(" ");
          setError(fieldErrors);
        }
      } else {
        setError("Please check your internet connection!.");
      }
      console.error("Login error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white overflow-hidden">
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
                Login successful! Redirecting...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Card */}
      <motion.div
        className="relative flex flex-col gap-6 justify-center bg-white px-10 py-12 w-96 rounded-3xl shadow-xl border border-blue-100 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-4xl font-extrabold text-blue-800 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Welcome Back 👋
        </motion.h2>

        {/* Feedback Messages */}
        <div className="text-center space-y-2">
          <AnimatePresence>
            {error && (
              <motion.div
                className="flex items-center gap-2 text-red-600 text-sm font-medium justify-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <XCircle size={18} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {message && (
              <motion.div
                className="flex items-center gap-2 text-green-600 text-sm font-medium justify-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CheckCircle size={18} /> {message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Form Inputs with Floating Labels */}
        <div className="space-y-6">
          {/* Username */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <input
              ref={usernameRef}
              type="text"
              name="username"
              id="username"
              placeholder=" "
              value={formData.username}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, passwordRef)}
              className="peer w-full border border-gray-300 rounded-md bg-transparent px-3 pt-5 pb-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <label
              htmlFor="username"
              className="absolute left-3 top-2 text-sm text-gray-500 transition-all
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Username
            </label>
          </motion.div>

          {/* Password */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <input
              ref={passwordRef}
              type="password"
              name="password"
              id="password"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, null)}
              className="peer w-full border border-gray-300 rounded-md bg-transparent px-3 pt-5 pb-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-2 text-sm text-gray-500 transition-all
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Password
            </label>
          </motion.div>
        </div>

        {/* Login Button */}
        <motion.button
          onClick={handleLogin}
          disabled={loading}
          className={`flex justify-center items-center gap-2 w-full py-3 rounded-xl text-white text-lg font-semibold transition duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
          }`}
          whileHover={!loading ? { scale: 1.03 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          transition={{ duration: 0.2 }}
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Logging in...
            </>
          ) : (
            "Login"
          )}
        </motion.button>

        {/* Sign Up Link */}
        <motion.p
          className="text-sm text-gray-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline font-semibold">
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;