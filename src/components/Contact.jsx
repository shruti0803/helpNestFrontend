import React from 'react';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const Contact = () => {
  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-[#f9f9f9] px-4 py-12">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-xl shadow-lg overflow-hidden">

        {/* LEFT SIDE - Contact Details */}
        <div className="bg-gradient-to-r from-fuchsia-50 to-purple-300  p-8 md:w-1/2 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-6 font-sans">Contact Details</h2>

          <div className="space-y-5 text-base">
            <div className="flex items-start gap-3">
              <FiPhone size={22} className="mt-1" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="opacity-90 text-sm">+91 12345 67890</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiMail size={22} className="mt-1" />
              <div>
                <p className="font-medium">Email</p>
                <p className="opacity-90 text-sm">support@example.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiMapPin size={22} className="mt-1" />
              <div>
                <p className="font-medium">Location</p>
                <p className="opacity-90 text-sm">Bhopal, Madhya Pradesh, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Contact Form */}
        <div className="bg-white p-8 md:w-1/2">
          <h2 className="text-3xl font-semibold text-purple-500 mb-2 font-sans">Get in Touch</h2>
          <p className="text-gray-600 text-sm mb-6">We’d love to hear from you. Please fill out the form below.</p>

          <form className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
            />

            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-md text-sm font-medium hover:bg-purple-800 transition"
            >
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
