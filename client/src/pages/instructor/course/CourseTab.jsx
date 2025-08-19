import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetCourseByIdQuery, usePublishCourseMutation, useUpdateCourseMutation } from '@/redux/features/api/courseApi';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CourseTab = () => {

    const [input, setInput] = useState({
        title: "",
        subTitle: "",
        description: "",
        category: "",
        level: "",
        price: "",
        courseThumbnail: "",
    });

    const params = useParams();
    const courseId = params.courseId;

    const { data: courseByIdData, isLoading: courseByIdIsLoading, refetch } = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });


    useEffect(() => {
        if (courseByIdData?.course) {
            const course = courseByIdData?.course;
            setInput({
                title: course.title,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                level: course.level,
                price: course.price,
                courseThumbnail: "",
            })
        }
    }, [courseByIdData]);

    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const [updateCourse, { data, isLoading, isSuccess, error }] = useUpdateCourseMutation();

    const [publishCourse, {
        data: publishData,
        isLoading: publishIsLoading,
        isSuccess: publishIsSuccess,
        error: publishError
    }] = usePublishCourseMutation();

    const navigate = useNavigate();

    const onChangeHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    };

    const selectCategoryHandler = (value) => {
        setInput({ ...input, category: value });
    };

    const selectLevelHandler = (value) => {
        setInput({ ...input, level: value });
    };

    const thumbnailHandler = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            setInput({ ...input, courseThumbnail: file });
            const fileReader = new FileReader();

            fileReader.onloadend = () => setThumbnailPreview(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    }

    const updateCourseHandler = async (e) => {
        const formData = new FormData();
        formData.append("title", input.title);
        formData.append("subTitle", input.subTitle);
        formData.append("description", input.description);
        formData.append("category", input.category);
        formData.append("level", input.level);
        formData.append("price", input.price);
        formData.append("courseThumbnail", input.courseThumbnail);

        await updateCourse({ formData, courseId });
    }

    const publishCourseHandler = async (action) => {
        try {
            const response = await publishCourse({ courseId, query: action });
            if (response.data) {
                refetch();
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error(`Failed To Publish Or UnPublish Data`);
        }
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Course Updated");
        }
        if (error) {
            toast.error(error?.data?.message || "Update Failed");
        }
    }, [isSuccess, error]);

    if (courseByIdIsLoading) return <Loader2 className='h-4 w-4 animate-spin' />

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Course Information</CardTitle>
                    <CardDescription>
                        Make Changes And Click On Save
                    </CardDescription>
                </div>
                <div className='space-x-2'>
                    <Button disabled={courseByIdData?.course.lectures.length === 0} onClick={() => publishCourseHandler(courseByIdData?.course.isPublished ? "false" : "true")}>
                        {
                            courseByIdData?.course.isPublished ? "Ubpublished" : "Publish"
                        }
                    </Button>
                    <Button variant="outline">Remove Course</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-4 mt-5'>
                    <div>
                        <Label>Title</Label>
                        <Input
                            value={input.title}
                            onChange={onChangeHandler}
                            name="title"
                            type="text"
                            placeholder="e.g Full Stack Development"
                        />
                    </div>
                    <div>
                        <Label>Sub Title</Label>
                        <Input
                            value={input.subTitle}
                            onChange={onChangeHandler}
                            name="subTitle"
                            type="text"
                            placeholder="e.g Become a full stack developer"
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>
                    <div className='flex items-center gap-5'>
                        <Label>Category</Label>
                        <Select value={input.category} onValueChange={selectCategoryHandler}>
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
                        <Label>Course Level</Label>
                        <Select value={input.level} onValueChange={selectLevelHandler}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Course Level</SelectLabel>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Pro">Pro</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div>
                            <Label>Price in (INR)</Label>
                            <Input
                                type="number"
                                name="price"
                                value={input.price}
                                onChange={onChangeHandler}
                                placeholder="e.199"
                                className="w-fit"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Course Thumbnail</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            className="w-fit"
                            onChange={thumbnailHandler}
                        />
                        {
                            thumbnailPreview && (
                                <img
                                    src={thumbnailPreview}
                                    alt="courseThumbnail"
                                    className='w-64 my-2'
                                />
                            )
                        }
                    </div>
                    <div className='flex gap-4'>
                        <Button onClick={() => navigate("/admin/course")} variant="outline" >Cancel</Button>
                        <Button onClick={updateCourseHandler} disabled={isLoading}>
                            {
                                isLoading
                                    ?
                                    (
                                        <>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                            Please wait
                                        </>
                                    )
                                    :
                                    "Save"
                            }
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CourseTab