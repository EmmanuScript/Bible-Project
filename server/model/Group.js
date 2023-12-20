const mongoose = require("mongoose");
const { string } = require("yargs");

const groupSchema = new mongoose.Schema(
  {
    group: {
      type: String,
      trim: true,
      required: true,
    },
    group_leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
    group_score: {
      type: String,
      trim: true,
    },
    group_users: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
