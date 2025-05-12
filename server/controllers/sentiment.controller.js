import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";

const getSentiment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    throw new ApiError(401, "Missing text for analysis");
  }
  const response = await axios.post("http://127.0.0.1:5000/sentiment", { text });
  if (!response.data || !response.data.sentiment) {
    throw new ApiError(500, "Something went wrong while getting sentiment");
  }
  console.log(response.data.sentiment);
  return res.status(201).json({sentiment: response.data.sentiment});
});

export default getSentiment;
