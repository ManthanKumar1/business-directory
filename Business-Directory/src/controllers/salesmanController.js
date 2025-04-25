let salesmanModel = require('../models/salesmanModel')
let jwt = require('jsonwebtoken')
let argon2 = require('argon2')
let { isValid, isValidObjectId, message, isValidPhone, isValidEmail, isValidPassword } = require('../validator/validation')

let createSalesman = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: 'Body cannot be empty' })
        }

        let { salesmanId, salesmanName, salesmanPhone, salesmanEmail, password, address, country, state, city, pincode, aadharNumber, aadharDocument, panNumber, panDocument } = data

        let lastSalesman = await salesmanModel.findOne().sort({ createdAt: -1 }).select('salesmanId')
        if (!lastSalesman) {
            data.salesmanId = 'BD0001'
        } else {
            let newIdNumber = parseInt(lastSalesman.salesmanId.slice(2)) + 1
            data.salesmanId = 'BD' + newIdNumber.toString().padStart(4, '0')
        }

        if (!isValid(salesmanName)) {
            return res.status(400).send({ status: false, message: message('Salesman Name') })
        }

        if (!isValid(salesmanPhone) && !isValidPhone.test(salesmanPhone)) {
            return res.status(400).send({ status: false, message: message('Salesman Phone Number') })
        }

        if (!isValid(salesmanEmail) && !isValidEmail.test(salesmanEmail)) {
            return res.status(400).send({ status: false, message: message('Salesman Email') })
        }

        let checkSalesman = await salesmanModel.findOne({ $or: [{ salesmanPhone: salesmanPhone, isDeleted: false }, { salesmanEmail: salesmanEmail, isDeleted: false }] })

        if (checkSalesman) {
            if (checkSalesman.salesmanPhone == salesmanPhone) {
                return res.status(400).send({ status: false, message: "Salesman Phone Number already in use" })
            }
            if (checkSalesman.salesmanEmail == salesmanEmail) {
                return res.status(400).send({ status: false, message: "Salesman Email already in use" })
            }
        }

        if (!isValid(password) && !isValidPassword.test(password)) {
            return res.status(400).send({ status: false, message: message('Password') })
        }
        data.password = await argon2.hash(password)

        if (!isValid(address)) {
            return res.status(400).send({ status: false, message: message('Address') })
        }

        if (!isValid(country)) {
            return res.status(400).send({ status: false, message: message('Country') })
        }

        if (!isValid(state)) {
            return res.status(400).send({ status: false, message: message('State') })
        }

        if (!isValid(city)) {
            return res.status(400).send({ status: false, message: message('City') })
        }

        if (!isValid(pincode)) {
            return res.status(400).send({ status: false, message: message('Pincode') })
        }

        if (!isValid(aadharNumber)) {
            return res.status(400).send({ status: false, message: message('Aadhar Number') })
        }

        if (!isValid(aadharDocument)) {
            return res.status(400).send({ status: false, message: message('Aadhar Document') })
        }

        if (!isValid(panNumber)) {
            return res.status(400).send({ status: false, message: message('Pan Number') })
        }

        if (!isValid(panDocument)) {
            return res.status(400).send({ status: false, message: message('Pan Document') })
        }

        let createSalesman = await salesmanModel.create(data)

        return res.status(201).send({ status: true, message: "Salesman created successfully", data: createSalesman })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let loginSalesman = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { salesmanEmail, password } = data

        if (!isValid(salesmanEmail) && !isValidEmail.test(salesmanEmail)) {
            return res.status(400).send({ status: false, message: message('Salesman Email') })
        }

        let checkSalesman = await salesmanModel.findOne({ salesmanEmail: salesmanEmail, isDeleted: false, isApproved: true })
        if (!checkSalesman) {
            return res.status(404).send({ status: false, message: "Salesman not found" })
        }

        if (!isValid(password) && !isValidPassword.test(password)) {
            return res.status(400).send({ status: false, message: message('Password') })
        }

        let checkPassword = await argon2.verify(checkSalesman.password, password)
        if (!checkPassword) {
            return res.status(400).send({ status: false, message: "Incorrect Password" })
        }

        let token = jwt.sign({
            salesmanId: checkSalesman._id.toString()
        }, "business-directory-salesman")

        let showData = {
            salesmanId: checkSalesman._id,
            token: token
        }

        return res.status(200).send({ status: true, message: "Salesman login successfully", data: showData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getSalesman = async function (req, res) {
    try {
        let { id, salesmanId, adminId, isApproved } = req.query

        if (id && !salesmanId && !adminId && !isApproved) {
            if (!isValid(id) && !isValidObjectId(id)) {
                return res.status(400).send({ status: false, message: message('Id') })
            }

            let fetchSalesman = await salesmanModel.findOne({ _id: id, isDeleted: false })
            if (!fetchSalesman) {
                return res.status(404).send({ status: false, message: "Salesman not found" })
            }

            return res.status(200).send({ status: true, message: "Your details", data: fetchSalesman })
        } else if (!id && salesmanId && !adminId && !isApproved) {
            if (!isValid(salesmanId)) {
                return res.status(400).send({ status: false, message: message('Salesman Id') })
            }

            let fetchSalesman = await salesmanModel.findOne({ salesmanId: salesmanId, isDeleted: false })
            if (!fetchSalesman) {
                return res.status(404).send({ status: false, message: "Salesman not found" })
            }

            return res.status(200).send({ status: true, message: "Your details", data: fetchSalesman })
        } else if (!id && !salesmanId && adminId && !isApproved) {
            if (!isValid(adminId) && !isValidObjectId(adminId)) {
                return res.status(400).send({ status: false, message: message('Admin Id') })
            }

            let fetchSalesman = await salesmanModel.find({ adminId: adminId, isDeleted: false, isApproved: true })
            if (fetchSalesman.length == 0) {
                return res.status(404).send({ status: false, message: "Salesman not found" })
            }

            return res.status(200).send({ status: true, message: "All your salesman's details", count: fetchSalesman.length, data: fetchSalesman })
        } else if (!id && !salesmanId && !adminId && isApproved) {
            if (!isValid(isApproved)) {
                return res.status(400).send({ status: false, message: message('Is Approved') })
            }

            let fetchSalesman = await salesmanModel.find({ isDeleted: false, isApproved: isApproved })
            if (fetchSalesman.length == 0) {
                return res.status(404).send({ status: false, message: "Salesman not found" })
            }

            return res.status(200).send({ status: true, message: "All your salesman's details", count: fetchSalesman.length, data: fetchSalesman })
        } else {
            let fetchSalesman = await salesmanModel.find({ isDeleted: false })
            if (fetchSalesman.length == 0) {
                return res.status(404).send({ status: false, message: "Salesman not found" })
            }

            return res.status(200).send({ status: true, message: "All salesman's details", count: fetchSalesman.length, data: fetchSalesman })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let updateSalesman = async function (req, res) {
    try {
        let salesmanId = req.params.salesmanId
        if (!isValid(salesmanId) && !isValidObjectId(salesmanId)) {
            return res.status(400).send({ status: false, message: message('Salesman Id') })
        }

        let checking = await salesmanModel.findOne({ _id: salesmanId, isDeleted: false, isApproved: true })
        if (!checking) {
            return res.status(404).send({ status: false, message: "Salesman not found" })
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: 'Body cannot be empty' })
        }

        let { salesmanName, salesmanPhone, salesmanEmail, password, address, country, state, city, pincode, aadharNumber, aadharDocument, panNumber, panDocument } = data

        if (salesmanName) {
            if (!isValid(salesmanName)) {
                return res.status(400).send({ status: false, message: message('Salesman Name') })
            }
        } else {
            salesmanName = checking.salesmanName
        }

        if (salesmanPhone) {
            if (!isValid(salesmanPhone) && !isValidPhone.test(salesmanPhone)) {
                return res.status(400).send({ status: false, message: message('Salesman Phone Number') })
            }

            if (checking.salesmanPhone != salesmanPhone) {
                let checkPhone = await salesmanModel.findOne({ salesmanPhone: salesmanPhone, isDeleted: false })
                if (checkPhone) {
                    return res.status(400).send({ status: false, message: "Phone Number already in use" })
                }
            }
        } else {
            salesmanPhone = checking.salesmanPhone
        }

        if (salesmanEmail) {
            if (!isValid(salesmanEmail) && !isValidEmail.test(salesmanEmail)) {
                return res.status(400).send({ status: false, message: message('Salesman Email') })
            }

            if (checking.salesmanEmail != salesmanEmail) {
                let checkEmail = await salesmanModel.findOne({ salesmanEmail: salesmanEmail, isDeleted: false })
                if (checkEmail) {
                    return res.status(400).send({ status: false, message: "Email already in use" })
                }
            }
        } else {
            salesmanEmail = checking.salesmanEmail
        }

        if (password) {
            if (!isValid(password) && !isValidPassword.test(password)) {
                return res.status(400).send({ status: false, message: message('Password') })
            }
            data.password = await argon2.hash(password)
        } else {
            password = checking.password
        }

        if (address) {
            if (!isValid(address)) {
                return res.status(400).send({ status: false, message: message('Address') })
            }
        } else {
            address = checking.address
        }

        if (country) {
            if (!isValid(country)) {
                return res.status(400).send({ status: false, message: message('Country') })
            }
        } else {
            country = checking.country
        }

        if (state) {
            if (!isValid(state)) {
                return res.status(400).send({ status: false, message: message('State') })
            }
        } else {
            state = checking.state
        }

        if (city) {
            if (!isValid(city)) {
                return res.status(400).send({ status: false, message: message('City') })
            }
        } else {
            city = checking.city
        }

        if (pincode) {
            if (!isValid(pincode)) {
                return res.status(400).send({ status: false, message: message('Pincode') })
            }
        } else {
            pincode = checking.pincode
        }

        if (aadharNumber) {
            if (!isValid(aadharNumber)) {
                return res.status(400).send({ status: false, message: message('Aadhar Number') })
            }
        } else {
            aadharNumber = checking.aadharNumber
        }

        if (aadharDocument) {
            if (!isValid(aadharDocument)) {
                return res.status(400).send({ status: false, message: message('Aadhar Document') })
            }
        } else {
            aadharDocument = checking.aadharDocument
        }

        if (panNumber) {
            if (!isValid(panNumber)) {
                return res.status(400).send({ status: false, message: message('Pan Number') })
            }
        } else {
            panNumber = checking.panNumber
        }

        if (panDocument) {
            if (!isValid(panDocument)) {
                return res.status(400).send({ status: false, message: message('Pan Document') })
            }
        } else {
            panDocument = checking.panDocument
        }

        let updateData = { salesmanName, salesmanPhone, salesmanEmail, password, address, country, state, city, pincode, aadharNumber, aadharDocument, panNumber, panDocument }

        let updateSalesman = await salesmanModel.findOneAndUpdate({ _id: salesmanId }, { $set: updateData }, { new: true })

        return res.status(200).send({ status: true, message: "Salesman updated successfully", data: updateSalesman })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let deleteSalesman = async function (req, res) {
    try {
        let salesmanId = req.params.salesmanId
        if (!isValid(salesmanId) && !isValidObjectId(salesmanId)) {
            return res.status(400).send({ status: false, message: message('Salesman Id') })
        }

        let checking = await salesmanModel.findOne({ _id: salesmanId, isDeleted: false, isApproved: true })
        if (!checking) {
            return res.status(404).send({ status: false, message: "Salesman not found" })
        }

        let deleteSalesman = await salesmanModel.findOneAndUpdate({ _id: salesmanId }, { $set: { isDeleted: true } }, { new: true })

        return res.status(200).send({ status: true, message: "Salesman deleted successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createSalesman, loginSalesman, getSalesman, updateSalesman, deleteSalesman }