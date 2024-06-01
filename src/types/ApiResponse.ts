// defining custom types for Api Response

import { Message } from "@/models/User.model";
// user ko dashboard pr message bhi show krvane honge to usermodel se Message wala type import kr liya and usko optional bna liya.


export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: Array<Message>;
}