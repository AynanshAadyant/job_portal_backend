import { Router } from "express";
import {uploadImage} from "../middleware/multer.middleware.js"
import { createRecruiter, getRecruiter, loginRecruiter, logoutRecruiter } from "../controllers/recruiter.controller.js";

const router = Router();

router.route( '/register' ).post( uploadImage.fields( [
    {
        name : "ProfilePicture",
        maxCount : 1
    }
] ), createRecruiter );

router.route( "/login" ).post( loginRecruiter );

router.route("/current").get( getRecruiter );

router.route( "/logout" ).post( logoutRecruiter );

export default router;