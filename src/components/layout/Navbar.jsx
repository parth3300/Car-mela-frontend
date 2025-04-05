import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { XMarkIcon, Bars3Icon, UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-soft sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link className="flex items-center gap-2 text-xl font-bold" to="/">
              <img src="/images/logo.jpg" alt="Carmela Logo" className="w-10 h-10 object-cover rounded-full shadow-md" />
              <span className="text-gradient font-display">Carmela</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {["cars", "companies", "carowners", "customers", "dealerships", "about"].map((item) => (
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                transition={{ type: "spring", stiffness: 300 }} 
                key={item}
              >
                <NavLink 
                  to={`/${item}`} 
                  className={({ isActive }) => 
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </NavLink>
              </motion.div>
            ))}
          </div>

          {/* Auth & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-dark-700 hover:text-primary-600 transition-colors"
                >
                  <UserCircleIcon className="h-8 w-8 text-primary-600" />
                  <span className="hidden md:inline font-medium">{user}</span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-soft py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-dark-900">Signed in as</p>
                        <p className="text-sm text-dark-600 truncate">{user}</p>
                      </div>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                          navigate("/", { replace: true }); // Redirects to home page
                          window.location.reload(); // Optional: if you really need a hard reload
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <NavLink 
                  to="/signup" 
                  className="btn-primary"
                >
                  Sign Up / Log In
                </NavLink>
              </motion.div>
            )}

            {/* Hamburger Menu */}
            <button 
              className="md:hidden text-dark-700 hover:text-primary-600 focus:outline-none transition-colors" 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <XMarkIcon className="w-8 h-8" />
              ) : (
                <Bars3Icon className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-soft"
          >
            <div className="container-custom py-4 space-y-1">
              {["cars", "companies", "carowners", "customers", "dealerships", "about"].map((item) => (
                <NavLink 
                  key={item} 
                  to={`/${item}`} 
                  className={({ isActive }) => 
                    `block px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? "bg-primary-50 text-primary-700 font-medium" 
                        : "text-dark-700 hover:bg-gray-50"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Message */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-md z-50"
          >
            <p className="text-sm font-medium">Welcome back, {user}!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;