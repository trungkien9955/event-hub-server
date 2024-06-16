const UserModel = require("../src/models/userModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const getJsonWebToken = (email,  id) => {
    const payload = {email, id}
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '7d'
    })
    return token
}
const asyncHandler = require('express-async-handler')
const register = asyncHandler(async(req, res)=> {
    const {fullname, email, password} = req.body
    const existingUser = await UserModel.findOne({email})
    if(existingUser){
        res.status(401)
        throw new Error('Email already exists.')
    }
    //generate hashed password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new UserModel({
        email,
        fullname: fullname ? fullname: '',
        password: hashedPassword
    })
    newUser.save()
    res.status(200).json({
        message: 'User created successfully.',
        data: {...newUser, accessToken: getJsonWebToken(email, newUser._id)}
    })
})
module.exports = {register}