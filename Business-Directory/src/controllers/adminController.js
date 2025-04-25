let adminModel = require('../models/adminModel')
let jwt = require('jsonwebtoken')
let argon2 = require('argon2')
let { isValid, isValidObjectId, message, isValidPhone, isValidEmail, isValidPassword } = require('../validator/validation')

let createAdmin = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { adminName, adminPhone, adminEmail, password } = data

        if (!isValid(adminName)) {
            return res.status(400).send({ status: false, message: message('Admin Name') })
        }

        if (!isValid(adminPhone) && !isValidPhone.test(adminPhone)) {
            return res.status(400).send({ status: false, message: message('Admin Phone Number') })
        }

        if (!isValid(adminEmail) && !isValidEmail.test(adminEmail)) {
            return res.status(400).send({ status: false, message: message('Admin Email') })
        }

        let checkAdmin = await adminModel.findOne({ $or: [{ adminPhone: adminPhone, isDeleted: false }, { adminEmail: adminEmail, isDeleted: false }] })

        if (checkAdmin) {
            if (checkAdmin.adminPhone == adminPhone) {
                return res.status(400).send({ status: false, message: "Admin Phone Number already in use" })
            }
            if (checkAdmin.adminEmail == adminEmail) {
                return res.status(400).send({ status: false, message: "Admin Email already in use" })
            }
        }

        if (!isValid(password) && !isValidPassword.test(password)) {
            return res.status(400).send({ status: false, message: message('Password') })
        }
        data.password = await argon2.hash(password)

        let createAdmin = await adminModel.create(data)

        return res.status(201).send({ status: true, message: "Admin created successfully", data: createAdmin })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let loginAdmin = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { adminEmail, password } = data

        if (!isValid(adminEmail) && !isValidEmail.test(adminEmail)) {
            return res.status(400).send({ status: false, message: message('Admin Email') })
        }

        let checkAdmin = await adminModel.findOne({ adminEmail: adminEmail, isDeleted: false })
        if (!checkAdmin) {
            return res.status(404).send({ status: false, message: "Admin not found" })
        }

        if (!isValid(password) && !isValidPassword.test(password)) {
            return res.status(400).send({ status: false, message: message('Password') })
        }

        let checkPassword = await argon2.verify(checkAdmin.password, password)
        if (!checkPassword) {
            return res.status(400).send({ status: false, message: "Incorrect Password" })
        }

        let token = jwt.sign({
            adminId: checkAdmin._id.toString()
        }, "business-directory")

        let showData = {
            adminId: checkAdmin._id,
            token: token
        }

        return res.status(200).send({ status: true, message: "Login successfully", data: showData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getAdmin = async function (req, res) {
    try {
        let { adminId } = req.query

        if (adminId) {
            if (!isValid(adminId) && !isValidObjectId(adminId)) {
                return res.status(400).send({ status: false, message: message('Admin Id') })
            }

            let fetchAdmin = await adminModel.findOne({ _id: adminId, isDeleted: false })
            if (!fetchAdmin) {
                return res.status(404).send({ status: false, message: "Admin not found" })
            }

            return res.status(200).send({ status: true, message: "Your details", data: fetchAdmin })
        } else {
            let fetchAdmin = await adminModel.find({ isDeleted: false })
            if (fetchAdmin.length == 0) {
                return res.status(404).send({ status: false, message: "Admin not found" })
            }

            return res.status(200).send({ status: true, message: "All admin details", count: fetchAdmin.length, data: fetchAdmin })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let updateAdmin = async function (req, res) {
    try {
        let adminId = req.params.adminId

        if (!isValid(adminId) && !isValidObjectId(adminId)) {
            return res.status(400).send({ status: false, message: message('Admin Id') })
        }

        let checkAdminDetail = await adminModel.findOne({ _id: adminId, isDeleted: false })
        if (!checkAdminDetail) {
            return res.status(404).send({ status: false, message: "Admin not found" })
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { adminName, adminPhone, adminEmail, password } = data

        if (adminName) {
            if (!isValid(adminName)) {
                return res.status(400).send({ status: false, message: message('Admin Name') })
            }
        } else {
            adminName = checkAdminDetail.adminName
        }

        if (adminPhone) {
            if (!isValid(adminPhone) && !isValidPhone.test(adminPhone)) {
                return res.status(400).send({ status: false, message: message('Admin Phone Number') })
            }

            if (checkAdminDetail.adminPhone != adminPhone) {
                let checkAdmin = await adminModel.findOne({ adminPhone: adminPhone, isDeleted: false })
                if (checkAdmin) {
                    return res.status(400).send({ status: false, message: "Admin Phone Number already in use" })
                }
            }
        } else {
            adminPhone = checkAdminDetail.adminPhone
        }

        if (adminEmail) {
            if (!isValid(adminEmail) && !isValidEmail.test(adminEmail)) {
                return res.status(400).send({ status: false, message: message('Admin Email') })
            }

            if (checkAdminDetail.adminEmail != adminEmail) {
                let checkEmail = await adminModel.findOne({ adminEmail: adminEmail, isDeleted: false })
                if (checkEmail) {
                    return res.status(400).send({ status: false, message: "Admin Email already in use" })
                }
            }
        } else {
            adminEmail = checkAdminDetail.adminEmail
        }

        if (password) {
            if (!isValid(password) && !isValidPassword.test(password)) {
                return res.status(400).send({ status: false, message: message('Password') })
            }
            password = await argon2.hash(password)
        } else {
            password = checkAdminDetail.password
        }

        let updateData = { adminName, adminPhone, adminEmail, password }

        let updateAdmin = await adminModel.findOneAndUpdate({ _id: adminId }, { $set: updateData }, { new: true })

        return res.status(200).send({ status: true, message: "Admin updated successfully", data: updateAdmin })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let deleteAdmin = async function (req, res) {
    try {
        let adminId = req.params.adminId

        if (!isValid(adminId) && !isValidObjectId(adminId)) {
            return res.status(400).send({ status: false, message: message('Admin Id') })
        }

        let deleteAdmin = await adminModel.findOneAndUpdate({ _id: adminId, isDeleted: false }, { $set: { isDeleted: true } }, { new: true })
        if (!deleteAdmin) {
            return res.status(404).send({ status: false, message: "Admin not found" })
        }

        return res.status(200).send({ status: true, message: "Admin deleted successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createAdmin, loginAdmin, getAdmin, updateAdmin, deleteAdmin }