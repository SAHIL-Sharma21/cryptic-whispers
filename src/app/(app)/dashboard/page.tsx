'use client'

import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message, User } from '@/models/User.model';
import { acceptMessageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

const DashBoard = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

  const {toast} = useToast();

  //setMessage call krke usme if messageId nhi hia message ki toh uslo filter kr denge
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => messageId !== message._id));
  }

  //user ka seesion nikal lenghe
  const {data: session} = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  //destructre the form
  const {register, watch, setValue} = form;

//ek ek ke tyupe ko acceptMessages deneg tb yeh usko watch krega
const acceptMessage = watch('acceptMessage');


//making api calls with calkback hook
const fetchAcceptMessage = useCallback(async() => {
  setIsSwitchLoading(true);
    try {
     const response = await axios.get<ApiResponse>('/api/accept-messages');
     setValue('acceptMessage', response.data.isAcceptingMessages);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message setting",
        variant: "destructive",
      });
      
    } finally {
      setIsSwitchLoading(false);
    }

}, [setValue]);


//get all messages --> user will give refreh if he does not then its default value is false
const fetchMessages = useCallback(async(refresh: boolean = false) => {
  setIsLoading(true);
  setIsSwitchLoading(false);
   try {
     const response = await axios.get<ApiResponse>('/api/get-messages');
     setMessages(response.data.messages || []);
     if(refresh){
       toast({
        title: "Refreshed messages",
        description: "Showing latest messages",
       });
     }
   } catch (error) {
     const axiosError = error as AxiosError<ApiResponse>;
     toast({
       title: "Error",
       description: axiosError.response?.data.message || "Failed to fetch message setting",
       variant: "destructive",
     });
   } finally{
    setIsLoading(false);
    setIsSwitchLoading(false);
   }
}, [setIsLoading, setMessages]);




useEffect(() => {
  if(!session || !session.user) return  //user and session nhi hai toh seedha return ho jayega yeh method nhi chalega

  fetchMessages();
  fetchAcceptMessage();
}, [session, setValue, fetchAcceptMessage, fetchMessages]);


const handleSwitchChange = async () => {
  try {
    const response = await axios.post<ApiResponse>('/api/accept-messages', {
      acceptMessage: !acceptMessage, //potential error may occur here.
    });
    setValue('acceptMessage', !acceptMessage);
    toast({
      title: response.data.message,
      variant: "default"
    });
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    toast({
      title: "Error",
      description: axiosError.response?.data.message || "Failed to fetch  All messages",
      variant: "destructive",
    });
  }
}

//session se user nikal lenge
const {username} = session?.user as User;

//making host url
//todo do more research here
const baseUrl = `${window.location.protocol}//${window.location.host}`

//making profileUrl
const profileUrl = `${baseUrl}/u/${username}`

//making copy to clipboard method // we can make this function async also
const copyToClipboard = () => {
  navigator.clipboard.writeText(profileUrl);
  toast({
    title: "URL Copied",
    description: "Profile url has been copied to clipboard."
  });
}

 //conditional return
  if(!session || !session.user){
     return <div>
      Please Login
     </div>
 }


 return (
  <>
  <div className=' '>
  <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 rounded w-full max-w-6xl">
    <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
      <div className="flex items-center">
        <input
          type="text"
          value={profileUrl}
          disabled
          className="input input-bordered w-full p-2 mr-2"
        />
        <Button onClick={copyToClipboard}>Copy</Button>
      </div>
    </div>

    <div className="mb-4">
      <Switch
        {...register('acceptMessage')}
        checked={acceptMessage}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchLoading}
      />
      <span className="ml-2">
        Accept Messages: {acceptMessage ? 'On' : 'Off'}
      </span>
    </div>
    <Separator />

    <Button
      className="mt-4"
      variant="outline"
      onClick={(e) => {
        e.preventDefault();
        fetchMessages(true);
      }}
    >
      {isloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCcw className="h-4 w-4" />
      )}
    </Button>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <MessageCard
            key={String(message._id)}
            message={message}
            onMessageDelete={handleDeleteMessage}
          />
        ))
      ) : (
        <p>No messages to display.</p>
      )}
    </div>
  </div>
  </div>  
  </>
  
);
}

export default DashBoard;