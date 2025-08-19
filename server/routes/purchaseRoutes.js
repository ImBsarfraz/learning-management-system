import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { createCheckOutSession, getAllPurchasedCourses, getPurchaseCourseDetails, stripeWebhook } from "../controller/purchaseCourseController.js";

const router = express.Router();

router.route("/checkout/create-checkout-session")
.post(isAuthenticated, createCheckOutSession)

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

router.route("/course/:courseId/purchase-course-details").get(isAuthenticated, getPurchaseCourseDetails);

router.route("/").get(isAuthenticated, getAllPurchasedCourses)

export default router;