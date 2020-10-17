const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

/* GET users listing. */
router.get('/register', function (req, res, next) {
  res.render('register');
});





router.post("/register",
  // EXPRESS VALIDATOR
  [
    check('name', 'Name must be more than 3 charecter long').exists().isLength({ min: 3 }),
    check('email', "Email must be valid").exists().isEmail(),
    check('password', "Password must be more than 6 charecter long").exists().isLength({ min: 6 })
  ]
  , (req, res, next) => {
    // GETING VALUE FROM USER FORM AND DESGRUCTURING
    const { name, email, password, password2 } = req.body;
    // GETTING ERRORS OBJECT FROM EXPRESS VALIDATOR
    let validationErrors = validationResult(req);
    // CREATING A NEW VARIABLE -> VARIABLE TO A ARRAY OF VARIABLE
    let errors = validationErrors.array();


    // IF THERE IS NO EXPRESS VALIDATION ERROR
    if (validationErrors.isEmpty()) {
      // CHECK FOR THE USER IS ALREADY REGISTERED WITH THIS EMAIL OR NOT
      User.findOne({ email }, (err, docs) => {
        if (err) {
          console.log(err);
          next(err);
        } else {
          // IF THERE IW ALREADY A USER WITH THIS EMAIL IT WILL SEND AN ERROR
          if (docs) {
            errors.push({ "msg": "An user is already registered with this email" });
            return res.render('register', { errorMessage: errors });
            next();
          } else {
            // IF EMAIL IS VALID CHECK FOR PASSWORD DOES IT MATCH OR NOT
            if (password === password2) {
              // HASH THE PASSWORD
              bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, function (errr, hash) {
                  // Store hash in your password DB.
                  // SAVE USER TO THE DATABASE
                  new User({
                    name,
                    email,
                    password: hash
                  }).save((err, docs) => {
                    if (err) {
                      console.log(err);
                      next(err);
                    } else {
                      console.log("User is saved to the database");
                      res.redirect('/users/login');
                    }
                  });
                });
              });

            } else {
              errors.push({ "msg": "password didn't match" });
              res.render('register', { errorMessage: errors });
            }
          }
        }
      });


    } else {
      // IF THERE IS ERROR
      res.render('register', { errorMessage: errors });
    }
  });







/* GET users listing. */
router.get('/login', function (req, res, next) {
  res.render('login');
});





module.exports = router;
