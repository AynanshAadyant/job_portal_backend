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

const ImageFilter = (req, file, cb ) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test( path.extname( file.originalname ).toLowerCase() );
    const mimeType = allowedTypes.test( file.mimeType );

    if( extname && mimeType ) {
        cb( null, true );
    }
    else {
        cb( new Error( 'Only Images allowed', ), false );
    }
}

const pdfFilter = (req, file, cb ) => {
    const allowedTypes = /pdf/;
    const extname = allowedTypes.test( path.extname( file.originalname ).toLowerCase() );
    const mimeType = allowedTypes.test( file.mimetype );

    if( extname && mimeType ) {
        cb( null, true );
    }
    else {
        cb( new Error( 'Only pdf allowed', ), false );
    }
}

const uploadImage = multer( {
    storage : storage,
    fileFilter : ImageFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

const uploadPdf = multer( {
    storage : storage,
    fileFilter : pdfFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

export { uploadImage, uploadPdf };

