import mongoose from "mongoose";

const User = new mongoose.Schema( {
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true,
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
    phone : {
        type: String,
    },
    location: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    resume: {
        type: String
    },
    skills : [
        {
            type: String
        }
    ],
    experience: {
        type: Number
    },
    refreshToken : {
        type: String,
    }
}, {
    timestamps: true
})

const user = mongoose.model( "User", User );

export default user;