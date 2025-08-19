import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateCourseMutation } from '@/redux/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const CreateCourse = () => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");

    const [createCourse,
        { data, isLoading, isSuccess, error }
    ] = useCreateCourseMutation();

    const navigate = useNavigate();

    const getSelectedCategory = (value) => {
        setCategory(value);
    }

    const createCourseHandler = async () => {
        await createCourse({ title, category });
    };

    // success message

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Course Created Successfully");
            navigate("/admin/course");
        }

        if (error) {
            toast.error(error?.data?.message || "Failed to create course");
        }
        
    }, [isSuccess, error])

    return (
        <div className='flex-1 mx-10 '>
            <div className='mb-4'>
                <h1 className='font-bold text-xl'>
                    Create Course
                </h1>
                <p className='text-sm'>Lets Make Revolution In The Tech Industry</p>
            </div>
            <div className='space-y-4'>
                <div>
                    <Label>Course Title</Label>
                    <Input onChange={(e) => setTitle(e.target.value)} value={title} type="text" name="title" placeholder="Enter course name" />
                </div>
                <div>
                    <Label>Course Category</Label>
                    <Select onValueChange={getSelectedCategory}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Category</SelectLabel>
                                <SelectItem value="Full Stack">Full Stack</SelectItem>
                                <SelectItem value="MEAN Stack">MEAN Stack</SelectItem>
                                <SelectItem value="MERN Stack">MERN Stack</SelectItem>
                                <SelectItem value="Frontend">Frontend</SelectItem>
                                <SelectItem value="Backend">Backend</SelectItem>
                                <SelectItem value="Database">Database</SelectItem>
                                <SelectItem value="Programming">Programming</SelectItem>
                                <SelectItem value="Tool">Tool</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex items-center gap-2'>
                    <Button onClick={() => navigate("/admin/course")} variant={"outline"}>Back</Button>
                    <Button disabled={isLoading} onClick={createCourseHandler}>{
                        isLoading ? (<>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please Wait
                        </>)
                            : "Create"
                    }</Button>

                </div>
            </div>
        </div>
    )
}

export default CreateCourse