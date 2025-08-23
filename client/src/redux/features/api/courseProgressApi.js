import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const courseProgressApi = createApi({
    reducerPath: "courseProgressApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/v1",
        credentials: "include",
    }),
    endpoints: (builder) => ({
        getCourseProgress: builder.query({
            query: (courseId) => ({
                url: `/progress/${courseId}`,
                method: "GET"
            })
        }),
        updateLctureProgress: builder.mutation({
            query: ({ courseId, lectureId }) => ({
                url: `/progress/${courseId}/lecture/${lectureId}/view`,
                method: "POST"
            })
        }),
        markAsCompleted: builder.mutation({
            query: (courseId) => ({
                url: `/progress/${courseId}/complete`,
                method: "POST"
            })
        }),
        markAsIncompleted: builder.mutation({
            query: (courseId) => ({
                url: `/progress/${courseId}/incomplete`,
                method: "POST"
            })
        }),
    })
});

export const {
    useGetCourseProgressQuery,
    useUpdateLctureProgressMutation,
    useMarkAsCompletedMutation,
    useMarkAsIncompletedMutation
} = courseProgressApi;