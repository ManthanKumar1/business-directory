let mongoose = require('mongoose')

let subscriptionSchema = new mongoose.Schema({
    businessId: { type: String, default: null },
    plans: { type: String, enum: ['Premium', 'Premium + Website', 'Free'], default: 'Free' },
    price: { type: Number, default: 0 },
    isPayment: { type: Boolean, default: false },
    subscriptionStartDate: { type: String, default: null },
    subscriptionEndDate: { type: String, default: null },
    isApproved: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Subscription', subscriptionSchema)