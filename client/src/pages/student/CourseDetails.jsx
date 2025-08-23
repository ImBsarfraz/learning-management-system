import PurchaseCourseBtn from '@/components/PurchaseCourseBtn'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetPurchasedCourseDetailsQuery } from '@/redux/features/api/purchaseApi'
import { BadgeInfo, Lock, PlayCircle } from 'lucide-react'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const {
        data,
        isLoading,
        isError,
    } = useGetPurchasedCourseDetailsQuery(courseId);

    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <h1>Failed Load Course Details</h1>

    const { course, purchased } = data;

    const handleContinueCourse = () => {
        if (purchased) {
            navigate(`/course-progress/${courseId}`);
        }
    }

    return (
        <div className='space-y-5'>
            <div className='bg-[#2D2F31] dark:bg-cyan-950 text-white p-4'>
                <div className='max-w-7xl mx-auto py-8 px-4 md:px-0 flex-col gap-2'>
                    <h1 className='font-bold text-2xl md:text-3xl'>{course?.title}</h1>
                    <p className='text-base md:text-lg'>{course?.subTitle}</p>
                    <p>Created By: <span className='text-[#C0C4FC] underline italic'>{course?.creator?.name}</span></p>
                    <div className='flex items-center gap-2 text-sm'>
                        <BadgeInfo size={16} />
                        <p>Last Updated {course?.createdAt.split("T")[0]}</p>
                    </div>
                    <p>Student Enrolled: {course?.enrolledStudents?.length}</p>
                </div>
            </div>
            <div className='mx-w-7xl mx-auto my-5 px-4 md:px-17 flex flex-col lg:flex-row justify-between gap-10'>
                <div className='w-full lg:w-1/2 space-y-5 '>
                    <h1 className='font-bold text-xl md:text-2xl'>Description</h1>
                    <p className='text-sm' dangerouslySetInnerHTML={{ __html: course?.description }} />
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                            <CardDescription>4 Lectures</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {
                                course.lectures.map((lecture, index) => (
                                    <div className='flex items-center gap-3 text-sm' key={index}>
                                        <span>
                                            {
                                                true
                                                    ? (<PlayCircle size={14} />)
                                                    : (<Lock size={14} />)
                                            }
                                        </span>
                                        <p>{lecture.title}</p>
                                    </div>
                                ))
                            }
                        </CardContent>
                    </Card>
                </div>

                <div className='w-full lg:w-1/3'>
                    <Card>
                        <CardContent className="p-0 flex flex-col">
                            <div className='w-full aspect-video mb-4 p-0'>
                                <video
                                    src={course?.lectures?.[0]?.videoUrl}
                                    controls
                                    className='w-full h-auto md:rounded-lg'
                                />
                            </div>
                            <h1>{ }</h1>
                            <Separator className="my-2" />
                            <h1 className='text-lg md:text-2xl font-semibold p-4'>₹ {course?.price}</h1>
                        </CardContent>
                        <CardFooter className="flex justify-center p-4">
                            {
                                purchased
                                    ? (
                                        <Button onClick={handleContinueCourse} className="w-full">Continue Course</Button>

                                    ) :
                                    (<PurchaseCourseBtn courseId={courseId} />)
                            }
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default CourseDetails