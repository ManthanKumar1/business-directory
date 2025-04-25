let mongoose = require('mongoose')

let businessSchema = new mongoose.Schema({
    businessName: { type: String, default: null },
    contactPersonName: { type: String, default: null },
    businessEmail: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    alternateNumber: { type: String, default: null },
    whatsappNumber: { type: String, default: null },
    address: { type: String, default: null },
    country: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    pincode: { type: String, default: null },
    latitude: { type: String, default: null },
    longitude: { type: String, default: null },
    businessType: { type: String, enum: ['Retail', 'Wholesale', 'Manufacture', 'Service', 'Other'], default: null },
    other: { type: String, default: null },
    industry: [{ type: String, default: null }],
    keywords: [{ type: String, default: null }],
    businessDescription: { type: String, default: null },
    businessPhoto: [{ type: String, default: null }],
    registrationNumber: { type: String, default: null },
    registrationCertificate: { type: String, default: null },
    gstNumber: { type: String, default: null },
    gstCertificate: { type: String, default: null },
    panNumber: { type: String, default: null },
    panCard: { type: String, default: null },
    otherDocumentNumber: { type: String, default: null },
    otherDocuments: { type: String, default: null },
    adminId: { type: String, default: null },
    approvedTime: { type: String, default: null },
    isSubscription: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Business', businessSchema)