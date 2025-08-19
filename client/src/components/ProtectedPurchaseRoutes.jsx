import { useGetPurchasedCourseDetailsQuery } from "@/redux/features/api/purchaseApi";
import { Navigate, useParams } from "react-router-dom"

export const ProtectedPurchaseRoutes = ({ children }) => {
    const { courseId } = useParams();

    const { data, isLoading } = useGetPurchasedCourseDetailsQuery(courseId);

    if (isLoading) return <p>Loading...</p>

    return data?.purchased ? children : <Navigate to={`/course-details/${courseId}`} />
}
