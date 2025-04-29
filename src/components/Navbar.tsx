import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signInWithDiscord, signOut, user, profile } = useAuth();

  const displayName =
    profile?.user_name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <nav className="fixed top-0 w-full z-50 bg-[rgba(10,10,10,0.8)] backdrop-blur-md border-b border-white/10 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://lsinwhoabqtxedytkfkr.supabase.co/storage/v1/object/public/post-images/Welcome%20to%20Farydrin.com-1745721283541-faylogo%20(2).png"
              alt="Faydrin Logo"
              className="h-10 w-auto"
            />
            <span className="text-white text-xl font-bold hidden sm:block">Faydrin</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { to: "/", label: "Home" },
              { to: "/create", label: "Create Post" },
              { to: "/communities", label: "Communities" },
              { to: "/community/create", label: "Create Community" }
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-300 hover:text-white hover:underline underline-offset-4 transition duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {profile?.avatar_url && (
                  <img
                    src={profile.avatar_url}
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full object-cover border-2 border-purple-500"
                  />
                )}
                <Link
                  to={`/user/${displayName}`}
                  className="text-gray-300 font-medium hover:text-white transition"
                >
                  {displayName}
                </Link>
                <button
                  onClick={signOut}
                  className="bg-gradient-to-tr from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-1.5 rounded-lg shadow transition-all duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={signInWithDiscord}
                className="bg-gradient-to-tr from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-3 py-1.5 rounded-lg shadow transition-all duration-200"
              >
                Sign in with Discord
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-300 hover:text-white focus:outline-none transition"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(10,10,10,0.95)] backdrop-blur-md border-t border-white/10">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {[
              { to: "/", label: "Home" },
              { to: "/create", label: "Create Post" },
              { to: "/communities", label: "Communities" },
              { to: "/community/create", label: "Create Community" }
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block text-gray-300 hover:text-white hover:bg-gray-800 rounded-md px-4 py-2 transition"
              >
                {link.label}
              </Link>
            ))}

            {/* User Avatar and Profile Link in Mobile Menu */}
            {user ? (
              <div className="flex items-center gap-2 pt-4 border-t border-gray-700">
                {profile?.avatar_url && (
                  <img
                    src={profile.avatar_url}
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full object-cover border-2 border-purple-500"
                  />
                )}
                <Link
                  to={`/user/${displayName}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-300 font-medium hover:text-white transition"
                >
                  {displayName}
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="w-full bg-gradient-to-tr from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-md transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  signInWithDiscord();
                }}
                className="w-full bg-gradient-to-tr from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-md transition"
              >
                Sign in with Discord
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
