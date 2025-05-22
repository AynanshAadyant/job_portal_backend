import multer from "multer";
import path from 'path';

const storage = multer.diskStorage( {
    destination: function( req, file, cb ) {
        cb( null, 'uploads/' );
    },
    filename : function( req, file, cb ) {
        const ext = path.extname( file.originalname );
        const uniqueName = `${Date.now()}-${file.fieldname}${ext}`;
        cb( null, uniqueName );
    }
})

const fileFilter = (req, file, cb ) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test( path.extname( file.originalname ).toLowerCase() );
    const mimeType = allowedTypes.test( file.mimeType );

    if( extname && mimeType ) {
        cb( null, true );
    }
    else {
        cb( new Error( 'Only Images and pdf allowed', ), false );
    }
}

const upload = multer( {
    storage : storage,
    fileFilter : fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

export default upload;

