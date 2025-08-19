import mongoose from "mongoose";
import appError from "../middlewares/appError.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Course } from "../model/courseModel.js";
import { Lecture } from "../model/lectureModel.js";
import { delete_media, delete_video, uploadMedia } from "../utils/cloudinary.js";

export const createCourse = catchAsyncErrors(async (req, res, next) => {
    const { title, category } = req.body;

    if (!title || !category) {
        return next(new appError("All fields are required", 400));
    }

    const course = await Course.create({
        title,
        category,
        creator: req.id,
    });

    return res.status(201).json({
        success: true,
        message: "Course Created",
        course,
    });
});

// get all courses

export const getAllCourses = catchAsyncErrors(async (req, res, next) => {
    const userId = req.id;

    const courses = await Course.find({ creator: userId });

    if (!courses) {
        return next(new appError("Courses not found", 404));
    };

    return res.status(200).json({
        courses,
    });
});

// updateCourse 

export const updateCourse = catchAsyncErrors(async (req, res, next) => {
    const courseId = req.params.courseId
    const { title, subTitle, description, category, level, price } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(courseId);

    if (!course) {
        return next(new appError("Course Not Found", 404));
    }

    let courseThumbnail;
    if (thumbnail) {
        if (course.courseThumbnail) {
            const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
            await delete_media(publicId); // delete existing image before update
        }
        // upload thumbnail on cloudinary
        courseThumbnail = await uploadMedia(thumbnail.path, "lms/courses");
    }

    const updateData = {
        title,
        subTitle,
        description,
        category,
        level,
        price,
        courseThumbnail: courseThumbnail?.secure_url
    };

    course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

    return res.status(200).json({
        course,
        message: "Course Updated",
    });

});

export const getCourseById = catchAsyncErrors(async (req, res, next) => {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
        return next(new appError("Course Not Found", 404));
    };

    return res.status(200).json({
        course,
    });
});

// create lecture

export const createLecture = catchAsyncErrors(async (req, res, next) => {
    const { courseId } = req.params;
    const { title } = req.body;

    if (!courseId) {
        return next(appError("Course Not Found", 404));
    };
    if (!title) {
        return next(appError("Title is required", 400));
    };

    const lecture = await Lecture.create({
        title
    });

    const course = await Course.findById(courseId);

    if (course) {
        course.lectures.push(lecture._id);
        await course.save();
    }

    return res.status(200).json({
        lecture,
        message: "Lecture Created"
    });

});



export const getCourseLecture = catchAsyncErrors(async (req, res, next) => {
    const { courseId } = req.params;


    const course = await Course.findById(courseId).populate("lectures");

    if (!courseId || !course) {
        return next(new appError("Course Not Found", 404));
    };

    return res.status(200).json({
        lectures: course.lectures,
    });

});

export const updateLecture = catchAsyncErrors(async (req, res, next) => {
    const { title, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
        return next(new appError("Lecture not found", 404));
    }

    // update lecture

    if (title) lecture.title = title;

    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;

    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;

    if (isPreviewFree) lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    // Ensure the course is still has the lecture Id If its not already added

    const course = await Course.findById(courseId);

    // inlcludes() - checks that ist there are not
    if (!course && course.lectures.includes(lecture._id)) {
        course.lecture.push(lecture._id);
        await course.save();
    }

    return res.status(200).json({
        lecture,
        message: "Lecture Updated Successfully",
    })

});

export const removeLecture = catchAsyncErrors(async (req, res, next) => {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture || !lectureId) {
        return next(new appError("Lecture not found", 404));
    }

    if (lecture.publicId) {
        await delete_video(lecture.publicId);
    };

    await Lecture.findByIdAndDelete(lectureId);

    // remove the lecture ref from course

    await Course.updateOne(
        { lectures: lectureId }, // find course that containe lecture
        { $pull: { lectures: lectureId } } // remove the lecture using mongodb $pull method
    )

    return res.status(200).json({
        message: "Lecture removed successfully"
    });

})

export const getLectureById = catchAsyncErrors(async (req, res, next) => {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);

    if (!lectureId || !lecture) {
        return next(new appError("Lecture not found", 404));
    };

    return res.status(200).json({
        lecture,
    });

});

// Publish and Unpublish course

export const togglePublishUnPublish = catchAsyncErrors(async (req, res, next) => {
    const { courseId } = req.params;

    const { publish } = req.query; // true or false value

    const course = await Course.findById(courseId);

    if (!courseId || !course) {
        return next(new appError("Course Not Found", 404));
    };

    // publish course based on query parameter

    course.isPublished = publish === "true";
    await course.save();

    const statusMessage = course.isPublished ? "Course Is Published" : "Course Is Unpublished";

    res.status(200).json({
        message: statusMessage,
        publish,
    })

});

// category filter
export const searchCourse = catchAsyncErrors(async (req, res, next) => {
    const { query = "", categories = [], sortByPrice = "" } = req.query;

    // create search query 
    const searchCriteria = {
        isPublished: true,
        $or: [
            {
                title: {$regex: query, $options: "i"}
            },
            {
                subTitle: {$regex: query, $options: "i"}
            },
            {
                category: {$regex: query, $options: "i"}
            }
        ]
    }

    // if categories are selected 
    if (categories.length > 0) {
        searchCriteria.category = {$in: categories}
    }

    // define sorting order by price
    const sortOptions = {};

    if (sortOptions === "low") {
        sortOptions.price = 1; // sort by price as ascending order
    } else if (sortOptions === "high") {
        sortOptions.price = -1 // sort by price as decending order
    }

    let courses = await Course.find(searchCriteria).populate({path: "creator", select: "name photoUrl"}).sort(sortOptions);

    return res.status(200).json({
        success: true,
        courses: courses || [],
    })

})

export const getPublishedCourses = catchAsyncErrors(async (_, res, next) => {
    const courses = await Course.find({ isPublished: true }).populate({ path: "creator", select: "name photoUrl" });

    if (!courses) {
        return next(new appError("Course not found", 404));
    };

    res.status(200).json({
        courses,
    });
});