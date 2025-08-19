import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/redux/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lectures from './Lectures'

const CreateLecture = () => {
    const [title, setTitle] = useState("");

    const { courseId } = useParams();

    const [createLecture, { data, isSuccess, isLoading, error }] = useCreateLectureMutation();

    const {
        data: lectureData,
        isLoading: lectureIsLoading,
        error: lectureError,
        refetch,
    } = useGetCourseLectureQuery(courseId);


    const navigate = useNavigate();

    const createLectureHandler = async () => {

        await createLecture({ title, courseId });

    }

    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success(data?.message || "Lecture Created");
        }
        if (error) {
            toast.error(error?.data?.message || "Failed To Create Lecture");
        }
    }, [isSuccess, error]);

    return (
        <div className='flex-1 mx-10 '>
            <div className='mb-4'>
                <h1 className='font-bold text-xl'>
                    Create Lecture
                </h1>
                <p className='text-sm'>Lets Make Revolution In The Tech Industry</p>
            </div>
            <div className='space-y-4'>
                <div>
                    <Label>Lecture Title</Label>
                    <Input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder="Enter lecture title" />
                </div>
                <div className='flex items-center gap-2'>
                    <Button onClick={() => navigate(`/admin/course/${courseId}`)} variant={"outline"}>Back to Course</Button>
                    <Button onClick={createLectureHandler} disabled={isLoading}>{
                        isLoading ? (<>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please Wait
                        </>)
                            : "Create Lecture"
                    }</Button>

                </div>

                <div className='mt-10'>
                    {
                        lectureIsLoading
                            ? (<p>Loading Lectures...</p>)
                            : lectureError
                                ? (<p>Failed To Load Lectures</p>)
                                : lectureData.lectures.length === 0
                                    ? (<p>Lectures Not Availabel</p>)
                                    : (
                                        lectureData.lectures.map((lecture, index) => (
                                            <Lectures key={lecture._id} courseId={courseId} lecture={lecture} index={index} />
                                        ))
                                    )
                    }
                </div>
            </div>
        </div>
    )
}

export default CreateLecture