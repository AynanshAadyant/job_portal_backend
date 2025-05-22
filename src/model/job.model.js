import mongoose from 'mongoose';

const Job = new mongoose.Schema( {
    title : {
        type: String,
        required: true
    },
    description : {
        type: String, 
        required: true,
    },
    skillsRequired: [
        {
            type: String
        }
    ],
    jobType : {
        type: String,
        required: true
    },
    minSalary: {
        type: Number,
        default: 0
    },
    maxSalary: {
        type: Number,
    },
    recruiterId: {
        type: String,
        required: true,
        trim: true
    },
    numberOfApplicants : {
        type: Number,
        default: 0,
    }
}, {
    timestamps : true
});

const job = mongoose.model( "Job", Job );

export default job;