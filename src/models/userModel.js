const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    familyName: {
        type: String,
        required: false
    },
    givenName: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    photo: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    photoUrl: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})
const UserModel = mongoose.model('users', userSchema)
module.exports = UserModel