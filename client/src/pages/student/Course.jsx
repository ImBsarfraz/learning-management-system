import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'

const Course = ({ course }) => {

  return (
    <Link to={`/course-details/${course?._id}`}>
      <Card className="overflow-hidden rounded-xl dark:bg-gray-900 bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] p-0">
        <div className="relative">
          <img
            src={course?.courseThumbnail}
            alt="Course Thumbnail"
            className="w-full h-40 object-cover"
          />
          <CardContent className="px-5 py-4">
            <h2 className="text-lg font-semibold line-clamp-1 text-gray-800 dark:text-white">
              {course?.title}
            </h2>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={course?.creator?.photoUrl || "https://github.com/shadcn.png"} />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {course?.creator?.name}
                  </span>
                  <Badge className="bg-blue-600 text-white px-2 py-0.5 text-xs rounded-full mt-1 w-fit">
                    {course?.level}
                  </Badge>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-bold text-green-600 dark:text-green-400">
                  ₹{course?.price}
                </span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}

export default Course
