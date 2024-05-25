//verify code route
import DBConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import {verifySchema} from '@/schemas/verifySchema'




export async function POST(request: Request){
    await DBConnect();

    try {
        //data chaiye
        const {username, code}  = await request.json();

        //decoding from the url solving problem persist when data is comming from url
       const decodedUsername = decodeURIComponent(username);
        //finding the username

       const user =  await UserModel.findOne({username: decodedUsername});

        if(!user) {
            return Response.json({
                success: false,
                message: "user not found"
            }, {status: 500});
        }

        //checking verify code with zod
        const zodCode = verifySchema.safeParse({code});//code valid hoga toh zodCode mei value mil jayegi.
        const zodVerifiedCode = zodCode.data?.code;
        

        //if we got the user then check his code and username and code ki validity zada honi chaiye 
        const isValidCode = user.verifyCode === zodVerifiedCode;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date(); //code expired to nhi hai toh db store mei expry code ka date > abhi ki date se

        //dono conditon valid honi chaiye
        if(isValidCode && isCodeNotExpired){
            user.isVerified = true;
            await user.save(); //saving to database.

            //retu the response
            return Response.json({
                success: true,
                message: "user verified successfully",
            }, {status: 200});
        } else if(!isCodeNotExpired){ //agr code expired ho gya hai toh isme wale block mei
            return Response.json({
                success: false,
                message: "Verification code has expired, please signup again to get new code",
            }, {status: 400});
        } else {
            return Response.json({
                success: false,
                message: "Incorrect verfication code",
            }, {status: 400});
        }


    } catch (error) {
        console.error("error verifying user", error);
        return Response.json({
            success: false,
            message: "error verifying user"
        }, {status: 500});
    }
}

