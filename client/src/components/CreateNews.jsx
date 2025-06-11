import React, { useState, useContext, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import toast from "react-hot-toast";

const CreateNews = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const authorName = userData.user ? userData.user.fullName : "Loading...";

  useEffect(() => {
    if (!userData.user) {
      navigate("/login");
    }
  }, [userData.user, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();
    const newsArticle = { title, content, imageUrl };
    const promise = API.post("/news/add", newsArticle, {
      headers: { "x-auth-token": userData.token },
    });
    toast.promise(promise, {
      loading: "Publishing article...",
      success: () => {
        navigate("/");
        return <b>Article published!</b>;
      },
      error: <b>Could not publish article.</b>,
    });
  };

  if (!userData.user) {
    return <p>Please log in to create an article.</p>;
  }

  return (
    <div>
      <h3 className="font-sans text-3xl font-bold mb-8 text-black">
        New Transmission
      </h3>
      <form onSubmit={onSubmit}>
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-black uppercase"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            required
            className="font-mono bg-white border border-black text-black text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="imageUrl"
            className="block mb-2 text-sm font-medium text-black uppercase"
          >
            Image URL (Optional)
          </label>
          <input
            type="text"
            id="imageUrl"
            className="font-mono bg-white border border-black text-black text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-black uppercase">
            Author
          </label>
          <div className="font-mono bg-gray-100 border border-gray-400 text-gray-600 text-sm rounded-none block w-full p-2.5">
            {authorName}
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="content"
            className="block mb-2 text-sm font-medium text-black uppercase"
          >
            Content
          </label>
          <textarea
            id="content"
            required
            rows="8"
            className="font-mono bg-white border border-black text-black text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>
          <button
            type="submit"
            className="font-sans text-white bg-black hover:bg-white hover:text-black border border-black font-medium text-sm px-5 py-2.5 text-center transition-colors"
          >
            Publish Article
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreateNews;
