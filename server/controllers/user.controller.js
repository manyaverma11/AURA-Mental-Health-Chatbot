import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const comparepswd = async (pswd, hashed) => {
  return await bcrypt.compare(pswd, hashed);
};

const generateRefreshToken = async (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      username: user.username,
      age: user.age,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
const generateAccessToken = async (user) => {
  return jwt.sign(
    {
      _id: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const generateAccessAndRefereshTokens = async (id) => {
  try {
    const user = await User.findById(id);
    const refreshToken = await generateRefreshToken(user);
    const accessToken = await generateAccessToken(user);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong while generating Access and Refresh Tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  if (!req.body) {
    throw new ApiError(400, "Request body is missing");
  }

  console.log(req.body);
  const { username, fullName, age, email, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    age,
    email,
    password: hashedPassword,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json({ createdUser, message: "User registered Successfully" });
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(401, "Missing Fields");
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }

  const checkpassword = await comparepswd(password, user.password);

  if (!checkpassword) {
    throw new ApiError(401, "Incorrect Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  // return res
  //   .status(200)
  //   .cookie("accessToken", accessToken, options)
  //   .cookie("refreshToken", refreshToken, options)
  //   .json(
  //     new ApiResponse(
  //       200,
  //       {
  //         user: loggedInUser,
  //         accessToken,
  //         refreshToken
  //       },
  //       "User logged In Successfully"
  //     )
  //   );

  res
    .status(200)
    .cookie("accessToken", accessToken, options) // Make sure accessToken is not undefined
    .cookie("refreshToken", refreshToken, options) // Make sure refreshToken is not undefined
    .json({
      message: "User logged In Successfully",
      user: loggedInUser,
      accessToken, // Optional: return tokens if needed
      refreshToken, // Optional: return tokens if needed
    });
});

const logoutUser = asyncHandler(async (req, res) => {
  // Temporary debug - remove in production
  // console.log('Request user:', req.user);

  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "User logged out successfully" });
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken ||
    req.body.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(decodedToken._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Token expired or used");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      message: "Refreshed Access Token Successfully",
      accessToken,
      refreshToken,
    });
});

const profile = asyncHandler(async (req, res) => {
  if (!req.user) {
    console.error("User not found");
  }
  const { username, fullName, age, email } = req.user;
  res.status(200).json({
    message: "Profile extracted successfully",
    user: { username, fullName, age, email },
  });
});

export { registerUser, loginUser, logoutUser, refreshAccessToken, profile };
