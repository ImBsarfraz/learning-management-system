import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useGetCourseProgressQuery, useMarkAsCompletedMutation, useMarkAsIncompletedMutation, useUpdateLctureProgressMutation } from '@/redux/features/api/courseProgressApi'
import { CheckCircle, CheckCircle2, CirclePlay } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

const CourseProgress = () => {
    const { courseId } = useParams();

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetCourseProgressQuery(courseId);

    // Mutation Hooks

    const [updateLctureProgress] = useUpdateLctureProgressMutation();

    const [markAsCompleted, { data: completeData, isSuccess: completedIsSuccess }] = useMarkAsCompletedMutation();

    const [markAsIncompleted, { data: incompletedData, isSuccess: incompletedIsSuccess }] = useMarkAsIncompletedMutation();

    useEffect(() => {
        if (completedIsSuccess) {
            refetch();
            toast.success(completeData?.message || "Course Is Completed")
        }
        if (incompletedIsSuccess) {
            refetch();
            toast.success(incompletedData?.message || "Course Is Marked As Incompleted")
        }
    }, [completedIsSuccess, incompletedIsSuccess]);

    const [currentLecture, setCurrentLecture] = useState(null);

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Failed to load progress</p>

    const { courseDetails, progress, completed } = data.data;
    const { title } = courseDetails;

    // initialize the first lecture if not exist default lecture
    const initialLecture = currentLecture || (courseDetails?.lectures && courseDetails?.lectures?.[0]);

    const handleLectureProgress = async (lectureId) => {
        await updateLctureProgress({ courseId, lectureId });
        refetch();
    }

    // handle select a specific lecture to watch
    const handleLectureChange = (lecture) => {
        setCurrentLecture(lecture);
        handleLectureProgress(lecture?._id);
    }

    // handle complete course marking complete
    const handleCompleteCourse = async () => {
        await markAsCompleted(courseId);
    }

    // handle incomplete course 
    const handleIncompleteCourse = async () => {
        await markAsIncompleted(courseId);
    }

    // Determine if a lecture is completed by checking progress array
    const isLectureCompleted = (lectureId) => {
        return progress.some((prog) => prog?.lectureId === lectureId && prog?.viewed);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 mt-20">
            {/* Display Course Name */}
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">{title}</h1>
                <Button
                    variant={completed ? "outline" : "default"}
                    onClick={
                        completed ?
                            handleIncompleteCourse :
                            handleCompleteCourse
                    }
                >
                    {
                        completed
                            ?
                            (
                                <div className='flex items-center'>
                                    <CheckCircle className='h-4 w-4 mr-2' />
                                    <span>Completed</span>
                                </div>
                            )
                            : ("Mark As Completed")}
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Video Section */}
                <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
                    <div className="relative overflow-hidden md:rounded-lg shadow-md">
                        <video
                            src={currentLecture?.videoUrl || initialLecture?.videoUrl}
                            controls
                            className='w-full h-auto md:rounded-lg'
                            onPlay={() => handleLectureProgress(currentLecture?._id || initialLecture._id)}
                        />
                    </div>
                    {/* Display Current Watching Lecture Title and Index */}
                    <div className="mt-2">
                        <h3 className="font-medium text-lg ">
                            {
                                `Lecture ${courseDetails?.lectures?.findIndex((lect) => lect?._id === (currentLecture?._id || initialLecture?._id)) + 1} : ${currentLecture?.title || initialLecture?.title}`
                            }
                        </h3>
                    </div>
                </div>

                {/* Lecture Sidebar */}
                <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
                    <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
                    <div
                        className="flex-1 overflow-y-auto">
                        {/* Set a max height for the scrollable area */}
                        {courseDetails?.lectures?.map((lecture) => (
                            <Card
                                onClick={() => handleLectureChange(lecture)}
                                key={lecture?._id}
                                className={`mb-3 hover:cursor-pointer transition transform ${lecture?._id === currentLecture?._id ? "dark:bg-gray-800" : ""}`}
                            >
                                <CardContent className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {isLectureCompleted(lecture?._id) ? (
                                            <CheckCircle2 size={24} className="text-green-500 mr-2" />
                                        ) : (
                                            <CirclePlay size={24} className="text-gray-500 mr-2" />
                                        )}
                                        <div>
                                            <CardTitle className="text-lg font-medium">
                                                {lecture?.title}
                                            </CardTitle>
                                        </div>
                                    </div>
                                    {
                                        isLectureCompleted(lecture?._id) && (
                                            <Badge
                                                variant="outline"
                                                className="bg-green-200 text-green-600"
                                            >
                                                completed
                                            </Badge>
                                        )
                                    }
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseProgress