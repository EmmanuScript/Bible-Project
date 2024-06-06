import React, { useState, useEffect } from "react";
import CommentWithReplies from "../components/Comments";
import { useParams } from "react-router-dom";
import { DATA_URL } from "../config";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SpinnerImage from "../assets/ZKZg.gif";

const CommentList = ({ verseId }) => {
  const { bookId, id } = useParams();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true); // Set loading state to true initially
  const [commentText, setCommentText] = useState(""); // State to store the user's comment
  const [userComment, setUserComment] = useState(null); // State to store user's existing comment, if any

  console.log(bookId, id);

  useEffect(() => {
    // Fetch comments data from the API
    fetchCommentsData();
    // Check if the user has already posted a comment for the current verse
    // checkUserComment();
  }, []);

  const uid = localStorage.getItem("userId");

  const fetchCommentsData = async () => {
    try {
      // Make API call to fetch comments data
      setLoading(true);
      const token = Cookies.get("jwt");
      const response = await axios.get(`${DATA_URL}api/verse/${id}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        throw new Error("Failed to fetch comments");
      }
      setComments(response.data);

      // Check if the user has already posted a comment in the updated comments data
      const userComment = response.data.find(
        (comment) => comment.userId === uid
      );
      setUserComment(userComment || null);

      // Set loading state to false after fetching comments
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
      // Handle error state or display error message
    }
  };

  // const checkUserComment = async () => {
  //   try {
  //     setLoading(true);
  //     const token = Cookies.get("jwt");
  //     const response = await axios.get(`${DATA_URL}api/verse/${id}/comments`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (response.status === 200 && response.data) {
  //       setUserComment(response.data);
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     console.error("Error checking user comment:", error);
  //     setLoading(false);
  //   }
  // };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = Cookies.get("jwt");
      const response = await axios.post(
        `${DATA_URL}api/comments`,
        {
          text: commentText,
          verseId: id,
          userId: uid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        // Comment successfully posted, fetch updated comments
        fetchCommentsData();
        toast.success("Comment Saved!", {
          autoClose: 1000,
        });
        // Clear the comment text input
        setCommentText("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleCommentEdit = async (editedText, commentId) => {
    try {
      const token = Cookies.get("jwt");
      const response = await axios.patch(
        `${DATA_URL}api/comments/${commentId}`,
        {
          text: editedText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // Comment successfully edited, fetch updated comments
        fetchCommentsData();
        // Clear the userComment state to indicate editing is finished
        setUserComment(null);
      }
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      console.log(commentId);
      const token = Cookies.get("jwt");
      const response = await axios.delete(
        `${DATA_URL}api/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // Comment successfully deleted, fetch updated comments
        fetchCommentsData();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleReplySubmit = async (replyText, commentId) => {
    try {
      const token = Cookies.get("jwt");
      console.log(commentId, replyText);
      const response = await axios.post(
        `${DATA_URL}api/comments/${commentId}/replies`,
        {
          userId: uid,
          text: replyText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        // Reply successfully posted, fetch updated comments
        fetchCommentsData();
      }
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleReplyEdit = async (editedText, commentId, replyId) => {
    try {
      const token = Cookies.get("jwt");
      const response = await axios.patch(
        `${DATA_URL}api/comments/${commentId}/replies/${replyId}`,
        {
          text: editedText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // Reply successfully edited, fetch updated comments
        fetchCommentsData();
      }
    } catch (error) {
      console.error("Error editing reply:", error);
    }
  };

  const handleReplyDelete = async (commentId, replyId) => {
    try {
      const token = Cookies.get("jwt");
      const response = await axios.delete(
        `${DATA_URL}api/comments/${commentId}/replies/${replyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // Reply successfully deleted, fetch updated comments
        fetchCommentsData();
      }
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  if (loading) {
    return (
      <div className="spinner">
        <img src={SpinnerImage} alt="spinner" width={100} height={100} />
      </div>
    );
  }

  console.log(!userComment);

  return (
    <div className="comment-overall-container">
      <h4>Commentary for Verse</h4>
      {/* Render comment form if there are no comments or if user has not posted a comment */}
      {(comments.length === 0 || !userComment) && !loading && (
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment..."
            className="comment-textarea" // Add custom CSS class for styling
          ></textarea>
          <button className="edit-button" type="submit">
            Post Comment
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>There are no comments</p>
      ) : (
        comments.map((comment, index) => (
          <CommentWithReplies
            key={index}
            comment={comment}
            onSubmitReply={handleReplySubmit}
            onEdit={handleCommentEdit}
            onDelete={handleCommentDelete}
            editable={comment.userId === uid}
            onEditReply={handleReplyEdit}
            onDeleteReply={handleReplyDelete}
          />
        ))
      )}
    </div>
  );
};

export default CommentList;
