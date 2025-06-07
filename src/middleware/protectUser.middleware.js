import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const protectUserRoute = async (req, res, next) => {
    try {
        const token = req.cookies.USER_ACCESS_TOKEN;
        if (!token) {
            return res.status(401).json({
                success: false,
                status: 401,
                message: "Unauthorized: No access token provided",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "123455679faoi10oisodvolski");

        if (!decoded || !decoded._id) {
            return res.status(403).json({
                success: false,
                status: 403,
                message: "Forbidden: Invalid access token",
            });
        }

        // Find user from DB
        const user = await User.findById(decoded._id).select("-password -refreshToken");
        if (!user) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "User not found",
            });
        }

        // Attach user to req object
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Server error during authentication",
        });
    }
};

export default protectUserRoute;
