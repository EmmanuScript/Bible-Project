import React, { useState, useEffect } from "react";
import CommentWithReplies from "../components/Comments";

const CommentList = ({}) => {
  const [comments, setComments] = useState([
    {
      verseId: "1peter-1",
      userId: "6133e25c22c7e0247cb6934d", // User ID of the commenter
      userName: "JohnDoe", // Username of the commenter
      text: "This verse is very inspiring!",
      replies: [
        {
          userId: "6133e25c22c7e0247cb6934d", // User ID of the replier
          userName: "JohnDoe", // Username of the replier
          text: "I agree! It gives me hope.",
          createdAt: "2024-02-24T12:00:00Z",
        },
      ],
      createdAt: "2024-02-24T10:00:00Z",
    },
    {
      verseId: "1peter-1",
      userId: "6133e25c22c7e0247cb6934e",
      userName: "JaneSmith",
      text: "I find this verse very comforting.",
      replies: [],
      createdAt: "2024-02-24T10:30:00Z",
    },
    {
      verseId: "1peter-2",
      userId: "6133e25c22c7e0247cb6934f",
      userName: "AliceDoe",
      text: "The message in this verse is profound.",
      replies: [
        {
          userId: "6133e25c22c7e0247cb6934e",
          userName: "JaneSmith",
          text: "Yes, it really makes you think.",
          createdAt: "2024-02-24T13:00:00Z",
        },
      ],
      createdAt: "2024-02-24T11:00:00Z",
    },
    {
      verseId: "1peter-2",
      userId: "6133e25c22c7e0247cb6934d",
      userName: "JohnDoe",
      text: "I love the wisdom in this verse.",
      replies: [],
      createdAt: "2024-02-24T11:30:00Z",
    },
    {
      verseId: "1peter-2",
      userId: "6133e25c22c7e0247cb6934f",
      userName: "AliceDoe",
      text: "This verse speaks to my heart.",
      replies: [],
      createdAt: "2024-02-24T12:30:00Z",
    },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch comments data from the API
    fetchCommentsData();
  }, []);

  const fetchCommentsData = async () => {
    try {
      // Make API call to fetch comments data
      const response = await fetch("YOUR_API_ENDPOINT");
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments();
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
      // Handle error state or display error message
    }
  };

  if (loading) {
    return <p>Loading comments...</p>;
  }

  return (
    <div>
      {comments.length === 0 ? (
        <p>There are no comments</p>
      ) : (
        comments.map((comment, index) => (
          <CommentWithReplies key={index} comment={comment} />
        ))
      )}
    </div>
  );
};

export default CommentList;
