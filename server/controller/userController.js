import bcrypt from "bcryptjs";
import appError from "../middlewares/appError.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from '../model/userModel.js'
import { generateToken } from "../utils/generateToken.js";
import { delete_media, uploadMedia } from "../utils/cloudinary.js";

// register user
export const registerUser = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new appError("All Fields are required", 400));
    }

    const user = await User.findOne({ email });

    // hashing password for security before adding to database

    if (user) {
        return next(new appError("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name,
        email,
        password: hashedPassword
    });

    return res.status(201).json({
        success: true,
        message: "Account created successfully"
    });

});

// login user   
export const loginUser = catchAsyncErrors(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new appError("Please enter both email and password", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new appError("Incorrect email or password", 400))
    };

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return next(new appError("Incorrect email or password", 400));
    };

    generateToken(res, user, `${user.name} Login Successfully`);

});

export const logout = catchAsyncErrors(async (req, res, next) => {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
        success: true,
        message: "Logout Successfully",
    });
});

export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const userId = req.id;

    const user = await User.findById(userId).select("-password").populate("enrolledCourses");

    if (!user) {
        return next("Profile not found", 404);
    }

    return res.status(200).json({
        success: true,
        user
    });
});

// Update Profile
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;

    if (!profilePhoto) {
        return next(new appError("No file uploaded", 400));
    }

    const user = await User.findById(userId);

    if (!user) {
        return next(new appError("User not found", 404));
    };

    // extract public_id of the existing image from url and delete from cloudinary
    if (user.photoUrl) {
        const publicId = user.photoUrl.split("/").pop().split(".")[0]; // public id
        await delete_media(publicId);
    }

    // upload new image
    const cloudResponse = await uploadMedia(profilePhoto.path, "lms/user");

    if (!cloudResponse || !cloudResponse.secure_url) {
        return next(new appError("Failed to upload image", 500));
    }

    const photoUrl = cloudResponse.secure_url;


    const updatedData = { name, photoUrl };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");

    return res.status(200).json({
        success: true,
        user: updatedUser,
        message: "Profile Updated"
    })
});

