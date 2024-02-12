const jwt = require("jsonwebtoken");
const User = require("../model/User");

const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing or invalid token" });
    }
    const token = authHeader.split(" ")[1];

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.error("JWT verification failed:", err.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      req.user = decodedToken;
      next();
    });
  } catch (e) {
    console.log("there was an error: ", e);
  }
};

//check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        req.locals.user = null;
        next();
      }
      let user = await User.findOne({ _id: decodedToken.id });
      req.user = user;
      res.locals.user = user;
      next();
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const authRole = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        req.locals.user = null;
        next();
      }
      let user = await User.findOne({ _id: decodedToken.id });
      if (user.roles === "Admin") {
        res.locals.user = user;
        next();
      } else {
        res.redirect("/home");
      }
    });
  }
};

module.exports = {
  requireAuth,
  checkUser,
  authRole,
};
