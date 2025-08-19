import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'
import Course from './Course';
import { useGetPublishedCoursesQuery } from '@/redux/features/api/courseApi';

const Courses = () => {
  const { data, isLoading, isError } = useGetPublishedCoursesQuery();

  if (isError) return <h1>An Error Occured</h1>


  return (
    <div className='py-16 md:px-40 px-8 text-center dark:bg-[#0A0A0A]'>
      <div className='max-w-7xl mx-auto p-6'>
        <h2 className='text-3xl font-medium text-gray-800 dark:text-cyan-600'>Learn from the best</h2>
        <p className='text-sm md:text-base text-gray-500 mt-3'>
          Discover our top-rated courses across various categories. From coding and
          design to <br />business and wellness, our courses are crafted to deliver results.
        </p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {
          isLoading
            ?
            Array.from({ length: 4 }).map((_, index) => (<CourseSkeleton key={index} />))
            :
            data?.courses && data.courses.map((course, index) => <Course course={course} key={index} />)
        }
      </div>
    </div>
  )
}

export default Courses;

const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};