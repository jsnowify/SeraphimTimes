const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let User = require("../models/user.model");
const auth = require("../middleware/auth");

// Register Route
router.post("/register", async (req, res) => {
  try {
    let { firstName, middleName, lastName, email, username, password } =
      req.body;
    if (!firstName || !lastName || !email || !username || !password) {
      return res.status(400).json({ msg: "Please enter all required fields." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters long." });
    }
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({
          msg: "An account with this username or email already exists.",
        });
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      middleName,
      lastName,
      email,
      username,
      password: passwordHash,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered." });
    }
    const user = await User.findOne({ username: username });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "No account with this username has been registered." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }
    if (!process.env.JWT_SECRET) {
      console.error(
        "FATAL ERROR: JWT_SECRET is not defined in your .env file."
      );
      return res.status(500).json({ error: "Server configuration error." });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

// GET: Current logged-in user's profile data
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found." });
    res.json(user);
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

// POST: Update user profile information
router.post("/update", auth, async (req, res) => {
  try {
    const { firstName, lastName, middleName } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({ msg: "First and last name are required." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, middleName },
      { new: true }
    ).select("-password");

    res.json({
      msg: "Profile updated successfully!",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        fullName: `${updatedUser.firstName} ${updatedUser.lastName}`,
      },
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

module.exports = router;
