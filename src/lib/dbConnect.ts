//db connection file
import mongoose from 'mongoose'


//defing type for our conection object - database ke connection ke baad jo data aa rha hai uska data type kya hai uska type.
type ConnectionObject = {
    isConnected?: number, //? is an optional value agr nhi hai toh error nhi dega
}


const connection:ConnectionObject = {}

async function DBConnect(): Promise<void> {
    //checking if db is already connected in nextjs
    //multilple connection ko avoid kr rahe hai in nextjs kuiki nextjs edge pr run krti hai toh har baar db conection hota hai every api call pr
    if(connection.isConnected){
        console.log("already connected to database");
        return;
    };

    //incase db is not connected
    try {
       const db = await mongoose.connect(process.env.MONGO_DB_URI || "", {})

       //db connection fully ready hai ya nahi bs wohi kr rha hai.--> readystate is a number bs wohi retun kr rahe hai
       connection.isConnected = db.connections[0].readyState;

       //two console log for extra learning purpose.
       console.log(db.connections);
       
        console.log("DB Connected successfully.");
        
    } catch (error) {
        console.log("database connection failed", error);

        //if connection nhi hua hai best practice hai ki process ko exit kr dena
        process.exit(1);
    }
}

export default DBConnect;