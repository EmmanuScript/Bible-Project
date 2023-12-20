const path = require("path");
const User = require("../model/User");

module.exports.get_users = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports.get_group_users = async (req, res) => {
  try {
    const groupId = req.params.groupId; // Get the groupId from the request params
    const users = await User.find({ group: groupId }); // Find users by group ID
    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found for the specified group" });
    }
    res.status(200).json(users); // Return the list of users for the group as JSON
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users by group",
      error: error.message,
    });
  }
};

module.exports.update_user = async (req, res) => {
  try {
    const userId = req.params.userId; // Get the userId from the request params
    const updatedInfo = req.body; // Updated user information from the request body

    // Find the user by ID and update the user information
    const user = await User.findByIdAndUpdate(userId, updatedInfo, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); // Return the updated user as JSON
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update user info", error: error.message });
  }
};

module.exports.get_user_score = async (req, res) => {
  try {
    const userId = req.params.userId; // Get the userId from the request params

    // Find the user by ID and retrieve the user's score
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userScore = user.points; // Assuming 'points' is the field representing the user's score

    res.status(200).json({ userId, userScore }); // Return the user's score as JSON
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get user score", error: error.message });
  }
};

module.exports.update_user_score = async (req, res) => {
  try {
    const userId = req.params.userId; // Get the userId from the request params
    const updatedScore = req.body.score; // Updated score from the request body

    // Find the user by ID and update the user's score
    const user = await User.findByIdAndUpdate(
      userId,
      { points: updatedScore },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ userId, updatedScore }); // Return the updated score as JSON
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update user score", error: error.message });
  }
};
