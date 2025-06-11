import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";
import UserContext from "../context/UserContext";
import Pagination from "./Pagination";
import ArticleSkeleton from "./ArticleSkeleton";

const NewsArticle = ({ article, deleteNewsArticle }) => {
  const { userData } = useContext(UserContext);
  const formattedDate = new Date(article.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="bg-white rounded-none border border-black flex flex-col h-full">
      {article.imageUrl && (
        <Link to={`/article/${article._id}`}>
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-48 object-cover grayscale hover:grayscale-0 transition-all duration-300"
          />
        </Link>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link to={`/article/${article._id}`}>
            <h5 className="font-sans text-xl font-bold text-black mb-1 hover:opacity-60">
              {article.title}
            </h5>
          </Link>
          <div className="flex justify-between items-center text-xs text-black mb-4 uppercase">
            <h6>
              By:{" "}
              <Link
                to={`/author/${article.author}`}
                className="ml-1 font-semibold hover:opacity-60"
              >
                {article.author}
              </Link>
            </h6>
            <span className="font-semibold">{formattedDate}</span>
          </div>
          <p className="text-black leading-relaxed font-mono text-sm">
            {article.content.substring(0, 150)}...
          </p>
        </div>
        {userData.user && userData.user.id === article.user && (
          <div className="mt-6 flex space-x-4">
            <Link
              to={`/edit/${article._id}`}
              className="px-4 py-2 bg-white text-black border border-black font-semibold hover:bg-black hover:text-white transition-colors text-sm"
            >
              Edit
            </Link>
            <button
              onClick={() => deleteNewsArticle(article._id)}
              className="px-4 py-2 bg-black text-white font-semibold hover:bg-white hover:text-black border border-black transition-colors text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    setLoading(true);
    API.get(`/news?page=${currentPage}&limit=6`)
      .then((response) => {
        // CORRECTED: Access the 'articles' array from the response object
        setNews(response.data.articles);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        toast.error("Could not fetch articles.");
      });
  }, [currentPage]);

  const deleteNewsArticle = (id) => {
    toast.promise(
      API.delete(`/news/${id}`, {
        headers: { "x-auth-token": userData.token },
      }),
      {
        loading: "Deleting...",
        success: () => {
          // CORRECTED: Also update from the nested 'articles' property
          API.get(`/news?page=${currentPage}&limit=6`).then((res) => {
            setNews(res.data.articles);
            setTotalPages(res.data.totalPages);
          });
          return <b>Article deleted!</b>;
        },
        error: <b>Could not delete.</b>,
      }
    );
  };

  return (
    <div>
      <h3 className="font-sans text-3xl font-bold mb-8 text-black">
        Latest Transmissions
      </h3>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ArticleSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* This check should now work correctly */}
            {news && news.length > 0 ? (
              news.map((currentArticle) => (
                <NewsArticle
                  article={currentArticle}
                  deleteNewsArticle={deleteNewsArticle}
                  key={currentArticle._id}
                />
              ))
            ) : (
              <p className="text-black opacity-70 col-span-full">
                No articles found.
              </p>
            )}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};
export default NewsList;
