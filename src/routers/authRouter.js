const Router = require('express')
const { register } = require('../../controllers/authController')
const authRouter = Router()
authRouter.get('/hello', (_req, res)=>{
    res.send("Hello world!")
})
authRouter.post('/register', register)
module.exports = authRouter