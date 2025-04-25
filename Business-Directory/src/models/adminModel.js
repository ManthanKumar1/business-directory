let mongoose = require('mongoose')

let adminSchema = new mongoose.Schema({
    adminName: { type: String, default: null },
    adminPhone: { type: String, default: null },
    adminEmail: { type: String, default: null },
    password: { type: String, default: null },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Admin', adminSchema)