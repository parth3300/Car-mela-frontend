import React from "react";
import { motion } from "framer-motion";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white mt-16 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* About Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h3 className="text-xl font-bold mb-4">About Us</h3>
          <p className="text-gray-400 leading-relaxed">
            We are a top platform for buying and selling cars, making the process seamless and hassle-free for everyone.
          </p>
        </motion.div>

        {/* Quick Links Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="text-gray-400 space-y-2">
            {[
              { label: "Home", link: "/" },
              { label: "Browse Cars", link: "/cars" },
              { label: "Sell Your Car", link: "/sell-car" },
              { label: "Support", link: "/support", icon: <ChatBubbleBottomCenterTextIcon className="h-4 w-4 mr-1" /> }
            ].map(({ label, link, icon }) => (
              <li key={label} className="hover:text-white transition-colors">
                <a href={link} className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  {icon}
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <p className="text-gray-400 mb-2">📧 support@carplatform.com</p>
          <p className="text-gray-400 mb-4">📞 +1 234 567 890</p>

          {/* Social Links */}
          <div className="flex space-x-4">
            {[
              { label: "Facebook", link: "https://facebook.com", icon: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" },
              { label: "Twitter", link: "https://twitter.com", icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" },
              { label: "Instagram", link: "https://instagram.com", icon: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z" }
            ].map(({ label, link, icon }) => (
              <a key={label} href={link} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d={icon} />
                </svg>
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-gray-800 text-center">
        <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Car Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
