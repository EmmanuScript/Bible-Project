const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/authRoutes"); // Assuming your user routes are in userRoutes file
const groupRoutes = require("./routes/groupRoutes"); // Assuming your group routes are in groupRoutes file
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser, authRole } = require("./middleware/auth");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000; // Fallback to 3000 if PORT environment variable is not set

// Path
const publicDirectory = path.join(__dirname, "../");

// Middleware
app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Database connection
const dbURI = process.env.MONGODB_URL;
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Registering the routers in app
app.use("/api", userRoutes); // Assuming user routes are prefixed with '/api'
app.use("/api", groupRoutes); // Assuming group routes are prefixed with '/api'

app.listen(port, () => {
  console.log("Server is running on port " + port + "...");
});

module.exports = app;
