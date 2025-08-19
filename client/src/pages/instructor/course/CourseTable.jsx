import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Edit } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { useGetAllCoursesQuery } from '@/redux/features/api/courseApi';

const CourseTable = () => {
  const { data, isLoading, error } = useGetAllCoursesQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Something went wrong while fetching courses.");
    }
  }, [error]);

  if (isLoading) return <h1>Loading...</h1>;

  const courses = data?.courses || [];

  return (
    <div className="space-y-4">
      <Button onClick={() => navigate('create')}>Create Course</Button>

      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <Table>
          <TableCaption>A list of your recent courses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell className="font-medium">
                  {course?.price ? `₹${course.price}` : 'NA'}
                </TableCell>
                <TableCell>
                  <Badge variant={course.isPublished ? "default" : "secondary"}>
                    {course?.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>{course.title}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate(`${course._id}`)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CourseTable;
