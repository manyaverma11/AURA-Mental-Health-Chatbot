import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import User from "../models/user.model"
import bcrypt from "bcrypt"

const comparepswd = async (pswd,hashed)=>{
    return await bcrypt.compare(pswd, hashed)
}

const generateRefreshToken = async(user)=>{
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            username: user.username,
            age: user.age,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
const generateAccessToken = async(user)=>{
    return jwt.sign(
        {
            _id: user._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const generateAccessAndRefereshTokens = async(id)=>{
    const user = User.findById(id);
    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(user);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false })
    return {refreshToken, accessToken}

}

const loginUser = async(req,res)=>{

    const {username, password} = req.body;

    if(!username || !password){
        res.send(new ApiError(401,"Missing Fields"));
    }

    const user =await User.findOne({ username });

    if(!user){
        res.send(new ApiError(404,"User doesn't exist"));
    }

    const checkpassword = await comparepswd(password,user.password);

    if(!checkpassword){
        res.send(new ApiError(401,"Incorrect Password"));
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
      

}