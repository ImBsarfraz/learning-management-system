import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const purchaseApi = createApi({
    reducerPath: "purchaseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://learning-management-system-ufay.onrender.com/api/v1/purchase",
        credentials: "include"
    }),
    endpoints: (builder) => ({
        createCheckoutSession: builder.mutation({
            query: (courseId) => ({
                url: "/checkout/create-checkout-session",
                method: "POST",
                body: courseId,
            })
        }),
        getPurchasedCourseDetails: builder.query({
            query: (courseId) => ({
                url: `/course/${courseId}/purchase-course-details`,
                method: "GET"
            })
        }),
        getAllPurchasedCourses: builder.query({
            query: () => ({
                url: "/",
                method: "GET"
            })
        })
    })
});

export const { useCreateCheckoutSessionMutation, useGetPurchasedCourseDetailsQuery, useGetAllPurchasedCoursesQuery } = purchaseApi;