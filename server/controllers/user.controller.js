import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const generateAccessAndRefereshTokens = async (id) => {
  try {
    const user = User.findById(id);
    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(user);
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

const registerUser = async (req, res) => {
  const { username, fullName, age, email, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    res.send(new ApiError(400, "All fields are required"));
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    res.send(new ApiError(409, "User with email or username already exists"));
  }

  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    age,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    res.send(new ApiError(500, "Something went wrong while registering user"));
  }

  return res.status(201).json(201, createdUser, "User registered Successfully");
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.send(new ApiError(401, "Missing Fields"));
  }

  const user = await User.findOne({ username });

  if (!user) {
    res.send(new ApiError(404, "User doesn't exist"));
  }

  const checkpassword = await comparepswd(password, user.password);

  if (!checkpassword) {
    res.send(new ApiError(401, "Incorrect Password"));
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

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
};

const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
};

const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    res.send(new ApiError(401, "Unauthorized Request"));
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken._id);
    if (!user) {
      res.send(new ApiError(401, "Invalid Refresh Token"));
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      res.send(new ApiError(401, "Token expired or used"));
    }
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Refreshed Access Token Successfully"
      );
  } catch (err) {
    res.send(new ApiError(401, err.message || "Invalid Refresh Token"));
  }
};

export { registerUser, loginUser, logoutUser, refreshAccessToken };
