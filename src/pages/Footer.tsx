import { Link } from "react-router";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-800 mt-auto pt-8 pb-6 text-center text-gray-400 text-sm">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Center - Copyright */}
        <div className="flex-1 flex justify-center">
          © {new Date().getFullYear()} Brendon Sutherland. All rights reserved.
        </div>

        {/* Right - Links */}
        <div className="flex-1 flex justify-end gap-6">
          <Link
            to="/terms"
            className="hover:text-white transition-colors duration-200"
          >
            Terms of Use
          </Link>
          <Link
            to="/privacy"
            className="hover:text-white transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          <Link
            to="https://github.com/BwendyGames/Faydrin-Public"
            className="hover:text-white transition-colors duration-200"
            target="_blank"
          >
            Source Code
          </Link>
        </div>
      </div>
    </footer>
  );
};
