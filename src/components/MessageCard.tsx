"use client"

import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Message } from '@/models/User.model'
import { useToast } from './ui/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
  


type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
  }

const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {

    const {toast} =  useToast();

    const handleDeleteConfirm = async() => {
        try {
            const response = await axios.delete(`/api/delete-message/${message._id}`);
            toast({
                title: response.data.message
            });
            onMessageDelete(message._id as string);
        } catch (error) {
            console.log("Error while deleting the message", error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data?.message;
            toast({
                title: "Error While delting the message",
                description: errorMessage,
                variant: 'destructive'
            });
        }
    }
  return (
    <>
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive"><X className='w-5 h-5'/></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                
            </CardContent>
        </Card>
    </>
  )
}

export default MessageCard