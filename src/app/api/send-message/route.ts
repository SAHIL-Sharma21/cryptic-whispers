//send single message route

import DBConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import {Message} from '@/models/User.model';


export async function POST(request: Request){
    await DBConnect();

    //taking content and username --> anyown can send message
    const {username, content} = await request.json();

    try {
        //fiding user by username
       const user = await UserModel.findOne({username});

       if(!user){
        return Response.json({
            success: false,
            message: "user did not found!"
        }, {status: 404});
       }

       //if we got the user anc will check is user accepting the messages
       if(!user.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "user is not accepting messages"
            }, {status: 403});
       } 

       //if yah tk aa gye toh message craft krenge
       const newMessage = {
            content,
            createdAt: new Date(),
       }

       //if message is crafted then we will push into the user messages
       user.messages.push(newMessage as Message); //assert krva rahe hai.
       await user.save(); //user ko save krva do

       return Response.json({
        success: true,
        message: "Message sent successfully"
    }, {status: 200});
    } catch (error) {
        console.error("Error sending messages!", error);
        return Response.json({
            success: false,
            message: "Error sending messages!"
        }, {status: 500});
    }
}