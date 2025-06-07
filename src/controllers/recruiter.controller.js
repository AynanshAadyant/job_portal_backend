import Recruiter from "../model/recruiter.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { hashPassword, checkPassword } from "../utils/hashPassword.js";
import { decodeToken, generateAccessToken, generateRefreshToken } from "../utils/tokens.js";

const createRecruiter = async (req, res) => {
    const { name, email, password, phone, company } = req.body;

    if (!name || !email || !password || !phone || !company) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "All fields required for recruiter sign up"
        });
    }
    
    const existingRecruiter = await Recruiter.findOne({ email: email });
    if (existingRecruiter) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Duplicate Recruiter Present"
        });
    }

    // const profilePicLocal = req?.files?.profilePicture?.[0]?.path;
    // if (!profilePicLocal) {
    //     return res.status(400).json({
    //         success: false,
    //         status: 400,
    //         message: "Profile Picture missing from recruiter" 
    //     });
    // }

    // const profilePic = await uploadOnCloudinary(profilePicLocal);
    // if (!profilePic) {
    //     return res.status(400).json({
    //         success: false,
    //         status: 400,
    //         message: "Failure to store recruiter profile pic in cloudinary"
    //     });
    // }

    const hash = await hashPassword(password);

    const recruiterData = {
        name,
        email,
        password: hash, 
        phone,
        company,
        // profilePicture: profilePic.url
    };

    const recruiter = await Recruiter.create(recruiterData);
    
    const checkRecruit = await Recruiter.findById(recruiter._id);
    if (!checkRecruit) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Recruiter data not saved in DB"
        });
    }

    return res.status(200)
    .json({
        success: true,
        status: 200,
        body: {},
        message: "Recruiter data saved successfully" 
    });
};

const loginRecruiter = async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Empty fields, cannot login recruiter"
        });
    }

    const findRecruiter = await Recruiter.findOne({ email: email });
    if (!findRecruiter) {
        return res.status(200).json({
            success: false,
            status: 200,
            message: "Account not found, please sign up"
        });
    }

    const pass = checkPassword(password, findRecruiter.password);

    if (!pass) {
        return res.status(200).json({
            success: false,
            status: 200,
            message: "Wrong password"
        });
    }

    const recruiterForToken = {
        _id: findRecruiter._id,
        name: findRecruiter.name,
        email: findRecruiter.email,
        company: findRecruiter.company,
    };
    
    const accessToken = generateAccessToken(recruiterForToken);
    const refreshToken = generateRefreshToken(findRecruiter._id);

    await Recruiter.findByIdAndUpdate( findRecruiter._id, { refreshToken : refreshToken } );

    const cookieOptions = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
    .cookie('RECRUITER_ACCESS_TOKEN', accessToken, cookieOptions)
    .cookie('RECRUITER_REFRESH_TOKEN', refreshToken, cookieOptions)
    .json({
        success: true,
        status: 200,
        accessToken,
        message: "Login Successful"
    });
};

const getRecruiter = async(req, res) => {
    const token = req.cookie.RECRUITER_ACCESS_TOKEN;
    
    if (!token) {
        return res.status(401).json({
            success: false,
            status: 401,
            message: "No access token found, please login"
        });
    }
    
    try {
        const decodedData = decodeToken(token);
        
        if (!decodedData) {
            return res.status(401).json({
                success: false,
                status: 401,
                message: "Invalid token, please login again"
            });
        }
        
        const recruiter = await Recruiter.findById(decodedData._id).select("-password -refreshToken");
        
        if (!recruiter) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Recruiter not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            status: 200,
            body: recruiter,
            message: "Fetched current recruiter data"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Error fetching recruiter data"
        });
    }
};

const logoutRecruiter = async(req, res) => {
    // Cookie options for clearing
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        expires: new Date(0) // Set expiration to epoch time (effectively deleting the cookie)
    };
    
    // Clear both tokens
    return res.status(200)
        .cookie('RECRUITER_ACCESS_TOKEN', '', cookieOptions)
        .cookie('RECRUITER_REFRESH_TOKEN', '', cookieOptions)
        .json({
            success: true,
            status: 200,
            message: "Logged out successfully"
        });
};

export { createRecruiter, loginRecruiter, getRecruiter, logoutRecruiter };