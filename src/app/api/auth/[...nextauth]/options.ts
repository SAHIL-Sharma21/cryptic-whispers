//nextauth ka khel poora ka poora options wali file mei hota hai.
import {NextAuthOptions} from 'next-auth'
import CrendentialsProvider from 'next-auth/providers/credentials'
import UserModel from '@/models/User.model'
import DBConnect from '@/lib/dbConnect'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
    providers: [
        CrendentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Enter your email" }, //these 2 field will generate the html in our frontend
                password: { label: "Password", type: "enter your password" } ,
            },
            async authorize(credentials: any, req): Promise<any>{ //we can aceess email and password by credentials.identifier.email and credentials.indentifier.password.
                await DBConnect();
                //after connecting to db we will check if user is present or not
                try {
                    //finding user by email or username
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},//credentials.identifer.email
                            {username: credentials.identifier}
                        ],
                    });

                    //if user is not found
                    if(!user){
                        throw new Error("User did not found with this email.");
                    }

                    //if user verified nhi ahi toh tb bhu error bejna hai
                    if(!user.isVerified){
                        throw new Error("User is no verified, Please verify first");
                    }

                    //if user is found then we will check password
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if(isPasswordCorrect){
                        return user
                    } else {
                        throw new Error("password is incorrect");
                    }

                } catch (err: any) {
                    throw new Error(err); //throwing error is important in this case //remember.
                }
            }
        }),
    ],
    pages: {
        signIn: '/sign-in'//nextauth automatically signin page design kr lega hmne khuch nhi krna padega.
    },
    session: {
        strategy: "jwt"//defining session with thi jwt strategy
    },
    secret: process.env.NEXT_AUTH_SECRET,// secret key is important
} 