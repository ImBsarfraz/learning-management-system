import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("")
  }

  return (
    <div className='flex flex-col items-center justify-center  w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70 dark:from-cyan-950/70'>
      <h1 className='md:text-4xl text-2xl relative font-bold text-gray-800 dark:text-gray-400 max-w-3xl mx-auto'>Empower your future with the
        courses designed to <span className='text-blue-600 dark:text-cyan-600'>fit your choice.</span></h1>

      <p className='md:block hidden text-gray-500 dark:text-gray-400 max-2-2xl mx-auto'>We bring together world-class instructors, interactive content, and a supportive
        community to <br />help you achieve your personal and professional goals.</p>

      <p className='md:hidden text-gray-500 dark:text-gray-400 max-w-sm mx-auto'>
        We bring together world-class instructors, interactive content, and a supportive
        community to help you achieve your personal and professional goals.
      </p>

      <form onSubmit={searchHandler} className="flex items-center bg-blue-100 dark:bg-cyan-950 rounded-full shadow-md overflow-hidden max-w-xl mx-auto mb-8 dark:ring-blue-800">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Search for courses"
          className="flex-grow bg-transparent  border-none focus:ring-0 focus:outline-none px-5 py-3 text-gray-800 dark:text-gray-100 placeholder-gray-700 dark:placeholder-gray-400"
        />
        <Button className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800">
          Search
        </Button>
      </form>
      <Button className="bg-gray-900 dark:bg-cyan-800 text-blue-300 dark:text-gray-200 hover:text-blue-700 rounded-full hover:bg-gray-300 dark:hover:bg-cyan-950/70">Explore Courses</Button>
    </div>
  )
}

export default Hero