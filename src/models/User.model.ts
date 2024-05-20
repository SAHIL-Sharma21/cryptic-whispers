//making user model
//Document is used when we are using typescript
import mongoose, {Schema, Document} from 'mongoose'

//defining the interface of the data
//interface of the Message schema which extends Document - at last isse mongoose ke documents hi banenge.
export interface Message extends Document {
    content: string; // TS ke type mei string ka s small hoga and mongoose ke usme capital.
    createdAt: Date;
}

//schema ka type hai usme Message jo hmne de1fine krra hai.
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,//Mongoose ke stype mei string Capital hai S.
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,    
    }
});


//interface for User 
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: Message[],//message ka type upr define hai ussi se hoga.
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Please use a valid email address"],//email ko check kr skte hai isme 1st value regex hoga and then custom message.
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "verify code is required"],
    }, 
    verifyCodeExpiry: {
        type: Date,
        required: [true, "verify code expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    }, 
    messages: [MessageSchema] //alag se mesage schema aise likh diya
});

//ab export krenge lekin next js mei different apprach hai as next js runs on edge so we will check if that doc is creating 1st time or its already been made
//User is our datatype.
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;