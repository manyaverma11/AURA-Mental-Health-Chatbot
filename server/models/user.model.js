import mongoose, { model } from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    fullName:{
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true
    },
    refreshToken:{
      type: String
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
