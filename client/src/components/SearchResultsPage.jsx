import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../api";
import Pagination from "./Pagination";
import ArticleSkeleton from "./ArticleSkeleton";

const SearchResultsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    if (query) {
      document.title = `Seraphim Times - Search: ${query}`;
      setLoading(true);
      const page = searchParams.get("page") || 1;
      setCurrentPage(parseInt(page));
      API.get(`/news/search?q=${query}&page=${page}&limit=6`)
        .then((response) => {
          setArticles(response.data.articles);
          setTotalPages(response.data.totalPages);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error fetching search results:", error);
          setLoading(false);
        });
    }
    return () => {
      document.title = "Seraphim Times";
    };
  }, [query, searchParams]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({ q: query, page: page });
  };

  return (
    <div>
      <h3 className="font-sans text-3xl font-bold mb-8 text-black">
        Search Results for: <span className="underline">{query}</span>
      </h3>
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ArticleSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.length > 0 ? (
              articles.map((article) => (
                <div
                  key={article._id}
                  className="bg-white rounded-none border border-black flex flex-col h-full"
                >
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
                        <h6>By: {article.author}</h6>
                        <span className="font-semibold">
                          {new Date(article.createdAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </span>
                      </div>
                      <p className="text-black leading-relaxed text-sm font-mono">
                        {article.content.substring(0, 150)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-black opacity-70 col-span-3">
                No articles found matching your search.
              </p>
            )}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};
export default SearchResultsPage;
