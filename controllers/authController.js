const UserModel = require("../src/models/userModel")
const bcrypt = require('bcrypt')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const getJsonWebToken = (email,  id) => {
    const payload = {email, id}
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '7d'
    })
    return token
}
const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer')
require('dotenv').config()
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });
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
        data: {fullname: newUser.fullname, email: newUser.email, _id: newUser._id, accessToken: getJsonWebToken(email, newUser._id)}
    })
})
const login = asyncHandler(async(req, res)=>{
    const {email, password}= req.body
    const existingUser = await UserModel.findOne({email})
    if(!existingUser){
        res.status(403)
        throw new Error('User not found')
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.password)
    if(!passwordMatch){
        res.status(401)
        throw new Error('Incorrect email or password')
    }
    res.status(200).json({
        message: "Logged in successfully",
        data: {
            id: existingUser._id,
            email: existingUser.email,
            accessToken: await getJsonWebToken(email, existingUser._id)
        }
    })
})
const emailSender = async(mailOptions)=>{
    try {
         await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error)
    }
}
const verification = asyncHandler(async(req, res)=>{
    const {email} = req.body
    const verificationCode = Math.round(1000+Math.random()*9000)
    try {
        const mailOptions = {
            from: `Eventhub Admin, ${process.env.EMAIL}`, // sender address
            to: email, // list of receivers
            subject: "Verification code", // Subject line
            text: "Your email verification code is:", // plain text body
            html: `<h2>${verificationCode}</h2>`, // html body
          }
        await emailSender(mailOptions)
        console.log(verificationCode)
        res.status(200).json({
            message: 'email sent',
            data: {
                code: verificationCode
            }
        })
    } catch (error) {
        console.log(error)
        res.status(401).json(error.message)
    }
})
const resetPassword = asyncHandler(async(req, res)=>{
    const {email} = req.body
    const newPassword = Math.round(100000+Math.random()*99000)
    const mailOptions = {
        from: `Eventhub Admin, ${process.env.EMAIL}`, // sender address
        to: email, // list of receivers
        subject: "Reset password", // Subject line
        text: "Your new password is:", // plain text body
        html: `<h2>${newPassword}</h2>`, // html body
      }
      const user = await UserModel.findOne({email});
      if(user){
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        await UserModel.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            isChangePassword: true
          }).then(()=>{console.log('Password reset successfully')})
          .catch((error)=>{console.log('Password reset failed', error)})    
      }else{
        console.log('user not found')
      }
    await emailSender(mailOptions).then(()=>{
        res.status(200).json('Password reset successfully')
    }).catch((error)=>{
        res.status(401).json('Password reset failed')
    })
})
const loginWithGoogle = asyncHandler(async(req, res)=>{
    const {userInfo} = req.body
    let user = {...userInfo}
    const existingUser = await UserModel.findOne({email: userInfo.email})
    if(existingUser){
        await UserModel.findByIdAndUpdate(existingUser.id, {...userInfo, updatedAt: Date.now()})
        user.accessToken =  getJsonWebToken(userInfo.email, userInfo.id)
        console.log('updated')
    }else{
        const newUser = new UserModel({
            email: userInfo.email,
            fullname: userInfo.name,
            ...userInfo
        })
        await newUser.save()
        user.accessToken =  getJsonWebToken(userInfo.email, userInfo.id)
        console.log('New google user created')
    }
    res.status(200).json({
        message: 'login with google successfully',
        data: user
    })
})
module.exports = {register, login, verification, resetPassword, loginWithGoogle}