let mongoose = require('mongoose')

let salesmanSchema = new mongoose.Schema({
    salesmanId: { type: String, default: null },
    salesmanName: { type: String, default: null },
    salesmanPhone: { type: String, default: null },
    salesmanEmail: { type: String, default: null },
    password: { type: String, default: null },
    address: { type: String, default: null },
    country: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    pincode: { type: String, default: null },
    aadharNumber: { type: String, default: null },
    aadharDocument: { type: String, default: null },
    panNumber: { type: String, default: null },
    panDocument: { type: String, default: null },
    adminId: { type: String, default: null },
    approvedTime: { type: String, default: null },
    isApproved: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Salesman', salesmanSchema)