const { default: mongoose } = require('mongoose')

require('dotenv').config()

const dbUrl = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.uajxtdp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

`
console.log(dbUrl)
const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(dbUrl)
        console.log(connection.connection.host)
        console.log("")
    } catch (error) {
        console.log(error)
        process.exit()
    }
}
module.exports = connectDB