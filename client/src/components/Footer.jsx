import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shirts", to: "/category/shirts" },
  { label: "Pants", to: "/category/pants" },
  { label: "Shoes", to: "/category/shoes" },
  { label: "Bags", to: "/category/bags" },
];

const CUSTOMER_SERVICE = [
  { label: "Your Orders", to: "/orders" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "Shopping Bag", to: "/cart" },
  { label: "Shipping & Returns", to: "#" },
  { label: "FAQs", to: "#" },
];

const SOCIAL_LINKS = [
  { name: "Facebook", href: "https://facebook.com", icon: FaFacebook },
  { name: "Twitter", href: "https://twitter.com", icon: FaTwitter },
  { name: "Instagram", href: "https://instagram.com", icon: FaInstagram },
];

const LEGAL_LINKS = [
  "Privacy Policy",
  "Terms of Service",
  "Cookie Policy",
  "Disclaimer",
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800/80">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              to="/"
              className="inline-block text-2xl font-serif font-extrabold text-white tracking-tight">
              EasyBuy
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Your premier destination for quality fashion and accessories.
              Curated essentials designed for everyday style and comfort.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              {SOCIAL_LINKS.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow EasyBuy on ${name}`}
                  className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 hover:bg-gray-800 transition-colors duration-200">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links" className="lg:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-white mb-4">
              Shop
            </h2>
            <ul className="space-y-3 text-sm">
              {QUICK_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-gray-400 hover:text-white transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Customer Service */}
          <nav aria-label="Customer service" className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-white mb-4">
              Customer Care
            </h2>
            <ul className="space-y-3 text-sm">
              {CUSTOMER_SERVICE.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-gray-400 hover:text-white transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-white mb-4">
              Get in Touch
            </h2>
            <address className="not-italic space-y-3.5 text-sm">
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin
                  className="w-4 h-4 text-gray-500 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>123 Fashion Street, Hyderabad, Telangana</span>
              </div>
              <div>
                <a
                  href="tel:+911234567890"
                  className="inline-flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200">
                  <Phone
                    className="w-4 h-4 text-gray-500 shrink-0"
                    aria-hidden="true"
                  />
                  <span>+91 12345 67890</span>
                </a>
              </div>
              <div>
                <a
                  href="mailto:support@easybuy.com"
                  className="inline-flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200">
                  <Mail
                    className="w-4 h-4 text-gray-500 shrink-0"
                    aria-hidden="true"
                  />
                  <span>support@easybuy.com</span>
                </a>
              </div>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-500">
          <p>© {currentYear} EasyBuy. All rights reserved.</p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((item) => (
              <li key={item}>
                <Link
                  to="#"
                  className="hover:text-gray-300 transition-colors duration-200">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
