import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = '123455679faoi10oisodvolski';
const generateAccessToken = async ( data ) => {
    return jwt.sign( data, secretKey, { expiresIn: '1d' } )
}

const generateRefreshToken = async (data ) => {
    return jwt.sign( data, secretKey, {expiresIn : '10d' });
}

const decodeToken = async (cookie) => {
    return jwt.verify( cookie, secretKey );
}

export {generateAccessToken, generateRefreshToken, decodeToken}