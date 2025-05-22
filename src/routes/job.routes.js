import { Router } from "express";
import { applyJob, createJob, getJobs } from "../controllers/job.controller.js";

const router = Router();

router.route('/create' ).post( createJob );

router.route( '/apply' ).post( applyJob );

router.route( '/get' ).get( getJobs );

export default router;