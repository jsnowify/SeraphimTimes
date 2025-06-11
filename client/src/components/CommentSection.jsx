import React, { useState, useEffect, useContext } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import CommentItem from "./CommentItem";

const CommentSection = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { userData } = useContext(UserContext);

  useEffect(() => {
    if (articleId) {
      API.get(`/comments/article/${articleId}`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setComments(res.data);
          } else {
            setComments([]);
          }
        })
        .catch((err) => {
          console.error("Could not fetch comments", err);
          setComments([]);
        });
    }
  }, [articleId]);

  const handleCommentDeleted = (commentId) => {
    setComments((currentComments) =>
      currentComments.filter((c) => c._id !== commentId)
    );
  };
  const handleCommentUpdated = (updatedComment) => {
    setComments((currentComments) =>
      currentComments.map((c) =>
        c._id === updatedComment._id ? updatedComment : c
      )
    );
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const addPromise = API.post(
      `/comments/add`,
      { content: newComment, articleId: articleId },
      { headers: { "x-auth-token": userData.token } }
    );
    toast.promise(addPromise, {
      loading: "Posting comment...",
      success: (res) => {
        setComments((currentComments) => [res.data, ...currentComments]);
        setNewComment("");
        return <b>Comment posted!</b>;
      },
      error: <b>Could not post comment.</b>,
    });
  };

  return (
    <div className="mt-10">
      <h3 className="font-sans text-2xl font-bold mb-4">
        Comments ({comments.length})
      </h3>
      {userData.user ? (
        <form onSubmit={handleAddComment} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Join the discussion..."
            className="font-mono bg-white border border-black text-black text-sm rounded-none w-full p-2.5"
            rows="4"
          />
          <button
            type="submit"
            className="mt-2 text-white bg-black hover:bg-white hover:text-black border border-black font-medium text-sm px-5 py-2.5 text-center transition-colors"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <p className="mb-8 p-4 border border-black text-center">
          You must be{" "}
          <Link to="/login" className="font-bold underline">
            logged in
          </Link>{" "}
          to post a comment.
        </p>
      )}
      <div className="space-y-4">
        {Array.isArray(comments) && comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onCommentDeleted={handleCommentDeleted}
              onCommentUpdated={handleCommentUpdated}
            />
          ))
        ) : (
          <p>No comments yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};
export default CommentSection;
