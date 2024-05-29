'use client'

import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z  from "zod"
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { verifySchema } from '@/schemas/verifySchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const VerifyUsername = () => {

    const router = useRouter();
    const params = useParams<{username: string}>();//params se data lenge.
    const {toast} = useToast();

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    //method to verify the user by their username
    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsLoading(true);
        try {
           const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            });
            toast({
                title: "Success",
                description: response.data?.message
            });
            setIsLoading(false);
            //redirect the user
            router.replace('/sign-in');
        } catch (error) {
            console.log("Error while verifying user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: "Failed",
                description: errorMessage,
                variant: "destructive"
            });
            setIsLoading(false);
        }
    }
    
  return (
   <>
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        name="code"
                        control={form.control}
                        render={({ field }) => (
                                <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="code" {...field} />
                                </FormControl>
                                    
                                <FormMessage />
                                </FormItem>
                                )}
                        />
                        <Button type='submit' disabled={isLoading}>
                            {isLoading ? (
                                <Loader2  className='animate-spin'/>
                            ) : ("Verify Code")}
                        </Button>
                    </form>
                </Form>
            </div> 
        </div>
   </>
  )
}

export default VerifyUsername;