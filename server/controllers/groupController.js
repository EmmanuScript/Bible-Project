const Group = require("../model/Group");

module.exports.get_group = async (req, res) => {
  try {
    const groups = await Group.find().sort({ group_score: -1 });
    res.status(200).json(groups);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch groups", error: error.message });
  }
};

module.exports.update_group_score = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const updatedScore = req.body.group_score;
    // Find the group by ID and update the group's score
    const group = await Group.findByIdAndUpdate(
      groupId,
      { group_score: updatedScore },
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({ groupId, updatedScore }); // Return the updated score as JSON
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update group score", error: error.message });
  }
};

module.exports.highest_score = async (req, res) => {
  try {
    const groupWithHighestScore = await Group.aggregate([
      {
        $group: {
          _id: null,
          maxScore: { $max: { $toInt: "$group_score" } }, // Convert score to integer if it's stored as a string
        },
      },
      {
        $sort: { maxScore: -1 }, // Sort in descending order based on maxScore
      },
      {
        $limit: 1, // Limit the result to one group (the highest score)
      },
    ]);

    if (groupWithHighestScore.length === 0) {
      return res.status(404).json({ message: "No groups found" });
    }

    const highestScore = groupWithHighestScore[0].maxScore;

    const group = await Group.findOne({ group_score: highestScore });

    res.status(200).json(group); // Return the group with the highest score as JSON
  } catch (error) {
    res.status(500).json({
      message: "Failed to get group with highest score",
      error: error.message,
    });
  }
};

module.exports.user_highest_score = async (req, res) => {
  try {
    const user = await User.findOne().sort({ points: -1 }); // Find one user with the highest score (sorted in descending order)

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    res.status(200).json(user); // Return the user with the highest score as JSON
  } catch (error) {
    res.status(500).json({
      message: "Failed to get user with highest score",
      error: error.message,
    });
  }
};
