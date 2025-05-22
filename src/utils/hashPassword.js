import bcrypt from 'bcrypt';

const hashPassword = async( password ) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash( password, saltRounds );
    return hash;
}

const checkPassword = async ( password, hash ) => {
    return bcrypt.compareSync( password, hash );
}

export {hashPassword, checkPassword };