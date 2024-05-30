//get all messages route
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import DBConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import UserModel from "@/models/User.model";



export async function DELETE(request: Request, {params}: {params: {messageid: string}}){

    const messageId = params.messageid;//extracting message Id from the params obj

    await DBConnect();

    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 401});
    }

    try {
        const updatedResult = await UserModel.updateOne(
            {_id: user._id},
            {
                $pull: {messages: {_id: messageId}}//messages ke ander poora document hai toh usme se _id ek message ki filed hai usko match krra kr pull krenge.
            }
        );

        if(updatedResult.modifiedCount === 0){
            return Response.json({
                success: false,
                message: "Message not found or Already deleted"
            }, {status: 404});
        }
        //if modified count is not zero then send the success.
        return Response.json({
            success: true,
            message: "Message deleted successfully."
        }, {status: 200});
    } catch (error) {
        console.log("Error while delting the message", error);
        return Response.json({
            success: false,
            message: "Error while deleting the message."
        }, {status: 500});
    }
}