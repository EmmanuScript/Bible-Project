const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
const { string, boolean } = require("yargs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  group: {
    type: Number,
    required: true,
  },

  points: {
    type: Number,
    default: 0,
  },
  quiz_info: {
    type: [
      {
        quizId: { type: String },
        quizScore: { type: String },
        dateTaken: { type: Date },
      },
    ],
    default: false,
  },
  group_leader: {
    type: Boolean,
    default: false,
  },
  streak: {
    type: Number,
    default: 0,
  },
  otp: {
    type: String,
    default: 0,
  },
});

//populating the owner keys with the user id
userSchema.virtual("groups", {
  ref: "Group",
  localField: "group",
  foreignField: "group",
});

//hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  // Check if the password field is modified or if it's a new user
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Set hashed password
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Post-save hook to add the user to the group_users array of the corresponding group
userSchema.post("save", async function (doc, next) {
  console.log("New user was created and saved", doc);
  next();
});

//static method to login user
userSchema.statics.login = async function (email, password) {
  try {
    const user = await this.findOne({ email });

    if (!user) {
      throw new Error("Incorrect email");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error("Incorrect password");
    }

    return user;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error; // Re-throw the error for further handling
  }
};

const User = mongoose.model("user", userSchema);

module.exports = User;
