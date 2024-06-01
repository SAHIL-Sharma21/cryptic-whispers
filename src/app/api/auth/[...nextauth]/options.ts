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
    callbacks: {
        async jwt({ token, user}) {
            //user se data nikal kr token mei insert kr rahe hai making token powerful ki jb chahe hm information nikal le
            if(user){
                token._id = user._id?.toString();//modifying the USer types which was provided by the next-auth then it will not give error
                token.isVerified = user.isVerified;
                token.isAcceptingMessages= user.isAcceptingMessage;
                token.username = user.username;
            }      
            return token //very important to retun token if not then bug will be faced
          },

        async session({ session, token }) {
            //modifying session as nextauth provide session based authentication
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessages as boolean;
                session.user.username = token.username;
            }  
            return session
          }
    },
    pages: {
        signIn: '/sign-in'//nextauth automatically signin page design kr lega hmne khuch nhi krna padega.
    },
    secret: process.env.NEXT_AUTH_SECRET,// secret key is important
    session: {
        strategy: "jwt"//defining session with thi jwt strategy
    },
} 