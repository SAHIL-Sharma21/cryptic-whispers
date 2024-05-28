'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpValidation } from "@/schemas/signUpSchema"
import axios, {AxiosError} from 'axios';
import { ApiResponse } from "@/types/ApiResponse"

const SignIn = () => {

  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');//backend se koi message ayega toh yeh uska state hai
  const [isCheckingUsername, setIsCheckingUsername] = useState(false); //loading state chaiye jo username ko check krega on every key press.
  const [isSubmitting, setIsSubmitting] = useState(false); //state for checking form is submitting

  //using useDebounceVlaue hook we send request after username is set
  const debouncedUsername = useDebounceValue(username, 300);
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
      if(debouncedUsername){
        setIsCheckingUsername(true);//isako true kr dia loading ho rahi hai
        setUsernameMessage(''); //username ko empty kr dia agr last time ki request ka user hoga toh empty ho jayega ya error aa jayegi.

        try {
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
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


  }, [debouncedUsername]);


  return (
    <div>page</div>
  )
}

export default SignIn;