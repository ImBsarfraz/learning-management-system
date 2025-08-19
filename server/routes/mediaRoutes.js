import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

const router = express.Router();

router.route("/upload-video").post(upload.single("file"), catchAsyncErrors(async (req, res, next) => {
    const result = await uploadMedia(req.file.path, "lms/lectures");

    res.status(200).json({
        success: true,
        message: "File uploaded",
        data: result,
    });

}));

export default router;