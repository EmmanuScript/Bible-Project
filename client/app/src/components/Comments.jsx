import React, { useState } from "react";

const CommentWithReplies = ({ comment, onSubmitReply }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [newReply, setNewReply] = useState("");

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleReplySubmit = () => {
    // Call the onSubmitReply function passed from the parent component
    onSubmitReply(newReply);
    // Clear the input field after submitting
    setNewReply("");
  };

  return (
    <div className="comment">
      <p>{comment.userName}</p>
      <br />
      <p>{comment.text}</p>
      <button onClick={toggleReplies}>
        {showReplies ? "Hide Replies" : "Show Replies"}
      </button>
      {showReplies && (
        <div className="replies">
          {comment.replies.map((reply, index) => (
            <p key={index}>
              {reply.userName}
              {reply.text}
            </p>
          ))}
          {/* Text box for inputting a new reply */}
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Add a reply..."
          ></textarea>
          <button onClick={handleReplySubmit}>Reply</button>
        </div>
      )}
    </div>
  );
};

export default CommentWithReplies;
