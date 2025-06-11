import React, { useState, useEffect, useContext } from "react";
import API from "../api";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import toast from "react-hot-toast";

const EditNews = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { userData } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/news/${id}`)
      .then((response) => {
        setTitle(response.data.title);
        setContent(response.data.content);
        setImageUrl(response.data.imageUrl || "");
      })
      .catch((error) => console.log(error));
  }, [id]);

  const onSubmit = (e) => {
    e.preventDefault();
    const newsArticle = { title, content, imageUrl };
    const promise = API.post(`/news/update/${id}`, newsArticle, {
      headers: { "x-auth-token": userData.token },
    });
    toast.promise(promise, {
      loading: "Updating article...",
      success: () => {
        navigate(`/article/${id}`);
        return <b>Article updated!</b>;
      },
      error: <b>Could not update article.</b>,
    });
  };

  return (
    <div>
      <h3 className="font-sans text-3xl font-bold mb-8 text-black">
        Edit Transmission
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-mono bg-white border border-black text-black text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5"
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
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="font-mono bg-white border border-black text-black text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5"
          />
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="font-mono bg-white border border-black text-black text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5"
          />
        </div>
        <div>
          <button
            type="submit"
            className="font-sans text-white bg-black hover:bg-white hover:text-black border border-black font-medium text-sm px-5 py-2.5 text-center transition-colors"
          >
            Update Article
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditNews;
