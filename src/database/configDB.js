import mongoose from "mongoose";

const connectDB = async () => {
    try{
        
        const connectionInstance = await mongoose.connect( process.env.MONGO_URL);
        console.log(`MongoDB connected ` );
    }
    catch(err) {
        console.log( `Something went wrong while connecting to DB :: ERROR : ${err}`)
    }
}

export default connectDB;