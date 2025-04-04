import React from "react";
import { Link } from "react-router-dom";
import { 
  ChatBubbleBottomCenterTextIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  LinkIcon
} from "@heroicons/react/24/outline";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { name: "Cars", href: "/cars" },
    { name: "Companies", href: "/companies" },
    { name: "Car Owners", href: "/carowners" },
    { name: "Customers", href: "/customers" },
    { name: "Dealerships", href: "/dealerships" },
    { name: "About", href: "/about" },
    { name: "Support", href: "/support" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: ShareIcon, href: "#" },
    { name: "Twitter", icon: ChatBubbleLeftRightIcon, href: "#" },
    { name: "Instagram", icon: PhotoIcon, href: "#" },
    { name: "LinkedIn", icon: LinkIcon, href: "#" },
  ];

  return (
    <footer className="bg-dark-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/images/logo.jpg" alt="Carmela Logo" className="w-10 h-10 object-cover rounded-full" />
              <span className="text-xl font-bold text-gradient font-display">Carmela</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Your trusted car marketplace. Find, buy, and sell vehicles with ease.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label={item.name}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-primary-400 mt-0.5" />
                <span className="text-gray-400">123 Car Street, Auto City, AC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 text-primary-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <EnvelopeIcon className="h-5 w-5 text-primary-400" />
                <span className="text-gray-400">info@carmela.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest car listings and updates.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="input bg-dark-800 border-dark-700 text-white placeholder-gray-500 flex-grow"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dark-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Carmela. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-primary-400 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-primary-400 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-primary-400 text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 