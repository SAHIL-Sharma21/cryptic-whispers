//signup route as we are writing backend here.
import DBConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from 'bcryptjs';
import {sendVerificationEmail} from '@/helpers/sendVerificationEmails'





//signup route and making rest api
export async function POST(request: Request) {
    //if someonw has requested then db will connect
    await DBConnect();

    try {
        //taking data from request.json which is default way of nextjs
        const {username, email, password} = await request.json();

        //checking if username hai and woh user verfied hai --> only retun the user if he has username and he is verfied
       const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if(existingUserVerifiedByUsername){
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                {status: 400}
            );
        }

        //finding user  by email
        const existingUserByEmail = await UserModel.findOne({email});

        //generating verifycode
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail){
            
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User already exists with this email"
                }, {status: 400}
                );
            } else {
                //existing user email se user hai pr verified nhi hai.
                //to uska password frse hash krne naya verification code bej kr save kr lenge
                const hashedPassword = await bcrypt.hash(password, 10);

                //bs password to override hai
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);//by 1 hours

                //save the user
                await existingUserByEmail.save();
            }
        } else {
            //user first time aya hai toh user create krenge

            //hasing the password
            const hashedPassword = await bcrypt.hash(password, 10);

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);//yaha pr 1 ghnte ki expiry rakh rahe hai

            //making new user
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });

            //user ko ab save kr krnege
            await newUser.save();
        }

        //send verification email 
       const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message,
            },
            {status: 500}
            );
        }
  
        //agr email chala gya hai toh response return kr denge
        return Response.json({
            success: true,
            message: "User registered successfully, Please verify email id"
        },
        {status: 201}
    );

    } catch (error) {
        console.error("Error while Registering user");
        return Response.json({
                success: false,
                message: "Error registering user."
            },
            {
                status: 500,
            }
        );
    }
}