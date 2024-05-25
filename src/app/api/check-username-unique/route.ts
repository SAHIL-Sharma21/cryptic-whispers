//route for checking the username is unique. with implementation of zod

import DBConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import {z} from 'zod'
import {usernameValidation} from '@/schemas/signUpSchema'//for chcking uniqueness for the username


//we have to make query schema for checking with the zod
const UsernameQuerySchema = z.object({
    username: usernameValidation,//check the validation 
});


//get route to check
export async function GET(request: Request){
    //ab iski need nhi hoti hai pr knowledge kr liye sahi hai
    //giving error response to the client as this is get request he have to make get request in order to get the data he cannot use other method
    if(request.method !== "GET"){
        return Response.json({
            success: false,
            message: "Only GET method is allowed"
        }, {status:  405});
    }

    await DBConnect();
 
    try {
        //getting username from the query
        const {searchParams} = new URL(request.url); // this will extract the whole url like http:localhost:3000/api/check-username-unique?username=sahil&...more query
        //getting our desired query from the search params
        const queryParam = {
            username: searchParams.get("username")// this will get the field username from that whole url.
        }
        //now we will validate it with zod.
        const result = UsernameQuerySchema.safeParse(queryParam);//parsing safe hui toh hme value mil jayegi.
        console.log(result);
        
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [] //sird username ke errors chahiye toh yeh send kr dega --> usernameErrors is arrays of errors
            return Response.json({
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors.join(",") : "Invalid query parameter",
            }, {status: 400});
        }

        //if we get the data then we will return
        const {username} = result.data;

        //username mil gya toh db se query kro and data leke aao
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true
        });
        
        //if username is already existes then throw the response
        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: "username is already taken",
            }, {status: 400});
        }

        //if username does ot exists then retun the response
        return Response.json({
            success: true,
            message: "username is unique"
        }, {status: 200});

    } catch (error) {
        console.error("Error checking username", error);
        return Response.json({
            success: false,
            message: "Error checking username"
        }, {status: 500});
    }
}