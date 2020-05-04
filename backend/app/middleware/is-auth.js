const jwt = require('jsonwebtoken');


isAuth = (req, res, next) => {
    console.log('test')
    if(!req.get('Authorization')) {
        const err = new Error('token not provided');
        err.statusCode = 500;
        throw err;
    } else {
        const token = req.get('Authorization').split(' ')[1];
        console.log('api token', token);
        let decoded;
        try {
            decoded = jwt.verify(token, 'tokenkeytest');
        } 
        catch(err) {
            console.log('token verify error', err);
            err.statusCode = 500 
            throw err; // expressjs error handler will take care
        } 
        if(!decoded) {
            const err = new Error('token not authenticated');
            err.statusCode = 401 // unauthorized;
        }
    }
    
    next();
}

module.exports = isAuth;