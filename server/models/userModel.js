const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
    },
    image: {
        type: String,
        required: true,
    },
    places: [
        {
            type: String,
            required: false,
        },
    ],
});

userSchema.plugin(uniqueValidator);

const User = mongoose.Model("User", userSchema);
module.exports = User;
