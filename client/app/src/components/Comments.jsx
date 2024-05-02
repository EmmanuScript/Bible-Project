import React, { useState } from "react";

const CommentWithReplies = ({
  comment,
  onSubmitReply,
  onEdit,
  onDelete,
  onEditReply,
  onDeleteReply,
  editable,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [editedReplyText, setEditedReplyText] = useState("");
  const [replyToEditId, setReplyToEditId] = useState(null);
  const userId = localStorage.getItem("userId");
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleReplySubmit = async () => {
    setIsLoading(true); // Set loading state to true
    await onSubmitReply(newReply, comment._id);
    setNewReply("");
    setIsLoading(false); // Set loading state to false once operation is complete
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onEdit(editedText, comment._id);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText(comment.text);
  };

  const handleDelete = () => {
    onDelete(comment._id);
  };

  const handleEditReply = (replyId, replyText) => {
    setReplyToEditId(replyId);
    setEditedReplyText(replyText);
  };

  const handleSaveEditReply = (replyId) => {
    onEditReply(editedReplyText, comment._id, replyId);
    setReplyToEditId(null);
  };

  const handleCancelEditReply = () => {
    setReplyToEditId(null);
    setEditedReplyText("");
  };

  const handleDeleteReply = (replyId) => {
    onDeleteReply(comment._id, replyId);
  };

  const handleTextChange = (e) => {
    setEditedText(e.target.value);
  };

  const handleReplyTextChange = (e) => {
    setEditedReplyText(e.target.value);
  };

  return (
    <div className="comment-container">
      <div className="comment">
        {isLoading && <div className="loading-icon">Loading...</div>}

        <p className="comment-user">{comment.userName}</p>
        {isEditing ? (
          <textarea
            value={editedText}
            onChange={handleTextChange}
            className="edit-comment-text"
          />
        ) : (
          <p className="comment-text">{comment.text}</p>
        )}
        {editable && !isEditing && (
          <button className="edit-button" onClick={handleEdit}>
            Edit
          </button>
        )}
        {editable && isEditing && (
          <>
            <button className="save-button" onClick={handleSaveEdit}>
              Save
            </button>
            <button className="cancel-button" onClick={handleCancelEdit}>
              Cancel
            </button>
          </>
        )}
        {editable && (
          <button className="delete-button" onClick={handleDelete}>
            Delete
          </button>
        )}
        <button className="toggle-replies" onClick={toggleReplies}>
          {showReplies ? "Hide Replies" : "Show Replies"}
        </button>
      </div>
      {showReplies && (
        <div className="replies">
          {comment.replies.map((reply, index) => (
            <div className="reply" key={index}>
              <p className="reply-user">{reply.userName}</p>
              {replyToEditId === reply._id ? (
                <>
                  <textarea
                    value={editedReplyText}
                    onChange={handleReplyTextChange}
                  />
                  <button
                    className="edit-button"
                    onClick={() => handleSaveEditReply(reply._id)}
                  >
                    Save
                  </button>
                  <button onClick={handleCancelEditReply}>Cancel</button>
                </>
              ) : (
                <>
                  <p className="reply-text">{reply.text}</p>
                  {reply.userId === userId && (
                    <>
                      <button
                        className="edit-button"
                        onClick={() => handleEditReply(reply._id, reply.text)}
                      >
                        Edit
                      </button>
                      <button
                        className="edit-button"
                        onClick={() => handleDeleteReply(reply._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
          <textarea
            className="reply-input"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Add a reply..."
          ></textarea>
          <button className="reply-button" onClick={handleReplySubmit}>
            Reply
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentWithReplies;
