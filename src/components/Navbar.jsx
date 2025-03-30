import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link className="flex items-center gap-2 text-xl font-bold text-blue-800" to="/">
            <img src="/images/logo.jpg" alt="Carmela Logo" className="w-10 h-10 object-cover rounded-full" />
            <span className="animate-carEntrance">Carmela</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {["cars", "companies", "carowners", "customers", "dealerships", "about"].map((item) => (
            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }} key={item}>
              <NavLink 
                to={`/${item}`} 
                className={({ isActive }) => 
                  `nav-link ${isActive ? "text-blue-600 font-bold" : "text-gray-600"}`
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
            <>
              <AnimatePresence>
                {showWelcome && (
                  <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    transition={{ duration: 0.5 }} 
                    className="text-green-600 font-semibold"
                  >
                    Welcome, {user}!
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }} 
                onClick={logout} 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <motion.div whileHover={{ scale: 1.1 }}>
              <NavLink 
                to="/signup" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
              >
                Sign Up / Log In
              </NavLink>
            </motion.div>
          )}

          {/* Hamburger Menu */}
          <button 
            className="md:hidden text-blue-800 focus:outline-none" 
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden flex flex-col items-center space-y-4 bg-gray-100 p-4 border-t border-gray-300 shadow-lg"
          >
            {["cars", "companies", "carowners", "customers", "dealerships", "about"].map((item) => (
              <NavLink 
                key={item} 
                to={`/${item}`} 
                className={({ isActive }) => 
                  `w-full text-center py-2 ${isActive ? "text-blue-600 font-bold" : "text-gray-600"}`
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;