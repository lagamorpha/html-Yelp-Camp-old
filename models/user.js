// variable block
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// schema declaration
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// plugin adds the password and username fields as well as some functions
UserSchema.plugin(passportLocalMongoose);

// export statement
module.exports = mongoose.model('User', UserSchema);