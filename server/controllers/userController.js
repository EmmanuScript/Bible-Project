const path = require("path");
const User = require("../model/User");
const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports.get_users = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports.get_user = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
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

    const userScore = user.points;

    res.status(200).json({ userId, userScore });
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

module.exports.update_quiz = async (req, res) => {
  const userId = req.params.id;
  const { quizId, quizScore, dateTaken } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Assuming quiz_info is an array of objects
    user.quiz_info.push({
      quizId: quizId,
      quizScore: quizScore,
      dateTaken: dateTaken,
    });

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update quiz info", error: error.message });
  }
};

module.exports.quiz_taken = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const quizIds = user.quiz_info.map((quiz) => quiz.quizId);

    res.status(200).json(quizIds);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user quiz IDs", error: error.message });
  }
};

module.exports.update_streak = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has taken any quizzes
    if (user.quiz_info.length === 1 && user.quiz_info[0] === null) {
      return res
        .status(400)
        .json({ message: "User has not taken any quizzes" });
    }

    // If user has taken only one quiz, set streak to 1
    if (user.quiz_info.length === 1) {
      user.streak = 1;
    } else {
      const latestQuiz = user.quiz_info.reduce((latest, quiz) => {
        if (quiz.dateTaken && (!latest || quiz.dateTaken > latest.dateTaken)) {
          return quiz;
        }
        return latest;
      }, null);

      const today = new Date();
      const quizDate = new Date(latestQuiz.dateTaken);

      // Calculate the difference in days
      const dayDifference = Math.floor(
        (today - new Date(quizDate)) / (1000 * 60 * 60 * 24)
      );

      if (dayDifference === 1) {
        user.streak += 1;
      } else if (dayDifference > 1) {
        user.streak = 1;
      }
    }

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({ streak: updatedUser.streak });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update streak", error: error.message });
  }
};

module.exports.get_highest_score_users = async (req, res) => {
  try {
    // Find users and sort them by points in descending order
    const topUsers = await User.find().sort({ points: -1 }).limit(3);

    res.status(200).json(topUsers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get top users",
      error: error.message,
    });
  }
};

module.exports.calculate_points = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the quiz_info array from the user
    const quizInfoArray = user.quiz_info || [];

    // Calculate points by summing up quizScore values
    const totalPoints = quizInfoArray.reduce((acc, quiz) => {
      return acc + parseInt(quiz.quizScore || 0, 10);
    }, 0);

    // Update the streak with the calculated points
    user.points = totalPoints + user.streak;

    // Save the updated user
    await user.save();

    res
      .status(200)
      .json({ message: "Points calculated and updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to calculate and update points",
      error: error.message,
    });
  }
};

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_URL,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports.forgot_password = async (req, res) => {
  try {
    // Forgot password route
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send password reset email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset your password",
      text: "Click the link to reset your password.",
      html: `<!DOCTYPE html>
  <html lang="en" >
  <head>
    <meta charset="UTF-8">
    <title>CodePen - OTP Email Template</title>
    
  
  </head>
  <body>
  <!-- partial:index.partial.html -->
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Bible Study App</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>This mail is for resetting your password. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
      <p style="font-size:0.9em;">Regards,<br />TSH Bible App</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Bible Study Project</p>
        <p>TSH Bible Study Team</p>
      </div>
    </div>
  </div>
  <!-- partial -->
    
  </body>
  </html>`,
    };

    user.otp = otp;
    await user.save();

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to send reset email" });
      } else {
        res.status(200).json({ message: "Reset email sent successfully" });
      }
    });
  } catch (e) {
    res.status(500).json({
      message: "Failed to send OTP, wait for some minutes and try again",
      error: e.message,
    });
    console.log(e);
  }
};

module.exports.update_otp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.otp = otp;
    await user.save();

    res.status(200).json({ message: "OTP successful" });
  } catch (e) {
    console.error(e);
    res.status(501).json({ message: "otp unsuccessful" });
  }
};

module.exports.check_otp = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.otp === otp) {
      user.otp = "";
      user.save();
      res.status(200).json({ message: "OTP successful" });
    } else {
      res.status(401).json({ message: "OTP incorrect" });
    }
  } catch (e) {
    return res.status(501).json({ message: "otp unsuccessful" });
  }
};
