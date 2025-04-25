let mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
    userName: { type: String, default: null },
    userPhone: { type: String, default: null },
    userEmail: { type: String, default: null },
    password: { type: String, default: null },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)