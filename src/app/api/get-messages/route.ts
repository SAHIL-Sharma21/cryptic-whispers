//get all messages route
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import DBConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import UserModel from "@/models/User.model";
import mongoose from "mongoose";


export async function GET(request: Request){
    await DBConnect();

    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 401});
    }

    //belwo we need mongoose ka object ID and i case the id we are getting is string 
    const userId = new mongoose.Types.ObjectId(user._id);//this will convert to mongoose object id--> jb aggregation piepline likhna hota hai tb issue aata hai.

    try {
        
        //writing aggregation piepline to get messages of the user
        const user = await UserModel.aggregate([
            {
                $match: {
                    _id: userId,
                }
            },
            {
                $unwind: '$messages' //unwinding messages array and it wil give objects which is present in the array
            },
            {
                $sort: {
                    'messages.createdAt': -1, //sorting the messages
                }
            },
            {
                $group: { //grouping the document and it will give new field as _id and messages of the user
                    _id: '$_id',
                    messages: {$push: '$messages'}
                }
            }
        ]);


        //retun response when we dont get the user 
        if(!user || user.length === 0){
            return Response.json({
                success: false,
                messages: "User not found!"
            }, {status: 404});
        }

        return Response.json({
            success: true,
            messages: user[0].messages, //aggregation pipeline array return krta hai.
        }, {status: 200});
    } catch (error) {
        console.error("Error gettig messages", error);
        return Response.json({
            success: false,
            message: "Error getting messages"
        }, {status: 500});
    }
}