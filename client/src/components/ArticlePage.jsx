import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
import CommentSection from "./CommentSection";
import SocialShare from "./SocialShare";

const ArticlePage = () => {
  const [article, setArticle] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    document.title = "Seraphim Times - Loading...";
    API.get(`/news/${id}`)
      .then((response) => {
        setArticle(response.data);
        document.title = `Seraphim Times - ${response.data.title}`;
      })
      .catch((error) => {
        console.log("Error fetching article:", error);
        document.title = "Seraphim Times - Error";
      });
    return () => {
      document.title = "Seraphim Times";
    };
  }, [id]);

  if (!article) {
    return <div className="text-center p-10">Loading transmission...</div>;
  }

  const formattedDateTime = new Date(article.createdAt).toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div>
      <div className="bg-white border border-black">
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-96 object-cover mb-8"
          />
        )}
        <div className="p-8">
          <h1 className="font-sans text-4xl font-bold text-black mb-2">
            {article.title}
          </h1>
          <div className="flex justify-between items-center text-md text-black mb-6 uppercase">
            <h2>
              By:{" "}
              <Link
                to={`/author/${article.author}`}
                className="ml-2 font-semibold hover:opacity-60 transition-opacity"
              >
                {article.author}
              </Link>
            </h2>
            <span className="font-semibold text-sm">{formattedDateTime}</span>
          </div>
          <div className="text-black text-lg leading-relaxed whitespace-pre-wrap font-mono">
            {article.content}
          </div>
          <SocialShare article={article} />
        </div>
      </div>
      <CommentSection articleId={article._id} />
    </div>
  );
};
export default ArticlePage;
