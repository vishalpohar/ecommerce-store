import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {FaFacebook, FaInstagram, FaTwitter} from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Brand Section */}
        <div className="flex flex-col items-center gap-5 mb-5">
          <span className="inline-flex text-xl font-bold">EasyBuy</span>
          <p className="text-gray-400 text-center leading-relaxed">
            Your premier destination for quality fashion and accessories. We're
            committed to bringing you the latest trends with exceptional
            service.
          </p>
          <ul className="list-none flex items-center gap-4">
            <li className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200">
              <FaFacebook className="w-5 h-5" />
            </li>
            <li className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200">
              <FaTwitter className="w-5 h-5" />
            </li>
            <li className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200">
              <FaInstagram className="w-5 h-5" />
            </li>
          </ul>
        </div>
        <div className="flex gap-10 flex-wrap">
          {/* Quick Links */}
          <div className="flex-1 px-4">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {["Home", "Shop", "Categories", "New Arrivals", "Sale"].map(
                (item) => (
                  <li
                    key={item}
                    className="text-gray-400 hover:text-white transition-colors duration-200">
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="flex-1 px-4">
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-3">
              {[
                "Contact Us",
                "Shipping Info",
                "Returns",
                "Size Guide",
                "FAQs",
              ].map((item) => (
                <li
                  key={item}
                  className="text-gray-400 hover:text-white transition-colors duration-200">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex-1 px-4">
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>123 Fashion Street, Style City</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5" />
                <span>+91 1234567890</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5" />
                <span>support@easybuy.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2024 Ecommerce Store. All rights reserved.
            </p>
            <ul className="list-none flex flex-wrap justify-center gap-6 text-sm">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Disclaimer",
              ].map((item) => (
                <li
                  key={item}
                  className="text-gray-400 hover:text-white transition-colors duration-200">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
