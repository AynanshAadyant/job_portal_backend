import Job from "../model/job.model.js";
import Application from "../model/application.model.js";
import jwt from "jsonwebtoken";

const createJob = async (req, res) => {
    try {
        const token = req.cookies["RECRUITER_ACCESS_TOKEN"];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Recruiter not logged in"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const recruiterId = decoded.id;

        const { title, description, skillsRequired, jobType, minSalary, maxSalary } = req.body;

        if (!title || !description || !skillsRequired || !jobType || !maxSalary) {
            return res.status(400).json({
                success: false,
                message: "Fields are empty"
            });
        }

        const jobData = {
            title,
            description,
            skillsRequired,
            jobType,
            minSalary,
            maxSalary,
            recruiterId,
            numberOfApplicants: 0
        };

        const newJob = await Job.create(jobData);

        return res.status(200).json({
            success: true,
            message: "Job Creation Successful",
            job: newJob
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};

const applyJob = async (req, res) => {
    try {
        const token = req.cookies["USER_ACCESS_TOKEN"];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not logged in"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const { job, resume, coverLetter, status } = req.body;
        if (!job || !resume || !coverLetter || !status) {
            return res.status(400).json({
                success: false,
                message: "All fields not present"
            });
        }

        const jobData = await Job.findById(job._id);
        if (!jobData) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        const applicationData = {
            job: job._id,
            applicant: userId,
            resume,
            coverLetter,
            status
        };

        const application = await Application.create(applicationData);
        await Job.findByIdAndUpdate(job._id, {
            $inc: { numberOfApplicants: 1 }
        });

        return res.status(200).json({
            success: true,
            message: "Application successful"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        return res.status(200).json({
            success: true,
            message: "Job fetching successful",
            body: jobs
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error fetching jobs",
            error: err.message
        });
    }
};

export { createJob, applyJob, getJobs };
