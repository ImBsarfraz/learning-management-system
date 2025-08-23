import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const courseApi = createApi({
    reducerPath: "courseApi",
    tagTypes: ["Instructor Course", "Lecture"],
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/v1",
        credentials: "include"
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ title, category }) => ({
                url: "/course",
                method: "POST",
                body: { title, category }
            }),
            invalidatesTags: ["Instructor Course"]
        }),
        getSearchCourses: builder.query({
            query: ({searchQuery, categories, sortByPrice }) => {
                // Build query string
                let queryString = `/search?query=${encodeURIComponent(searchQuery)}`;
                // append categories
                if(categories && categories.length > 0) {
                    const categoriesString = categories.map((encodeURIComponent).join(","));
                    queryString += `&categories=${categoriesString}`; 
                }

                // Append sort by price if available
                if (sortByPrice) {
                    queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
                }
                return {
                    url: queryString,
                    method: "GET"
                }
            }
        }),
        getPublishedCourses: builder.query({
            query: () => ({
                url: "/course/published-courses",
                method: "GET"
            }),
        }),
        getAllCourses: builder.query({
            query: () => ({
                url: "/course",
                method: "GET",
            }),
            providesTags: ["Instructor Course"]
        }),
        updateCourse: builder.mutation({
            query: ({ formData, courseId }) => ({
                url: `/course/${courseId}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Instructor Course"]
        }),
        getCourseById: builder.query({
            query: (courseId) => ({
                url: `/course/${courseId}`,
                method: "GET"
            })
        }),
        createLecture: builder.mutation({
            query: ({ title, courseId }) => ({
                url: `/course/${courseId}/lecture`,
                method: "POST",
                body: { title }
            })
        }),
        getCourseLecture: builder.query({
            query: (courseId) => ({
                url: `/course/${courseId}/lecture`,
                method: "GET",
            }),
            providesTags: ["Lecture"],
        }),
        updateLecture: builder.mutation({
            query: ({ title, videoInfo, isPreviewFree, courseId, lectureId }) => ({
                url: `/course/${courseId}/lecture/${lectureId}`,
                method: "POST",
                body: {
                    title, videoInfo, isPreviewFree
                }
            })
        }),
        removeLecture: builder.mutation({
            query: (lectureId) => ({
                url: `/course/lecture/${lectureId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Lecture']
        }),
        getLectureById: builder.query({
            query: (lectureId) => ({
                url: `/course/lecture/${lectureId}`,
                method: "GET"
            }),
        }),
        publishCourse: builder.mutation({
            query: ({courseId, query}) => ({
                url: `/course/${courseId}?publish=${query}`,
                method: "PATCH"
            })
        }),
    }),
});

export const {
    useCreateCourseMutation,
    useGetSearchCoursesQuery,
    useGetPublishedCoursesQuery,
    useGetAllCoursesQuery,
    useUpdateCourseMutation,
    useGetCourseByIdQuery,
    useCreateLectureMutation,
    useGetCourseLectureQuery,
    useUpdateLectureMutation,
    useRemoveLectureMutation,
    useGetLectureByIdQuery,
    usePublishCourseMutation
} = courseApi;