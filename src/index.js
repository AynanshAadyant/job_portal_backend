import app from './app.js'
import dotenv from 'dotenv'
import connectDB from './database/configDB.js';

dotenv.config();


connectDB()
.then( () => {
    const port = process.env.PORT || 8800;
    app.listen( port , () => {
        console.log( `Server running at port : ${port}`)
    })
})
.catch( (err ) => {
    console.error( "Error in connecting DB : " + err );
} )
