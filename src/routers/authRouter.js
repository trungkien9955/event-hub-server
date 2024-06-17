const Router = require('express')
const { register, login } = require('../../controllers/authController')
const authRouter = Router()
authRouter.get('/hello', (_req, res)=>{
    res.send("Hello world!")
})
authRouter.post('/register', register)
authRouter.post('/login', login)
module.exports = authRouter