import mongoose from "mongoose";

const connectDB = async () => {
    try{
        
        const connectionInstance = await mongoose.connect( "mongodb+srv://AynanshAadyant:Aynansh123@cluster0.ls7c6.mongodb.net/job_portal");
        console.log(`MongoDB connected ` );
    }
    catch(err) {
        console.log( `Something went wrong while connecting to DB :: ERROR : ${err}`)
    }
}

export default connectDB;