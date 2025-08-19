import appError from "../middlewares/appError.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Course } from "../model/courseModel.js";
import { CourseProgress } from "../model/courseProgressModel.js";

export const getCourseProgress = catchAsyncErrors(async (req, res, next) => {
    const { courseId } = req.params;
    const userId = req.id;

    // step - 1 fetch the course progress  

    let courseProgress = await CourseProgress.findOne({ courseId, userId }).populate("courseId");

    const courseDetails = await Course.findById(courseId).populate("lectures");

    if (!courseDetails) {
        return next(new appError("Course Not Found", 404));
    }

    // step - 2 if no progress, return course details and empty course progress

    if (!courseProgress) {
        return res.status(200).json({
            data: {
                courseDetails,
                progress: [],
                completed: false
            }
        })
    }

    // step - 3
    // return users course progress along with course details if course progress is true

    return res.status(200).json({
        success: true,
        data: {
            courseDetails,
            progress: courseProgress.lectureProgress,
            completed: courseProgress.completed
        }

    })

});

export const updateLectureProgress = catchAsyncErrors(async (req, res, next) => {
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    // fetch create course progress

    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
        // if no progress create a new record
        courseProgress = new CourseProgress({
            userId,
            courseId,
            completed: false,
            lectureProgress: []
        });
    }

    // find the lecture progress in the course progress
    const lectureIdx =
        courseProgress.lectureProgress.findIndex(
            (lecture) => lecture.lectureId === lectureId
        );

    if (lectureIdx !== -1) {
        // if lecture already exist, update its status
        courseProgress.lectureProgress[lectureIdx].viewed = true
    } else {
        // Add new lecture progress
        courseProgress.lectureProgress.push({
            lectureId,
            viewed: true,
        })
    }

    // if all lectures are completed
    const lectureProgressLength =
        courseProgress.lectureProgress.filter((lectureProg) => lectureProg.viewed).length;
    const course = await Course.findById(courseId);

    if (course.lectures.length === lectureProgressLength) {
        courseProgress.completed = true
    }

    await courseProgress.save();

    res.status(200).json({
        message: "Lecture Progress Updated",
    })
});

export const markAsCompleted = catchAsyncErrors(async (req, res, next) => {
    const { courseId } = req.params;
    const userId = req.id;

    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
        return next(new appError("Course Progress Not Found"));
    }

    courseProgress.lectureProgress.map((lectureProg) => lectureProg.viewed = true);

    courseProgress.completed = true;

    await courseProgress.save();

    return res.status(200).json({
        message: "Course Completed"
    })
});

export const markAsInCompleted = catchAsyncErrors(async (req, res, next) => {
    const { courseId } = req.params;
    const userId = req.id;

    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
        return next(new appError("Course Progress Not Found"));
    }

    courseProgress.lectureProgress.map((lectureProg) => lectureProg.viewed = false);

    courseProgress.completed = false;

    await courseProgress.save();

    return res.status(200).json({
        message: "Course Marked as Incompleted"
    })
})