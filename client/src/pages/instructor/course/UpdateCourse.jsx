import { Button } from '@/components/ui/button'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import CourseTab from './CourseTab'

const UpdateCourse = () => {
    const params = useParams();
    return (
        <div className='flex-1'>
            <div className='flex items-center justify-between mb-5'>
                <h1 className='font-bold text-xl'>Lets Complete The Process Of Revolution</h1>
                <Link to={`/admin/course/${params.courseId}/lecture`}>
                    <Button className='hover:text-blue-600' variant="link" >Go To Lectures</Button>
                </Link>
            </div>
            <CourseTab />
        </div>
    )
}

export default UpdateCourse