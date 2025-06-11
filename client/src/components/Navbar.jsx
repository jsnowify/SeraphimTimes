import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const SearchForm = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="font-mono bg-white border border-black text-black text-sm rounded-none focus:ring-black focus:border-black block w-full px-2 py-1"
      />
    </form>
  );
};

const Navbar = () => {
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    setUserData({ token: undefined, user: undefined });
    localStorage.setItem("auth-token", "");
    localStorage.setItem("user", "");
    navigate("/login");
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="border-b border-black py-4 mb-8 sm:mb-10">
      <div className="flex justify-between items-center">
        <Link
          to="/"
          className="font-sans text-xl sm:text-2xl font-bold text-black flex-shrink-0"
        >
          Seraphim Times
        </Link>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="w-full max-w-xs">
            <SearchForm />
          </div>
          <div className="flex items-center flex-shrink-0">
            <ul className="flex space-x-6">
              {userData.user ? (
                <>
                  <li>
                    <Link
                      to="/profile"
                      className="font-semibold text-black hover:opacity-60 transition-opacity"
                    >
                      /profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/create"
                      className="font-semibold text-black hover:opacity-60 transition-opacity"
                    >
                      /create
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="font-semibold text-black hover:opacity-60 transition-opacity"
                    >
                      /logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="font-semibold text-black hover:opacity-60 transition-opacity"
                    >
                      /login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="font-semibold text-black hover:opacity-60 transition-opacity"
                    >
                      /register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className={`md:hidden mt-4 ${isOpen ? "block" : "hidden"}`}>
        <div className="mb-4">
          <SearchForm />
        </div>
        <ul className="flex flex-col items-start space-y-3">
          {userData.user ? (
            <>
              <li>
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="font-semibold text-black hover:opacity-60 transition-opacity"
                >
                  /profile
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  onClick={closeMenu}
                  className="font-semibold text-black hover:opacity-60 transition-opacity"
                >
                  /create
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="font-semibold text-black hover:opacity-60 transition-opacity"
                >
                  /logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="font-semibold text-black hover:opacity-60 transition-opacity"
                >
                  /login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="font-semibold text-black hover:opacity-60 transition-opacity"
                >
                  /register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
