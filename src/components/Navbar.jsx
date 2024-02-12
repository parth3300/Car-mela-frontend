import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="">
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link className="flex items-center gap-2" to="/">
            <img
              src="/images/logo.jpg"
              alt=""
              className="w-8 h-8 object-cover rounded-[50%]"
            />
            <span className="animate-carEntrance">Carmela</span>
          </Link>

          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden  focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-2 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <NavLink
                  to="cars"
                  className="block py-2 px-3 text-white bg-blue-700 rounded-xl md:bg-transparent md:text-blue-700 md:p-2 dark:text-white md:dark:text-blue-500 hover:text-white hover:bg-green-600 "
                  
                >
                  Cars
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="companies"
                  className="block py-2 px-3 text-white bg-blue-700 rounded-xl md:bg-transparent md:text-blue-700 md:p-2 dark:text-white md:dark:text-blue-500 hover:text-white hover:bg-green-600"
                 
                >
                  Company
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="carowners"
                  className="block py-2 px-3 text-white bg-blue-700 rounded-xl md:bg-transparent md:text-blue-700 md:p-2 dark:text-white md:dark:text-blue-500 hover:text-white hover:bg-green-600"
                  
                >
                  Carowner
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="dealerships"
                  className="block py-2 px-3 text-white bg-blue-700 rounded-xl md:bg-transparent md:text-blue-700 md:p-2 dark:text-white md:dark:text-blue-500 hover:text-white hover:bg-green-600"
                  
                >
                  Dealership
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="signup"
                  className="block py-2 px-3 text-white bg-blue-700 rounded-xl md:bg-transparent md:text-blue-700 md:p-2 dark:text-white md:dark:text-blue-500 hover:text-white hover:bg-green-600"
                  
                >
                  Sign Up/Log in
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="about"
                  className="block py-2 px-3 text-white bg-blue-700 rounded-xl md:bg-transparent md:text-blue-700 md:p-2 dark:text-white md:dark:text-blue-500 hover:text-white hover:bg-green-600"
                  
                >
                  About
                </NavLink>
              </li>              
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
