import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
import Pagination from "./Pagination";

const AuthorPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { authorname } = useParams();

  useEffect(() => {
    document.title = `Seraphim Times - Articles by ${authorname}`;
    return () => {
      document.title = "Seraphim Times";
    };
  }, [authorname]);

  useEffect(() => {
    setLoading(true);
    API.get(`/news/author/${authorname}?page=${currentPage}&limit=6`)
      .then((response) => {
        setArticles(response.data.articles);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching author's articles:", error);
        setLoading(false);
      });
  }, [authorname, currentPage]);

  if (loading) {
    return <div className="text-center p-10">Loading transmissions...</div>;
  }

  return (
    <div>
      <h3 className="font-sans text-3xl font-bold mb-8 text-black">
        Transmissions by: <span className="underline">{authorname}</span>
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div
              key={article._id}
              className="bg-white p-6 rounded-none border border-black"
            >
              <Link to={`/article/${article._id}`}>
                <h5 className="font-sans text-xl font-bold text-black mb-1 hover:opacity-60">
                  {article.title}
                </h5>
              </Link>
              <p className="text-xs text-gray-600 mb-4">
                {new Date(article.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-black leading-relaxed text-sm font-mono">
                {article.content.substring(0, 150)}...
              </p>
            </div>
          ))
        ) : (
          <p className="text-black opacity-70 col-span-3">
            No articles found for this author.
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
    </div>
  );
};
export default AuthorPage;
