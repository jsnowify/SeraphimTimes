import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="text-center py-20">
      <h1 className="font-sans text-9xl font-bold text-black">404</h1>
      <h2 className="font-sans text-3xl font-bold mt-4 mb-2 text-black">
        Page Not Found
      </h2>
      <p className="text-black mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="font-sans text-white bg-black hover:bg-white hover:text-black border border-black font-medium text-sm px-5 py-2.5 text-center transition-colors"
      >
        Return to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
