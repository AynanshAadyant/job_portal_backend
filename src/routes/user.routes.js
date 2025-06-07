import { Router } from "express";
import { uploadPdf } from "../middleware/multer.middleware.js"
import { createUser, loginUser, getUser, logOutUser } from "../controllers/user.controller.js";
import protectUser from "../middleware/protectUser.middleware.js"

const router = Router();

router.route( '/signup' ).post(  uploadPdf.fields( [
    {
        name : "resume",
        maxCount: 1
    }
]), createUser );

router.route( "/login" ).post( loginUser );

router.route( "/current" ).get( protectUser, getUser );

router.route( "/logout" ).post( logOutUser );

export default router;