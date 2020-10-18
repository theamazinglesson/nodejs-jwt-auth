const jwt = require('jsonwebtoken');
const User = require('../models/User');
const checkAuthentication = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            }else{
                console.log("Decoded Token: ", decodedToken);
                User.findById(decodedToken.id, (error, docs)=>{
                    if(error){
                        console.log(error);
                        next();
                    }else{
                        res.locals.user = docs;
                        next();
                    }
                })
            }
        });
    }
}





// // invalid token
// jwt.verify(token, 'wrong-secret', function(err, decoded) {
//     // err
//     // decoded undefined
//   });
const reqAuthentication =(req, res, next)=>{
    // GETTING TOKEN FROM BROWSER
    const token = req.cookies.jwt;
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken)=>{
        if(err){
            console.log("There is no token error: ",  err.message);
            res.redirect('/users/login');
        }else{
            console.log("decoded token", decodedToken);
            next();
        }
    })
}







module.exports = {checkAuthentication, reqAuthentication};
