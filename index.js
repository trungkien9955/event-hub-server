const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
const PORT = 3001
app.get('/auth/hello', (_req, res)=>{
    res.send('<h1>Welcome to Event hub server!</h1>')
})
app.listen(PORT, error=>{
    if (error) {
        console.log(error)
        return
    }
    console.log(`Server is running at http://localhost:${PORT}`)
})