import jwt from "jsonwebtoken";
import User from "../model/user.model.js"

const protectRoute = async( req, res, next ) => {
    const token = req.cookies.USER_ACCESS_TOKEN;
    if( !token ) {
        return res.status( 400 ).json( {
            success: false,
            status: 400,
            message: "Error: user access token missing"
        })
    }
    try{ 
        const decodeToken = jwt.verify( token, "123455679faoi10oisodvolski")
        if( !decodeToken ) {
            return res.status( 401 ).json( {
                success: false,
                status: 401,
                message: "Error while decoding user access token"
            })
        }
        const user = await User.findById( decodeToken._id );
        if( !user ) {
            return res.status( 401 ).json( {
                success : false,
                status: 401,
                message: "Invalid User data in access token"
            })
        }
        
        req.user = user;
        next(); 
    }
    catch( e ) {
        return res.status( 500 ).json( {
            success: false,
            status: 500,
            message: "Something went wrong while authentication",
            error: e.message
        })
    }
}

export default protectRoute