'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback} from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpValidation } from "@/schemas/signUpSchema"
import axios, {AxiosError} from 'axios';
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const SignUp = () => {

  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');//backend se koi message ayega toh yeh uska state hai
  const [isCheckingUsername, setIsCheckingUsername] = useState(false); //loading state chaiye jo username ko check krega on every key press.
  const [isSubmitting, setIsSubmitting] = useState(false); //state for checking form is submitting

  //using useDebounceVlaue hook we send request after username is set
  const debounced = useDebounceCallback(setUsername, 400);
  const {toast} = useToast();
  const router = useRouter();

  //Zod implementation --> same we will do in other projects also 
  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  });


  //will be using useEffect when page load first time we will check if the username is available or not and have a dependency on debouncedUsername
  useEffect(() => {
    //username check krenge
    const checkUsernameUnique = async () => {
      //if debouncedusername mei koi value hai ya nahi
      if(username){
        setIsCheckingUsername(true);//isako true kr dia loading ho rahi hai
        setUsernameMessage(''); //username ko empty kr dia agr last time ki request ka user hoga toh empty ho jayega ya error aa jayegi.

        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          //server se is route se message aata hai to isko message mei set kre denge
          setUsernameMessage(response.data?.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>; //casting error as axios error
          setUsernameMessage(axiosError.response?.data?.message ?? "Error checking username");
        }
        finally { //finally will alwyas run
          setIsCheckingUsername(false);
        }
      }
    }

    //calling the function
    checkUsernameUnique();
  }, [username]);

  //making one method for submitting the form
  const onSubmit = async(data: z.infer<typeof signUpValidation>) => {
    setIsSubmitting(true);
    try {
     const response = await axios.post<ApiResponse>(`/api/sign-up`, data);
     console.log(response.data);
     //if we get the response then user ko toast messaeg show kr denge
     toast({
      title: 'Success',
      description: response.data.message,
     });
     //router use krke user ko new route pr le jayenge 
     router.replace(`/verify/${username}`)
     setIsSubmitting(false);
    } catch (error) {
      console.error("error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                  Join Cryptic Whispers
                </h1>
                <p className="mb-4">Sign up to start your anonymous adventure</p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
              <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                    />
                    </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin"/>}
                    <p className={`text-sm ${usernameMessage === "username is unique" ? "text-green-500" : "text-red-500"}`}>
                        {usernameMessage}
                    </p>
                  <FormMessage />
                </FormItem>
                )}
              />

              <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
              <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" 
                    {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )}
              />

              <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
              <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" 
                    {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                  </>
                ) : ("Signup")}
              </Button>
              </form>
            </Form>
            <div className="text-center mt-4">
                <p>
                  Already Member?{' '}
                  <Link href={'/sign-in'} className="text-blue-600 hover:text-blue-800">Sign In</Link>
                </p>
            </div>
          </div>
      </div>
    </>
  )
}

export default SignUp;