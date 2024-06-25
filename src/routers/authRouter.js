const Router = require('express')
const { register, login, verification, resetPassword, loginWithGoogle } = require('../../controllers/authController')
const authRouter = Router()
authRouter.get('/hello', (_req, res)=>{
    res.send("Hello world!")
})
authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/verification', verification)
authRouter.post('/reset-password', resetPassword)
authRouter.post('/google-signin', loginWithGoogle)

module.exports = authRouter