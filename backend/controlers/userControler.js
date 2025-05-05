import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isDelivery: user.isDelivery,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc Register a new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isDelivery: user.isDelivery,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePicture: user.profilePicture,
      isDelivery: user.isDelivery,
      address: user.address,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    console.log("Incoming profile update request:", req.body);
    console.log("Incoming file:", req.file);
    const user = await User.findById(req.user._id);
    if (!user) {
      console.error("User not found");
      res.status(404);
      throw new Error("User not found");
    }

    // Log file information
    console.log("Received address:", req.body.address);
    // Handle file upload correctly
    if (req.file) {
      console.log("Uploaded file:", req.file.path);
      user.profilePicture = req.file.path;
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.lastName = req.body.lastName || user.lastName;
    user.gender = req.body.gender || user.gender;
    user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
    // ✅ Parse address if it exists and is a string
    if (req.body.address) {
      try {
        user.address = JSON.parse(req.body.address); // ✅ Correctly parsing the string into an object
      } catch (err) {
        console.error("Error parsing address JSON:", err.message);
        return res.status(400).json({ message: "Invalid address format" });
      }
    }
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    console.log("Updated user details:", updatedUser);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      isAdmin: updatedUser.isAdmin,
      address: updatedUser.address,
      lastName: updatedUser.lastName,
      gender: updatedUser.gender,
      dateOfBirth: updatedUser.dateOfBirth,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// @desc Update user user
// @route PUT /api/users/:id
// @access Private/Admin

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;
    user.isDelivery = req.body.isDelivery;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isDelivery: updatedUser.isDelivery,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Get All users
// @route GET /api/users
// @access Private/admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).populate(
    "orderHistory",
    "totalPrice isPaid createdAt _id"
  );
  res.json(users);
});

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private/admin
const getUserByID = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
    console.log(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
// @desc Delete User
// @route DELETE /api/users/:id
// @access Private/admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne({ _id: req.params.id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
// @desc Add or Remove from Favorites
// @route POST /api/products/favorites/:id
// @access Private
const toggleFavorite = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const product = await Product.findById(req.params.id);
  const user = await User.findById(userId).populate("favorites");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const isFavorite = user.favorites.some(
    (item) => item._id.toString() === product._id.toString()
  );

  if (isFavorite) {
    user.favorites = user.favorites.filter(
      (item) => item._id.toString() !== product._id.toString()
    );
    await user.save();
    res
      .status(200)
      .json({ message: "Removed from favorites", favorites: user.favorites });
  } else {
    user.favorites.push(product);
    await user.save();
    res
      .status(200)
      .json({ message: "Added to favorites", favorites: user.favorites });
  }
});

// @desc Get user favorites
// @route GET /api/products/favorites
// @access Private
const getFavorites = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Check if the user exists and populate favorites
  const user = await User.findById(userId)
    .select("favorites")
    .populate("favorites");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user.favorites);
});
export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserByID,
  updateUser,
  toggleFavorite,
  getFavorites,
};
