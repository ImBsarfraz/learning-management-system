import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const purchaseApi = createApi({
    reducerPath: "purchaseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/v1",
        credentials: "include"
    }),
    endpoints: (builder) => ({
        createCheckoutSession: builder.mutation({
            query: (courseId) => ({
                url: "/purchase/checkout/create-checkout-session",
                method: "POST",
                body: courseId,
            })
        }),
        getPurchasedCourseDetails: builder.query({
            query: (courseId) => ({
                url: `/purchase/course/${courseId}/purchase-course-details`,
                method: "GET"
            })
        }),
        getAllPurchasedCourses: builder.query({
            query: () => ({
                url: "/purchase/",
                method: "GET"
            })
        })
    })
});

export const { useCreateCheckoutSessionMutation, useGetPurchasedCourseDetailsQuery, useGetAllPurchasedCoursesQuery } = purchaseApi;