let mongoose = require('mongoose')

let isValid = function (value) {
    if (!value || typeof value === "undefined" || value === null || typeof value != 'string') return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

let isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

let message = function (value) {
    return `${value} is missing or invalid`
}

let isValidPhone = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/

let isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

let isValidPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/

let isValidPincode = /^\d{4,6}$/

let isValidGst = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d{1}[Z]{1}[A-Z\d]{1}$/

let isValidPan = /^[A-Z]{5}\d{4}[A-Z]{1}$/

module.exports = { isValid, isValidObjectId, message, isValidPhone, isValidEmail, isValidPassword, isValidPincode, isValidGst, isValidPan }