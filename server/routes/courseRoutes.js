import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { createCourse, createLecture, getAllCourses, getCourseById, getCourseLecture, getLectureById, getPublishedCourses, removeLecture, searchCourse, togglePublishUnPublish, updateCourse, updateLecture } from "../controller/courseController.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/")
.post(isAuthenticated, createCourse)
.get(isAuthenticated, getAllCourses)

// seach route
router.route("/search").get(isAuthenticated, searchCourse);

router.route("/published-courses")
.get(getPublishedCourses);

router.route("/:courseId")
.put(isAuthenticated, upload.single("courseThumbnail"), updateCourse)
.get(isAuthenticated, getCourseById)
.patch(isAuthenticated, togglePublishUnPublish);

router.route("/:courseId/lecture")
.post(isAuthenticated, createLecture)
.get(isAuthenticated, getCourseLecture)

router.route("/:courseId/lecture/:lectureId")
.post(isAuthenticated, updateLecture)

router.route("/lecture/:lectureId")
.delete(isAuthenticated, removeLecture)
.get(isAuthenticated, getLectureById)

export default router;