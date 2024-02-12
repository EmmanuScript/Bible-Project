const User = require("../model/User");
const jwt = require("jsonwebtoken");

//handle errors

const handleErrors = (e) => {
  console.log(e.message, e.code);
  let errors = { email: "", password: "", roles: "" };

  //incorrect email
  if (e.message === "Incorrect email") {
    errors.email = "your email is not registered";
  }

  if (e.message === "Incorrect password") {
    errors.password = "your password is not correct";
  }

  //unique error code
  if (e.code === 11000) {
    errors.email = "email already registered";
    return errors;
  }

  if (e.code === 401) {
    errors.roles = "Admin requires a unique password";
    return errors;
  }

  //validation errors
  if (e.message.includes("user validation failed"))
    Object.values(e.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  return errors;
};

//create token

const maxAge = 12 * 60 * 60; //this ex-pects a time in seconds and not milliseconds

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.signup_post = async (req, res) => {
  const { email, password, name, group, group_leader } = req.body; // Assuming group is included in the signup form

  try {
    if (group_leader === true && password != "outright") {
      res.status(401).json({ message: "Kindly select false for group leader" });
      return;
    }
    const user = await User.create({
      email,
      password,
      name,
      group,
      group_leader,
    }); // Creating a new user

    const token = createToken(user._id); // Creating a JWT token for the user

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res
      .status(201)
      .json({ userId: user._id, group: user.group, token, maxAge }); // Responding with the user's ID and group
  } catch (e) {
    const errors = handleErrors(e); // Handling potential errors
    res.status(400).json({ errors }); // Sending error response if any errors occur
  }
};

module.exports.login_post = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json({
      userId: user._id,
      group: user.group,
      token,
      maxAge,
    });
  } catch (e) {
    console.log(e);
    const errors = handleErrors(e);
    res.status(409).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.clearCookie("jwt", "", { maxAge: 1 });
  res.json("logout successful");
};

module.exports.update_password = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password;

    await user.save();

    res.status(200).json({ message: "Password Update Successful" });
  } catch (e) {
    console.error(e);
    res.status(501).json({ message: "Password update error" });
  }
};
