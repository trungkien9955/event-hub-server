const express = require('express')
const cors = require('cors')
const authRouter = require('./routers/authRouter')
const app = express()
app.use(cors())
app.use(express.json())
const PORT = 3001
// app.get('/auth/hello', (_req, res)=>{
//     res.send('<h1>Welcome to Event hub server!</h1>')
// })
app.use('/auth', authRouter)
app.listen(PORT, error=>{
    if (error) {
        console.log(error)
        return
    }
    console.log(`Server is running at http://localhost:${PORT}`)
})