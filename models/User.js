const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");


const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please enter your first name"]
    },
    lastName: {
        type: String,
        required: [true, "please enter your last name"]
    },
    email: {
        type: String,
        required: [true, "please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid email"]
    },
    password: {
        type: String,
        required: [true, "please enter password"],
        minlength: [6, "minimum password length is 6"]
    },
    friendRequest: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    friend: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]
})

// TODO bikin static function untuk login
UserSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email: email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        console.log(auth);
        if (auth) {
            return user;
        }
        else {
            throw new Error("incorrect password");

        }
    } else {
        throw new Error("email not found");
    }
}


UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


const User = mongoose.model("user", UserSchema);
module.exports = User;