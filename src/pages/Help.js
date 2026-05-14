import React from 'react';
import { Mail, Phone, MessageCircle, HelpCircle, ChevronRight, Globe, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Help = () => {
  const navigate = useNavigate();

  const faqs = [
    { question: "How to track my order?", answer: "Go to 'My Orders' tab and click on your active order to see live tracking on the map." },
    { question: "What is the delivery fee?", answer: "Delivery fees vary based on distance but usually range from Rs. 49 to Rs. 149. Look for 'Free Delivery' icons on selected restaurants!" },
    { question: "How can I become a vendor?", answer: "Go to the Login screen and click 'Become a Vendor' to register your restaurant with us." },
    { question: "Refund policy?", answer: "If your order is cancelled by the restaurant or rider, a full refund will be initiated to your original payment method." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-500 mx-auto mb-6">
          <HelpCircle size={44} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">How can we help?</h1>
        <p className="text-lg text-gray-600">Find answers or get in touch with our support team</p>
      </div>

      {/* Support Channels */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Mail size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Email Support</h3>
          <p className="text-sm text-gray-500 mb-4">Response within 24 hours</p>
          <a href="mailto:raqibusman9@gmail.com" className="text-orange-600 font-semibold hover:underline">
            raqibusman9@gmail.com
          </a>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
            <MessageCircle size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Live Chat</h3>
          <p className="text-sm text-gray-500 mb-4">Available 10 AM - 10 PM</p>
          <button className="bg-orange-500 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors">
            Start Chat
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Phone size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Call Center</h3>
          <p className="text-sm text-gray-500 mb-4">Emergency assistance</p>
          <p className="text-gray-900 font-bold">+92 300 0000000</p>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
        <div className="p-8 border-b border-gray-50">
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {faqs.map((faq, index) => (
            <details key={index} className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors list-none">
                <span className="font-semibold text-gray-800">{faq.question}</span>
                <ChevronRight size={20} className="text-gray-400 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Footer Support Links */}
      <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 font-medium">
        <a href="#" className="flex items-center gap-2 hover:text-gray-900 transition-colors">
          <Shield size={16} /> Privacy Policy
        </a>
        <a href="#" className="flex items-center gap-2 hover:text-gray-900 transition-colors">
          <Globe size={16} /> Terms of Service
        </a>
      </div>
    </div>
  );
};

export default Help;
