//auth folder will have 2 files mainly options.ts and routes.ts
import NextAuth from "next-auth/next";
import {authOptions} from './options'


//make handler funtion
const handler = NextAuth(authOptions);

//exporting these method as GET and POST as it is framework.
export {handler as GET, handler as POST}