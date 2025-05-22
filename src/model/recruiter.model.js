import mongoose from "mongoose";

const Recruiter = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique : true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    company : {
        name: {
            type: String, 
            required: true,
            unique: true
        },
        location: {
            type: String,
            requied: true
        },
        logo: {
            type: String
        }
    },
    profilePicture: {
        type: String,
        default :"../public/dummy.jpeg"
    },
    refreshToken : {
        type: String,
    },
}, {
    timestamps: true
});

const recruiter = mongoose.model( "Recruiter", Recruiter );

export default recruiter;   