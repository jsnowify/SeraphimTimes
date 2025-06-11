import React, { useState, useContext } from "react";
import UserContext from "../context/UserContext";
import toast from "react-hot-toast";
import API from "../api";

const CommentItem = ({ comment, onCommentDeleted, onCommentUpdated }) => {
  const { userData } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const isOwner = userData.user && userData.user.id === comment.user;

  const handleDelete = () => {
    if (!isOwner) return;
    toast.promise(
      API.delete(`/comments/${comment._id}`, {
        headers: { "x-auth-token": userData.token },
      }),
      {
        loading: "Deleting comment...",
        success: () => {
          onCommentDeleted(comment._id);
          return <b>Comment deleted.</b>;
        },
        error: <b>Could not delete comment.</b>,
      }
    );
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!isOwner) return;
    const updatePromise = API.post(
      `/comments/update/${comment._id}`,
      { content: editedContent },
      { headers: { "x-auth-token": userData.token } }
    );
    toast.promise(updatePromise, {
      loading: "Updating comment...",
      success: (res) => {
        onCommentUpdated(res.data);
        setIsEditing(false);
        return <b>Comment updated.</b>;
      },
      error: <b>Could not update comment.</b>,
    });
  };

  const formattedDate = new Date(comment.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="border-t border-black py-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-black">{comment.authorName}</p>
          <p className="text-xs text-gray-600">{formattedDate}</p>
        </div>
        {isOwner && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm font-semibold hover:opacity-70"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button
              onClick={handleDelete}
              className="text-sm font-semibold text-red-600 hover:opacity-70"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {isEditing ? (
        <form onSubmit={handleUpdate} className="mt-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="font-mono bg-white border border-black text-black text-sm rounded-none w-full p-2.5"
            rows="3"
          />
          <button
            type="submit"
            className="mt-2 text-white bg-black hover:bg-white hover:text-black border border-black font-medium text-sm px-4 py-1.5 text-center transition-colors"
          >
            Save
          </button>
        </form>
      ) : (
        <p className="mt-2 text-black whitespace-pre-wrap">{comment.content}</p>
      )}
    </div>
  );
};
export default CommentItem;
