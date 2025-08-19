import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const courseApi = createApi({
    reducerPath: "courseApi",
    tagTypes: ["Instructor Course", "Lecture"],
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:4000/api/v1/course",
        credentials: "include"
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ title, category }) => ({
                url: "",
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
                url: "/published-courses",
                method: "GET"
            }),
        }),
        getAllCourses: builder.query({
            query: () => ({
                url: "",
                method: "GET",
            }),
            providesTags: ["Instructor Course"]
        }),
        updateCourse: builder.mutation({
            query: ({ formData, courseId }) => ({
                url: `/${courseId}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Instructor Course"]
        }),
        getCourseById: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: "GET"
            })
        }),
        createLecture: builder.mutation({
            query: ({ title, courseId }) => ({
                url: `/${courseId}/lecture`,
                method: "POST",
                body: { title }
            })
        }),
        getCourseLecture: builder.query({
            query: (courseId) => ({
                url: `/${courseId}/lecture`,
                method: "GET",
            }),
            providesTags: ["Lecture"],
        }),
        updateLecture: builder.mutation({
            query: ({ title, videoInfo, isPreviewFree, courseId, lectureId }) => ({
                url: `/${courseId}/lecture/${lectureId}`,
                method: "POST",
                body: {
                    title, videoInfo, isPreviewFree
                }
            })
        }),
        removeLecture: builder.mutation({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Lecture']
        }),
        getLectureById: builder.query({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "GET"
            }),
        }),
        publishCourse: builder.mutation({
            query: ({courseId, query}) => ({
                url: `/${courseId}?publish=${query}`,
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