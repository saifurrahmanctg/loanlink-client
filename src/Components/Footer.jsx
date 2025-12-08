import { Link } from "react-router";
import logo from "../assets/main-logo.png";

export default function Footer() {
  return (
    <footer className="bg-base-200 border-t border-base-300">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LOGO + DESCRIPTION */}
        <div>
          <Link to="/">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </Link>
          <p className="text-gray-600 leading-relaxed mt-4 text-justify">
            LoanLink helps you request, manage, and track microloans quickly and
            securely. Your smart companion for faster approvals.
          </p>
        </div>

        {/* USEFUL LINKS */}
        <div>
          <h3 className="text-2xl font-semibold my-3 font-rajdhani">
            Useful Links
          </h3>
          <ul className="space-y-2 text-gray-600 ">
            <li>
              <Link to="/" className="hover:text-[#3BADE3] transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/all-loans" className="hover:text-[#3BADE3] transition">
                All Loans
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#3BADE3] transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#3BADE3] transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT & EXTRA LINKS (OPTIONAL) */}
        <div>
          <h3 className="text-2xl font-semibold my-3 font-rajdhani">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="/faq" className="hover:text-[#3BADE3] transition">
                FAQs
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className="hover:text-[#3BADE3] transition"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-[#3BADE3] transition">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-[#3BADE3] transition">
                Help & Support
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT BAR */}
      <div className="border-t border-base-300 py-4 text-center text-gray-600 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()}
        <span className="font-semibold mx-1">LoanLink</span>— All rights
        reserved.
      </div>
    </footer>
  );
}
