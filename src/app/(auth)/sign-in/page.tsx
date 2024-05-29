'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchame } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

const SignIn = () => {

  
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();
  const router = useRouter();

  //Zod implementation --> same we will do in other projects also 
  const form = useForm<z.infer<typeof signInSchame>>({
    resolver: zodResolver(signInSchame),
    defaultValues: {
      identifier: '',
      password: '',
    }
  });



  const onSubmit = async(data: z.infer<typeof signInSchame>) => {
    setIsLoading(true);
   //here implementing next auth
    const result = await signIn('credentials', {
      redirect: false,// we will manually redirect the user.
      identifier: data.identifier,
      password: data.password
    });
    
    //checking for error
    if(result?.error){
      if(result.error === 'CredentialsSignin'){
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } 

    
    //checking for url and then redirecting 
    if(result?.url){
      console.log("login successful");
      router.replace('/dashboard');
    }

    setIsLoading(false);    
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                  Login in Cryptic Whispers
                </h1>
                <p className="mb-4">Log In to start your anonymous adventure</p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
              <FormItem>
                  <FormLabel>Email/username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email/username" 
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                  </>
                ) : ("Login")}
              </Button>
              </form>
            </Form>
            <div className="text-center mt-4">
                <p>
                  Register Yourself?{' '}
                  <Link href={'/sign-up'} className="text-blue-600 hover:text-blue-800">Sign Up</Link>
                </p>
            </div>
          </div>
      </div>
    </>
  )
}

export default SignIn;