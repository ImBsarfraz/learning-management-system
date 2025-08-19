import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react';
import { useCreateCheckoutSessionMutation } from '@/redux/features/api/purchaseApi';
import { toast } from 'sonner';

const PurchaseCourseBtn = ({ courseId }) => {
  const [createCheckoutSession, {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  }] = useCreateCheckoutSessionMutation();

  const createCheckoutHandler = async () => {
    await createCheckoutSession({courseId});
  }

  useEffect(() => {
    if (isSuccess) {
      if(data?.url) {
        window.location.href = data.url // redirecting to stripe checkout url
      }
    } 
    if (isError) {
      toast.error(error?.data?.message || "Failed to create checkout");
    }
  }, [data, isSuccess, isError, error]);

  return (
    <Button disabled={isLoading} onClick={createCheckoutHandler} className="w-full">
      {
        isLoading ? (
          <>
            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
            Purchasing...
          </>
        ) : "Purchase Course"
      }
      
    </Button>
  )
}

export default PurchaseCourseBtn