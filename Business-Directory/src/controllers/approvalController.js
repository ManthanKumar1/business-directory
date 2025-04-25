let salesmanModel = require('../models/salesmanModel')
let adminModel = require('../models/adminModel')
let { isValid, isValidObjectId, message } = require('../validator/validation')
const businessModel = require('../models/businessModel')

let approveSalesman = async function (req, res) {
    try {
        let adminId = req.params.adminId
        if (!isValid(adminId) && !isValidObjectId(adminId)) {
            return res.status(400).send({ status: false, message: message('Admin Id') })
        }

        let checkAdmin = await adminModel.findOne({ _id: adminId, isDeleted: false })
        if (!checkAdmin) {
            return res.status(404).send({ status: false, message: "Admin not found" })
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { salesmanId, isApproved } = data

        if (!isValid(salesmanId) && !isValidObjectId(salesmanId)) {
            return res.status(400).send({ status: false, message: message('Salesman Id') })
        }

        let checkSalesman = await salesmanModel.findOne({ _id: salesmanId, isDeleted: false })
        if (!checkSalesman) {
            return res.status(404).send({ status: false, message: "Salesman not found" })
        }

        if (typeof isApproved !== 'boolean') {
            return res.status(400).send({ status: false, message: "isApproved must be a boolean" })
        }

        let approveSalesman = await salesmanModel.findOneAndUpdate({ _id: salesmanId }, { $set: { adminId: adminId, approvedTime: new Date(), isApproved: isApproved } }, { new: true })

        return res.status(200).send({ status: true, message: "Status updated successfully", data: approveSalesman })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let approveBusiness = async function (req, res) {
    try {
        let adminId = req.params.adminId
        if (!isValid(adminId) && !isValidObjectId(adminId)) {
            return res.status(400).send({ status: false, message: message('Admin Id') })
        }

        let checkAdmin = await adminModel.findOne({ _id: adminId, isDeleted: false })
        if (!checkAdmin) {
            return res.status(404).send({ status: false, message: "Admin not found" })
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { businessId, isApproved } = data

        if (!isValid(businessId) && !isValidObjectId(businessId)) {
            return res.status(400).send({ status: false, message: message('Business Id') })
        }

        let checkBusiness = await businessModel.findOne({ _id: businessId, isDeleted: false })
        if (!checkBusiness) {
            return res.status(404).send({ status: false, message: "Business not found" })
        }

        if (typeof isApproved !== 'boolean') {
            return res.status(400).send({ status: false, message: "isApproved must be a boolean" })
        }

        let approveBusiness = await businessModel.findOneAndUpdate({ _id: businessId }, { $set: { adminId: adminId, approvedTime: new Date(), isApproved: isApproved } }, { new: true })

        return res.status(200).send({ status: true, message: "Status updated successfully", data: approveBusiness })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { approveSalesman, approveBusiness }