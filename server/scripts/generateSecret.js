const crypto = require('crypto');

const generateSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

console.log('Your JWT secret:', generateSecret());