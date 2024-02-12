const User = require("../model/User");

module.exports.get_group = async (req, res) => {
  try {
    const groups = await Users.find().sort({ group: 1 }); // Sort by the 'group' property in ascending order
    res.status(200).json(groups);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch groups", error: error.message });
  }
};

module.exports.get_group_by_id = async (req, res) => {
  const groupId = req.params.id;

  try {
    const group = await User.find({ group: groupId });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch group", error: error.message });
  }
};

module.exports.get_group_leader = async (req, res) => {
  const groupId = req.params.id;

  try {
    const group = await User.find({ group: groupId, group_leader: true });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch group", error: error.message });
  }
};

// module.exports.update_group_score = async (req, res) => {
//   try {
//     const groupId = req.params.groupId;
//     const updatedScore = req.body.group_score;
//     // Find the group by ID and update the group's score
//     const group = await Group.findByIdAndUpdate(
//       groupId,
//       { group_score: updatedScore },
//       { new: true }
//     );

//     if (!group) {
//       return res.status(404).json({ message: "Group not found" });
//     }

//     res.status(200).json({ groupId, updatedScore }); // Return the updated score as JSON
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to update group score", error: error.message });
//   }
// };

module.exports.get_group_score = async (req, res) => {
  try {
    // Extract the groupId from the request parameters
    const { groupId } = req.params;

    // Find all users in the specified group
    const usersInGroup = await User.find({ group: groupId });

    // Calculate the total score by summing up the points of all users
    let groupScore = 0;
    usersInGroup.forEach((user) => {
      groupScore += user.points;
    });

    // Return the total score as the response
    res.status(200).json({ groupScore });
  } catch (error) {
    console.error("Error calculating group score:", error);
    res.status(500).json({ message: "Failed to calculate group score" });
  }
};

module.exports.group_highest_score = async (req, res) => {
  try {
    const groupWithHighestScore = await User.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "group",
          foreignField: "group",
          as: "group_users",
        },
      },
      {
        $unwind: "$group_users",
      },
      {
        $group: {
          _id: "$group",
          groupName: { $first: "$group" },
          totalScore: { $sum: { $toInt: "$group_users.points" } },
        },
      },
      {
        $sort: { totalScore: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    if (groupWithHighestScore.length === 0) {
      return res.status(404).json({ message: "No groups found" });
    }

    const highestScoreGroup = groupWithHighestScore[0];

    res.status(200).json(highestScoreGroup); // Return the group with the highest totalScore as JSON
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
