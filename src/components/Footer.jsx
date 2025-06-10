import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-fuchsia-50 to-purple-300 text-gray-800 ">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-4">HelpNest</h2>
          <p className="text-sm">
            A community support and wellbeing platform connecting you with verified helpers for health, care, and more.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-blue-700">Home</a></li>
            <li><a href="#" className="hover:text-blue-700">Services</a></li>
            <li><a href="#" className="hover:text-blue-700">About</a></li>
            <li><a href="#" className="hover:text-blue-700">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-3">Contact Us</h3>
          <ul className="text-sm space-y-2">
            <li>Email: support@helpnest.com</li>
            <li>Phone: +91 999999999</li>
            <li>Location: India</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-blue-600"><FaFacebookF /></a>
            <a href="#" className="hover:text-blue-600"><FaTwitter /></a>
            <a href="#" className="hover:text-blue-600"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-600"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-sm py-4 border-t border-gray-300">
        © {new Date().getFullYear()} HelpNest. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
