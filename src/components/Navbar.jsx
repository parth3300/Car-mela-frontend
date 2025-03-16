import React from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

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

        {/* Navigation Links */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {["cars", "companies", "carowners", "dealerships", "about"].map((item) => (
            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }} key={item}>
              <NavLink to={`/${item}`} className="nav-link">
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </NavLink>
            </motion.div>
          ))}
        </div>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-green-600 font-semibold">Welcome, {user}!</span>

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
              <NavLink to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all">
                Sign Up / Log In
              </NavLink>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
