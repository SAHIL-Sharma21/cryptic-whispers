//route for accept messagges

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";//we required auth options for this 
import DBConnect from "@/lib/dbConnect";
import { User } from "next-auth";// this is different user yeh hamre session mei nahi hai
import UserModel from "@/models/User.model";


//server session mei user ka session mil jayega as we have injected user information there and can retrive data

//making post route which can toggle or flip on or off the accepting message
export async function POST(request: Request){
    await DBConnect();

    const session = await getServerSession(authOptions);//we will get current session 
    const user:User = session?.user as User  //extracting  user --> here as User is assertion

    //if we dont haev session and dont  have user then we will return thr respose
    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 401});
    }

    //we will need users id and then make db query
    const userId = user._id

    //forntend pass the acceptMessage flag in the request
    const {acceptMessages} = await request.json();

    try {
       //findign user and updating him
      const updatedUser = await UserModel.findByIdAndUpdate(userId, {
        isAcceptingMessage: acceptMessages
       }, {new: true}); // new property dene se hme updated user model milega.

       if(!updatedUser){
        return Response.json({
            success: false,
            message: "Failed to update the user status to accept messages."
        }, {status: 401});
       }

       //else return the response
       return Response.json({
        success: true,
        message: "Message accpetence status updated successfully.",
        updatedUser
        }, {status: 200});
    } catch (error) {
        console.error("Falied to update user status to accept messages", error);
        return Response.json({
            success: false,
            message: "Falied to update user status to accept messages",
        }, {status: 500});
    }
}


//get request
export async function GET(_: Request) {
    await DBConnect();

    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 401});
    }

    const userId = user._id;    

    try {
        
        const foundUser = await UserModel.findById(userId);

        if(!foundUser){
            return Response.json({
                success: false,
                message: "User not found",
            }, {status: 404});
        }
        
        //if user mil gya toh response return kr denge
        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage,
        }, {status: 200});



    } catch (error) {
        console.error("Error in getting message acceptance status.", error);
        return Response.json({
            success: false,
            message: "Error in getting message acceptance status.",
        }, {status: 500});
    }
}