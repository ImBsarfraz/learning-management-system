import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import LectureTab from './LectureTab'

const UpdateLecture = () => {
    const { courseId } = useParams();

    return (
        <div>
            <div className='flex items-center justify-between mb-0.5'>
                <div className='flex items-center gap-2'>
                    <Link to={`/admin/course/${courseId}/lecture`}>
                        <Button className="rounded-full" size='icon' variant="outline"><ArrowLeft size={16} /></Button>
                    </Link>
                    <h1 className='font-bold text-xl'>Update the lecture</h1>
                </div>
            </div>
            <LectureTab />
        </div>

    )
}

export default UpdateLecture