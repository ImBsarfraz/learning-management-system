import Stripe from "stripe";
import { Course } from "../model/courseModel.js";
import { PurchaseCourse } from "../model/purchaseCourseModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import appError from "../middlewares/appError.js";
import dotenv from "dotenv";
import { Lecture } from "../model/lectureModel.js";
import { User } from "../model/userModel.js";

dotenv.config();

// When you purchase using stripe then an session is created which contains the info

// creating a instace of stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// creating a checkout session 
export const createCheckOutSession = catchAsyncErrors(async (req, res, next) => {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
        return next(new appError("Course Not Found", 404));
    }

    const newPurchaseCourse = new PurchaseCourse({
        courseId,
        userId,
        amount: course.price,
        status: "pending"
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: course.title,
                        images: [course.courseThumbnail],
                    },
                    unit_amount: course.price * 100,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/course-progress/${courseId}`,
        cancel_url: `${process.env.FRONTEND_URL}/course-details/${courseId}`,
        metadata: {
            courseId: courseId,
            userId: userId,
        },
        shipping_address_collection: {
            allowed_countries: ["IN"],
        },
    });

    if (!session.url) {
        return next(new appError("Error while creating session", 400));
    }

    // Save paymentId from Stripe session
    newPurchaseCourse.paymentId = session.id;
    await newPurchaseCourse.save();

    res.status(200).json({
        success: true,
        url: session.url,
    });
});



// stripe webhok 
export const stripeWebhook = async (req, res) => {
    let event;

    try {
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        const header = req.headers["stripe-signature"];

        event = stripe.webhooks.constructEvent(payloadString, header, secret);
    } catch (error) {
        console.error("Webhook error:", error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
        try {
            const session = event.data.object;

            // Find purchase by paymentId saved in checkout
            const purchase = await PurchaseCourse.findOne({
                paymentId: session.id,
            }).populate({ path: "courseId" });

            if (!purchase) {
                return res.status(404).json({ message: "Purchase not found" });
            }

            if (session.amount_total) {
                purchase.amount = session.amount_total / 100;
            }
            purchase.status = "completed";

            // Make lectures visible
            if (purchase.courseId && purchase.courseId.lectures.length > 0) {
                await Lecture.updateMany(
                    { _id: { $in: purchase.courseId.lectures } },
                    { $set: { isPreviewFree: true } }
                );
            }

            await purchase.save();

            // Update user enrolledCourses
            await User.findByIdAndUpdate(
                purchase.userId,
                { $addToSet: { enrolledCourses: purchase.courseId._id } },
                { new: true }
            );

            // Update course enrolledStudents
            await Course.findByIdAndUpdate(
                purchase.courseId._id,
                { $addToSet: { enrolledStudents: purchase.userId } },
                { new: true }
            );

        } catch (error) {
            console.error("Error handling event:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    res.status(200).send();
};

export const getPurchaseCourseDetails = catchAsyncErrors(async (req, res, next) => {
    const { courseId } = req.params;
    const userId = req.id;

    if (!courseId || !userId) {
        return next(new appError("Invalid Credentials", 401));
    }

    const course = await Course.findById(courseId)
        .populate({ path: "creator" })
        .populate({ path: "lectures" })

    const purchased = await PurchaseCourse.findOne({ userId, courseId });

    if (!course) {
        return next(new appError("Course Not Found", 404));
    }


    return res.status(200).json({
        course,
        purchased: !!purchased // true if purchased else false
    });
});

export const getAllPurchasedCourses = catchAsyncErrors(async (_, res) => {
    const purchasedCourses = await PurchaseCourse.find({ status: "completed" }).populate("courseId");

    if (!purchasedCourses || purchasedCourses.length === 0) {
        return res.status(404).json({
            purchasedCourses: []
        });
    }

    return res.status(200).json({
        purchasedCourses,
    });
});