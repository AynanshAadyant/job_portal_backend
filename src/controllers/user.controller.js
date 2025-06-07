import User from "../model/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { checkPassword, hashPassword } from "../utils/hashPassword.js";
import { decodeToken, generateAccessToken, generateRefreshToken } from "../utils/tokens.js";

const createUser = async( req, res ) => {
    const { name, email, password, phone, location, skills, experience } =req.body;
    if( !name || !email || !password || !phone ) {
        return res.status( 400 ).json( {
            success : false,
            status: 4000,
            message: "All fields required"
        })
    }

    const existingUser = await User.findOne( {email: email } );
    if( existingUser) {
        return res.status( 400 ).json( {
            success : false,
            status : 400,
            message: "Duplicate user present"
        })
    }

    // const resumeLocal = req?.files?.resume?.[0]?.path;
    // if( !resumeLocal ) {
    //     return res.status( 400 ).json( {
    //         success : false,
    //         status: 400,
    //         message: "Resume missing"
    //     })
    // } 

    // const resume = await uploadOnCloudinary( resumeLocal );
    // if( !resume ) {
    //     return res.status( 400 ).json( {
    //         success : false, 
    //         status : 400,
    //         message : "Uploading resume failed" 
    //     })
    // }

    const hash = await hashPassword( password );
    
    const userData = {
        name, 
        email,
        password : hash,
        phone, 
        // resume: resumeLocal.url
    }

    const user = await User.create( userData );
    
    const checkUser = await User.findById( user._id);
    if( !checkUser ){
        return res.status( 400 ).json( {
            success: false,
            status: 400,
            message: "User data not saved"
        })
    }
    
    return res.status( 200 ).json( {
        success : true,
        status : 200,
        message: "User Data saved successfully"
    })
}

const loginUser = async( req, res ) => {
    const { email, password } = req.body;
    if( email == "" || password == "" ) {
        return res.status( 400 ).json( {
            success : false,
            status : 400,
            message: "Empty fields present"
        })
    }

    const findUser = await User.findOne( {email : email } );
    if( !findUser ){
        return res.status( 200 ).json( {
            success : false,
            status : 200,
            message: "User not found"
        })
    }

    const pass = checkPassword( password, findUser.password );
    if( !pass ) {
        return res.status( 200 ).json( {
            success : false,
            status : 200,
            message: "Wrond password entered"
        })
    }

    const userForToken = {
        _id: findUser._id,
        name: findUser.name,
        email: findUser.email,
    };

    const accessToken = generateAccessToken( userForToken );
    const refreshToken = await generateRefreshToken( {
        _id: findUser._id,
    } );
    await User.findByIdAndUpdate( findUser._id, { refreshToken: refreshToken} );

    const cookieOptions = { 
        httpOnly:true,
        secure: false,
        sameSite: 'lax'
    }

    return res.status( 200 )
    .cookie('USER_ACCESS_TOKEN', accessToken, cookieOptions )
    .cookie('USER_REFRESH_TOKEN', refreshToken, cookieOptions )
    .json( {
        success: true,
        status: 200,
        accessToken,
        message: "Login Successful"
    })
}

const getUser = async( req, res ) => {
    return res.status( 200 )
    .json( 
        {
            status: 200,
            body: req.user,
            success: true
        }
    )
}

const logOutUser = async(req, res) => {
    // Cookie options for clearing
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        expires: new Date(0) // Set expiration to epoch time (effectively deleting the cookie)
    };
    
    // Clear both tokens
    return res.status(200)
        .cookie('USER_ACCESS_TOKEN', '', cookieOptions)
        .cookie('USER_REFRESH_TOKEN', '', cookieOptions)
        .json({
            success: true,
            status: 200,
            message: "Logged out successfully"
        });
}; 

export {createUser, loginUser, getUser, logOutUser };