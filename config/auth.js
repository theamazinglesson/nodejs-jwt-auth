const jwt = require('jsonwebtoken');
const User = require('../models/User');





// PROTECTING ROUTE
// // invalid token
// jwt.verify(token, 'wrong-secret', function(err, decoded) {
//     // err
//     // decoded undefined
//   });
const reqAuthentication = (req, res, next) => {
    // GETTING TOKEN FROM BROWSER
    const token = req.cookies.jwt;
    // VERIFYING USER - IF USER PASS THEN USER ABLE TO VISIT PARTICLUR ROUTE
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
        // FAIELD TO VERIFY TOKEN USER NEED TO LOGIN TO CREATE NEW ACCESS TOKEN
        if (err) {
            console.log("There is no token error: ", err.message);
            res.redirect('/users/login');
        } else {
            // IF VERIFY SUCCESS ALLOW USER TO VISIT PARTICULAR ROUTE
            console.log("decoded token", decodedToken);
            next();
        }
    });
}




// IF USER IS LOGGED IN THEY CAN'T GO TO LOGIN OR REGESTRATION PAGE
const notReqAuthentication = (req, res, next) => {
    // VERIFYING USER
    const token = req.cookies.jwt;
    // IF THERE IS A TOKEN NAME WITH JWT THEN IT IT WON'T LET USER GO SOME ROUTE
    if (token) {
        console.log("There is an token");
        res.redirect('/users/dashboard');
    } else {
        // IF THERE IS NO TOKEN THEN USER ALLOW TO VISIT CERTAIN ROUTE
        console.log("There is no token ");
        next();
    }
}















// BY USING THIS WE CAN CHECK LOG IN OR NOT INSIDE OUR VIEW ENGINE
const checkAuthentication = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                // IF THERE IS A TOKEN BUT UNVERIFIED SETTING USER VARIABLE AS NULL
                res.locals.user = null;
                next();
            } else {
                console.log("Decoded Token: ", decodedToken);
                User.findById(decodedToken.id, (error, docs) => {
                    if (error) {
                        console.log(error);
                        next();
                    } else {
                        // IF THERE IS A TOKEN AND VERIFIED IT WILL SET AN USER VARIABLE AND ALLOW VIEW ENGINE TO USE THIS VARIABLE
                        res.locals.user = docs;
                        next();
                    }
                })
            }
        });
    } else {
       // IF THERE IS NO TOKEN SETTING USER VARIABLE AS NULL
        res.locals.user = null;
        next();
    }
}


/*
const checkAuthentication = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRETKEY, async (err, decoredToken) => {
            if (err) {
                console.log(err.message);
                // IF USER IS NOT LOGGED IN THIS WOULD BE NULL
                res.locals.user = null;
                next();
            } else {
                // IF THERE IS A VALID USER LOGGED IN 
                console.log("Decoded token", decoredToken);
                // FIND THE USER
                let user = await User.findById(decoredToken.id);
                // http://expressjs.com/en/api.html#app.locals
                // http://expressjs.com/en/5x/api.html#res.locals
                // IF USER IS LOGGED IN THIS WOULD BE CURRENT USER
                // NOW WE CAN ACCESS USER PROPERTIES INSIDE OUR VIEWS FILE
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
}
*/





module.exports = { checkAuthentication, reqAuthentication, notReqAuthentication };
