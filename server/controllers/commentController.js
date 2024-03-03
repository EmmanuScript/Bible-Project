// Import necessary modules
const express = require("express");
const router = express.Router();
const Comment = require("../model/Comment");
const User = require("../model/User");

// Route to get comments for a specific verse
module.exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ verseId: req.params.verseId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Route to post a new comment
module.exports.postComments = async (req, res) => {
  try {
    const { verseId, userId, text } = req.body;

    // Retrieve the user details (including the username) using the user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create the comment with the user's username
    const comment = new Comment({
      verseId,
      userId,
      userName: user.name, // Assuming the username is stored in the 'name' field
      text,
    });

    // Save the comment to the database
    await comment.save();

    res.status(201).json({ message: "Comment posted successfully", comment });
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Route to reply to a comment
module.exports.postReply = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.replies.push({
      userId: req.body.userId,
      text: req.body.text,
    });
    const updatedComment = await comment.save();
    res.status(201).json(updatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
