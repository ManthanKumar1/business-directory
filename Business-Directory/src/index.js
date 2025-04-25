let express = require('express')
let mongoose = require('mongoose')
let app = express()
let multer = require('multer')
let dotenv = require('dotenv')
let cors = require('cors')
let router = require('./routes/route')

dotenv.config({ path: `.env.${process.env.mongodb}` })

app.use(express.json())

app.use(multer().any())

app.use(cors({
    origin: '*'
}))

mongoose.connect(process.env.mongodb)
    .then(() => console.log("MongoDB is connected"))
    .catch(err => console.log(err))

app.use('/', router)

app.use(function (req, res) {
    return res.status(400).send({ status: false, message: "Path Not Found" })
})

// app.listen(process.env.PORT, function () {
//     console.log("Express app running on Port " + (process.env.PORT))
// })

module.exports = app