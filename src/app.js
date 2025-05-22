import express from 'express';
import cors from 'cors';
import RecruiterRouter from "./routes/recruiter.routes.js"
import JobRouter from "./routes/job.routes.js";
import UserRouter from "./routes/user.routes.js"
import cookieParser from 'cookie-parser';

const app = express();

app.use( cors( {
    origin : '*'
}) );
app.use( express.json() );
app.use( express.urlencoded( { extended: true }) );
app.use( cookieParser() );

app.use( "/api/v1/recruiter", RecruiterRouter);
app.use( "/api/v1/jobs", JobRouter);  
app.use( "/api/v1/user", UserRouter );   


export default app;