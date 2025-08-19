import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Course from './Course'
import { useLoadUserQuery, useUpdateUserMutation } from '@/redux/features/api/authApi'
import { toast } from 'sonner'

const Profile = () => {
  const [name, setName] = useState("");

  const [profilePhoto, setProfilePhoto] = useState(null);

  const { data: userProfile, isLoading: profileLoading, refetch } = useLoadUserQuery();

  const [updateUser, { data, isLoading, isSuccess, isError, error }] = useUpdateUserMutation();

  useEffect(() => {
    if (userProfile) setName(userProfile.user.name)
  }, [userProfile]);

  const onFileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  }

  const updateUserHandler = async (e) => {
    const formData = new FormData();
    formData.append("name", name);
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto)
    };

    await updateUser(formData);
  }

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      refetch(); // fetching data after update without refreshing 
      toast.success(data.message || "Profile Updated");
    }
    if (isError) {
      toast.error(error.message || "Update Failed");
    }
  }, [
    isSuccess,
    isError,
    data,
    error
  ]);

  if (profileLoading) return <ProfileSkeleton />;

  const { user } = userProfile;

  return (
    <div className='max-w-4xl mx-auto px-4 my-10'>
      <h1 className='font-bold text-2xl text-center md:text-left'>Profile</h1>
      <div className='flex flex-col md:flex-row items-center md:items-start gap-8 my-8'>
        <div className='flex flex-col items-center'>
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} />
            <AvatarFallback>AR</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div>
            <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
              Name: <span className='font-normal text-gray-700 dark:text-gray-100'>{user.name}</span>
            </h1>
          </div>
          <div className='mb-2'>
            <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
              Email: <span className='font-normal text-gray-700 dark:text-gray-100'>{user.email}</span>
            </h1>
          </div>
          <div className='mb-2'>
            <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
              Role: <span className='font-normal text-gray-700 dark:text-gray-100'>{user.role.toUpperCase()}</span>
            </h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Edit Profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit your profile</DialogTitle>
                <DialogDescription>Edit your profile here and click on save to make changes.</DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Name" className="col-span-3" />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label>Profile Pic</Label>
                  <Input onChange={onFileChangeHandler} type="file" className="col-span-3" accept="image/*" />
                </div>
              </div>
              <DialogFooter>
                {
                  isLoading ? (
                    <Button disabled>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please Wait
                    </Button>
                  ) : (
                    <Button type="submit" onClick={updateUserHandler}>Save Changes</Button>
                  )
                }
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <h1 className='font-medium text-lg'>Enrolled Courses</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5'>
          {
            user.enrolledCourses.length === 0
              ? (<h1>You Haven't Enrolled any course</h1>)
              : (user.enrolledCourses.map((course) => <Course key={course._id} course={course} />))
          }
        </div>
      </div>
    </div>
  )
}

export default Profile;

// 👇 Skeleton Component Included Below

const ProfileSkeleton = () => {
  return (
    <div className='max-w-4xl mx-auto px-4 my-24'>
      <div className='animate-pulse'>
        {/* Profile Title */}
        <div className='h-6 bg-gray-300 dark:bg-gray-700 w-1/3 mb-8 rounded'></div>

        {/* Profile Section */}
        <div className='flex flex-col md:flex-row items-center md:items-start gap-8 mb-8'>
          {/* Avatar Skeleton */}
          <div className='flex flex-col items-center'>
            <div className='h-32 w-32 rounded-full bg-gray-300 dark:bg-gray-700 mb-4'></div>
          </div>

          {/* Profile Details */}
          <div className='space-y-4 w-full'>
            <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3'></div>
            <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2'></div>
            <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3'></div>
            <div className='h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded'></div>
          </div>
        </div>

        {/* Enrolled Courses Title */}
        <div className='h-5 bg-gray-300 dark:bg-gray-700 w-40 mb-4 rounded'></div>

        {/* Enrolled Courses Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className='h-40 bg-gray-300 dark:bg-gray-700 rounded-lg'
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
