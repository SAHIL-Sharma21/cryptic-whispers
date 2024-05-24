//defining new types which wil be used in next-auth
import "next-auth";
import { DefaultSession } from "next-auth";


//package ke types ko modify kr rahe hai
declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string
    }
    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessage?: boolean;
            username?: string
        } & DefaultSession['user']
    } 
}

//alternate way of modifying jwt
declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string
    }
}