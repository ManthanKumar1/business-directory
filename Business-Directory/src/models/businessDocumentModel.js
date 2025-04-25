let mongoose = require('mongoose')

let businessDocumentSchema = new mongoose.Schema({
    businessId: { type: String, default: null },
    documentName: { type: String, default: null },
    documentFile: { type: String, default: null },
    isApproved: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Business Document', businessDocumentSchema)