import mongoose from 'mongoose';

const Application = new mongoose.Schema( {
    job: {
        type: String,
        required: true,
        trim: true
    },
    applicant: {
        type: String,
        required: true,
        trim: true
    },
    resume: {
        type: String
    },
    coverLetter: {
        type: String,
    },
    status : {
        type: String,
        enum: [ 'Pending', 'Accepted', 'Refused' ],
        required: true,
        default : 'Pending'
    }
}, { 
    timestamps: true
});

const application = mongoose.model( "Application", Application );

export default application;