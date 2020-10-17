const mongoose = require('mongoose');


const userSchema = new mongoose.Schema( {
    name: {
        type : String,
        required: true,
        // min: 3,
    },
    email: {
        type : String,
        required: true,
        // min: 3,
        unique: true
    },
    password: {
        type : String,
        required: true,
        // min: 3,
    },
});


module.exports = mongoose.model('user', userSchema);