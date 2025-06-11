import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import UserContext from "./context/UserContext";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar.jsx";
import NewsList from "./components/NewsList.jsx";
import EditNews from "./components/EditNews.jsx";
import CreateNews from "./components/CreateNews.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ArticlePage from "./components/ArticlePage.jsx";
import AuthorPage from "./components/AuthorPage.jsx";
import SearchResultsPage from "./components/SearchResultsPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import NotFoundPage from "./components/NotFoundPage.jsx";

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const user = localStorage.getItem("user");
      if (user && user !== "undefined") {
        try {
          setUserData({ token, user: JSON.parse(user) });
        } catch (error) {
          console.error("Failed to parse user data from localStorage", error);
          localStorage.setItem("user", "");
        }
      }
    };
    checkLoggedIn();
  }, []);

  return (
    <Router>
      <UserContext.Provider value={{ userData, setUserData }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 font-mono">
          <Toaster
            position="top-right"
            toastOptions={{
              className: "font-mono",
              style: {
                border: "1px solid black",
                padding: "16px",
                color: "black",
              },
            }}
          />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<NewsList />} />
              <Route path="/edit/:id" element={<EditNews />} />
              <Route path="/create" element={<CreateNews />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/article/:id" element={<ArticlePage />} />
              <Route path="/author/:authorname" element={<AuthorPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
