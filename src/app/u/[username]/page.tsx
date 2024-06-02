'use client'

import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import {acceptMessageSchema} from '@/schemas/messageSchema'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { Form } from '@/components/ui/form';




const PublicProfile = () => {

const {username} = useParams();
const [isLoading, setIsLoading] = useState<boolean>(false);

const {toast} = useToast();


const {data: session} = useSession();
const user = session?.user as User;



const form = useForm<z.infer<typeof acceptMessageSchema>>({
  resolver: zodResolver(acceptMessageSchema),
});


const senMessage = async(data: z.infer<typeof acceptMessageSchema>) => {
  setIsLoading(true);
  try {
    const response = await axios.post<ApiResponse>('/api/send-message', {
      username,
      content: data.content,
    });

    toast({
      title: "Message Sent",
      description: response.data.message
    });
  } catch (error) {
    const apiError = error as AxiosError<ApiResponse>;
    toast({
      title: "Error while sending message",
      description: apiError.response?.data.message || "Error while sending message.",
      variant: 'destructive'
    });
  } finally{
    setIsLoading(false);
    form.reset();
  }
}

// if (user.isAcceptingMessages === false) {
//   return <div>User is not accepting messages.</div>;
// }

  return (
    <>
      <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 rounded w-full max-w-6xl'>
        <h1 className="text-4xl font-bold mb-4">Public Profile</h1>

        <div className='mb-4 flex items-center'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(senMessage)} className='w-full'>
                <div className="grid w-full gap-1.5">
                <Label htmlFor="message">Your secret message will be deliverd to @{username}.</Label>
                <Textarea
                placeholder="Type your message here." 
                id="message"
                className='w-full'
                {...form.register('content')}
                />
                {form.formState.errors.content && (
                  <p className='mt-2 text-sm text-red-600'>{form.formState.errors.content.message}</p>
                )}
                <div className='mt-2 flex justify-center'>
                  <Button type='submit' disabled={isLoading}>{isLoading ? <Loader2 className='animate-ping' /> : "Send Message"}</Button>
                </div>
              </div>
            </form>
          </Form>     
        </div>
      </div>
    </>
  )
}

export default PublicProfile;