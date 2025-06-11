import React, { useState, useEffect, useContext } from "react";
import API from "../api";
import toast from "react-hot-toast";
import UserContext from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import Pagination from "./Pagination";

const ProfileArticleItem = ({ article }) => (
  <div className="border-b border-black py-4 flex justify-between items-center">
    <div>
      <Link to={`/article/${article._id}`}>
        <h5 className="font-sans text-xl font-bold text-black hover:opacity-60">
          {article.title}
        </h5>
      </Link>
      <p className="text-sm text-gray-600">
        Created on: {new Date(article.createdAt).toLocaleDateString()}
      </p>
    </div>
    <Link
      to={`/edit/${article._id}`}
      className="px-4 py-2 bg-white text-black border border-black font-semibold text-sm hover:bg-black hover:text-white transition-colors flex-shrink-0"
    >
      Edit
    </Link>
  </div>
);

const ProfilePage = () => {
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    username: "",
  });
  const [myArticles, setMyArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Seraphim Times - My Profile";
  }, []);

  useEffect(() => {
    if (!userData.token) {
      navigate("/login");
      return;
    }
    const fetchAllData = async () => {
      setLoading(true);
      const profilePromise = API.get("/users/", {
        headers: { "x-auth-token": userData.token },
      });
      const articlesPromise = API.get(
        `/news/my-articles?page=${currentPage}&limit=5`,
        { headers: { "x-auth-token": userData.token } }
      );
      try {
        const [profileRes, articlesRes] = await Promise.all([
          profilePromise,
          articlesPromise,
        ]);
        setProfileData(profileRes.data);
        setMyArticles(articlesRes.data.articles);
        setTotalPages(articlesRes.data.totalPages);
      } catch (error) {
        console.error("Could not fetch profile data or articles", error);
        toast.error("Could not fetch your data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [userData.token, navigate, currentPage]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const updateData = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      middleName: profileData.middleName,
    };
    const updatePromise = API.post("/users/update", updateData, {
      headers: { "x-auth-token": userData.token },
    });
    toast.promise(updatePromise, {
      loading: "Updating profile...",
      success: (res) => {
        const updatedUser = {
          ...userData.user,
          fullName: res.data.user.fullName,
        };
        setUserData({ ...userData, user: updatedUser });
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return <b>Profile updated successfully!</b>;
      },
      error: <b>Could not update profile.</b>,
    });
  };

  if (loading) {
    return <div>Loading Profile...</div>;
  }

  return (
    <div>
      <h3 className="font-sans text-3xl font-bold mb-8 text-black">
        My Profile
      </h3>
      <div className="bg-white p-6 rounded-none border border-black mb-10">
        <h4 className="font-sans text-2xl font-bold mb-4">
          Profile Information
        </h4>
        <form onSubmit={handleProfileUpdate}>
          <div className="grid md:grid-cols-2 md:gap-6 mb-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-black uppercase">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange}
                required
                className="font-mono bg-white border border-black text-black text-sm rounded-none w-full p-2.5"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-black uppercase">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange}
                required
                className="font-mono bg-white border border-black text-black text-sm rounded-none w-full p-2.5"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-black uppercase">
              Middle Name (Optional)
            </label>
            <input
              type="text"
              name="middleName"
              value={profileData.middleName || ""}
              onChange={handleProfileChange}
              className="font-mono bg-white border border-black text-black text-sm rounded-none w-full p-2.5"
            />
          </div>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-black uppercase">
                Username
              </label>
              <p className="font-mono bg-gray-100 p-2.5 border border-gray-400 text-gray-500">
                {profileData.username}
              </p>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-black uppercase">
                Email
              </label>
              <p className="font-mono bg-gray-100 p-2.5 border border-gray-400 text-gray-500">
                {profileData.email}
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="font-sans text-white bg-black hover:bg-white hover:text-black border border-black font-medium text-sm px-5 py-2.5 text-center transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
      <div>
        <h4 className="font-sans text-2xl font-bold mb-4">My Transmissions</h4>
        {myArticles.length > 0 ? (
          myArticles.map((article) => (
            <ProfileArticleItem key={article._id} article={article} />
          ))
        ) : (
          <p className="text-black opacity-70">
            You have not created any articles yet.
          </p>
        )}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};
export default ProfilePage;
