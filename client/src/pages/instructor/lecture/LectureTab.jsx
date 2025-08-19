import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { useGetLectureByIdQuery, useRemoveLectureMutation, useUpdateLectureMutation } from '@/redux/features/api/courseApi'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

const mediaApi = "http://localhost:4000/api/v1/media";

const LectureTab = () => {
    const [title, setTitle] = useState("");
    const [videoInfo, setVideoInfo] = useState(null);
    const [isPreviewFree, setIsPreviewFree] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const { courseId, lectureId } = useParams();

    const [updateLecture,
        { data, isLoading, isSuccess, error }
    ] = useUpdateLectureMutation();

    const [
        removeLecture, {
            data: removeData,
            isLoading: removeIsLoading,
            isSuccess: removeIsSuccess,
            error: removeError
        }] = useRemoveLectureMutation();

    const { data: lectureData } = useGetLectureByIdQuery(lectureId);

    const lecture = lectureData?.lecture;

    const onFileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            setIsUploading(true);

            try {
                const res = await axios.post(`${mediaApi}/upload-video`, formData, {
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                        }
                    }
                });

                if (res.data.success) {
                    setVideoInfo({ videoUrl: res.data.data.url, publicId: res.data.data.public_id });
                    setButtonDisabled(false);
                    toast.success(res.data.message);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Video upload failed");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const updateLectureHandler = async (e) => {
        await updateLecture({
            title,
            videoInfo,
            isPreviewFree,
            courseId,
            lectureId,
        })
    }

    const removeLectureHandler = async () => {
        await removeLecture(lectureId);
    }

    useEffect(() => {

        if (lecture) {
            setTitle(lecture.title);
            setIsPreviewFree(lecture.isPreviewFree),
            setVideoInfo(lecture.videoInfo);
        }

        if (isSuccess) {
            toast.success(data?.message || "Lecture Updated");
        };

        if (error) {
            toast.error(error?.data?.message || "Failed To Update Lecture");
        }

        if (removeIsSuccess) {
            toast.success(removeData?.message || "Lecture Removed");
        }
        
        if (removeError) {
            toast.error(error?.removeData?.message || "Faled To Remove Lecture");
        }

    }, [lecture, isSuccess, error, removeIsSuccess, removeError]);

    return (
        <Card className="mt-10">
            <CardHeader className="flex justify-between">
                <div>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>Lets Complete The Process Of Revolution</CardDescription>
                </div>
                <div>
                    <Button disabled={removeIsLoading} onClick={removeLectureHandler} variant="destructive">
                        {
                            removeIsLoading ?
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Removing...
                                </>
                                : "Remove Lecture"
                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        placeholder="e.g introduction to javascript"
                        className="mt-1"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className='mt-4 flex items-center space-x-2 my-5'>
                    <Label>Video<span className='text-red-500'>*</span></Label>
                    <Input
                        type="file"
                        accept="video/*"
                        className="w-fit mt-1"
                        onChange={onFileChangeHandler}
                    />
                    <Label htmlFor="isPreviewFree">Is This Lecture Free</Label>
                    <Switch
                        id="isPreviewFree"
                        checked={isPreviewFree}
                        onCheckedChange={setIsPreviewFree}
                    />
                </div>

                {isUploading && (
                    <div>
                        <Progress value={uploadProgress} />
                        <p>{uploadProgress}% uploaded</p>
                    </div>
                )}

                <div className='mt-4'>
                    <Button onClick={updateLectureHandler} disabled={buttonDisabled || isLoading}>
                        {
                            isLoading ?
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Updating...
                                </>
                                : "Update Lecture"
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default LectureTab;
