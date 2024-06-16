const express = require('express')
const cors = require('cors')
const authRouter = require('./src/routers/authRouter')
const connectDB = require('./configs/connectDb')
const errorHandler = require('./middlewares/errorMiddleware')
const app = express()
app.use(cors())
app.use(express.json())
const PORT = 3001
// app.get('/auth/hello', (_req, res)=>{
//     res.send('<h1>Welcome to Event hub server!</h1>')
// })
app.use('/auth', authRouter)
connectDB()
app.use(errorHandler)
app.listen(PORT, error=>{
    if (error) {
        console.log(error)
        return
    }
    console.log(`Server is running at http://localhost:${PORT}`)
})