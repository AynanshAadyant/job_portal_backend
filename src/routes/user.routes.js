import { Router } from "express";
import upload from "../middleware/multer.middleware.js"
import { createUser, loginUser, getUser, logOutUser } from "../controllers/user.controller.js";

const router = Router();

router.route( '/signup' ).post(  upload.fields( [
    {
        name : "resume",
        maxCount: 1
    }
]), createUser );

router.route( "/login" ).post( loginUser );

router.route( "/current" ).get( getUser );

router.route( "/logout" ).post( logOutUser );

export default router;