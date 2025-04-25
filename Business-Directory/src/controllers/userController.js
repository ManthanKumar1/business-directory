let userModel = require('../models/userModel')
let jwt = require('jsonwebtoken')
let argon2 = require('argon2')
let { isValid, isValidObjectId, message, isValidPhone, isValidEmail, isValidPassword } = require('../validator/validation')

let createUser = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { userName, userPhone, userEmail, password } = data

        if (!isValid(userName)) {
            return res.status(400).send({ status: false, message: message('User Name') })
        }

        if (!isValid(userPhone) && !isValidPhone.test(userPhone)) {
            return res.status(400).send({ status: false, message: message('User Phone Number') })
        }

        if (!isValid(userEmail) && !isValidEmail.test(userEmail)) {
            return res.status(400).send({ status: false, message: message('User Email') })
        }

        let checkUser = await userModel.findOne({ $or: [{ userPhone: userPhone, isDeleted: false }, { userEmail: userEmail, isDeleted: false }] })

        if (checkUser) {
            if (checkUser.userPhone == userPhone) {
                return res.status(400).send({ status: false, message: "User Phone Number already in use" })
            }
            if (checkUser.userEmail == userEmail) {
                return res.status(400).send({ status: false, message: "User Email already in use" })
            }
        }

        if (!isValid(password) && !isValidPassword.test(password)) {
            return res.status(400).send({ status: false, message: message('Password') })
        }
        data.password = await argon2.hash(password)

        let createUser = await userModel.create(data)

        return res.status(201).send({ status: true, message: "User created successfully", data: createUser })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let loginUser = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { userEmail, password } = data

        if (!isValid(userEmail) && !isValidEmail.test(userEmail)) {
            return res.status(400).send({ status: false, message: message('User Email') })
        }

        let checkUser = await userModel.findOne({ userEmail: userEmail, isDeleted: false })
        if (!checkUser) {
            return res.status(404).send({ status: false, message: "User not found" })
        }

        if (!isValid(password) && !isValidPassword.test(password)) {
            return res.status(400).send({ status: false, message: message('Password') })
        }

        let checkPassword = await argon2.verify(checkUser.password, password)
        if (!checkPassword) {
            return res.status(400).send({ status: false, message: "Incorrect Password" })
        }

        let token = jwt.sign({
            userId: checkUser._id.toString()
        }, "business-directory")

        let showData = {
            userId: checkUser._id,
            token: token
        }

        return res.status(200).send({ status: true, message: "Login successfully", data: showData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getUser = async function (req, res) {
    try {
        let { userId } = req.query

        if (userId) {
            if (!isValid(userId) && !isValidObjectId(userId)) {
                return res.status(400).send({ status: false, message: message('User Id') })
            }

            let fetchUser = await userModel.findOne({ _id: userId, isDeleted: false })
            if (!fetchUser) {
                return res.status(404).send({ status: false, message: "User not found" })
            }

            return res.status(200).send({ status: true, message: "Your details", data: fetchUser })
        } else {
            let fetchUser = await userModel.find({ isDeleted: false })
            if (fetchUser.length == 0) {
                return res.status(404).send({ status: false, message: "User not found" })
            }

            return res.status(200).send({ status: true, message: "All User details", count: fetchUser.length, data: fetchUser })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let updateUser = async function (req, res) {
    try {
        let userId = req.params.userId

        if (!isValid(userId) && !isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: message('User Id') })
        }

        let checkUserDetail = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!checkUserDetail) {
            return res.status(404).send({ status: false, message: "User not found" })
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { userName, userPhone, userEmail, password } = data

        if (userName) {
            if (!isValid(userName)) {
                return res.status(400).send({ status: false, message: message('User Name') })
            }
        } else {
            userName = checkUserDetail.userName
        }

        if (userPhone) {
            if (!isValid(userPhone) && !isValidPhone.test(userPhone)) {
                return res.status(400).send({ status: false, message: message('User Phone Number') })
            }

            if (checkUserDetail.userPhone != userPhone) {
                let checkUser = await userModel.findOne({ userPhone: userPhone, isDeleted: false })
                if (checkUser) {
                    return res.status(400).send({ status: false, message: "User Phone Number already in use" })
                }
            }
        } else {
            userPhone = checkUserDetail.userPhone
        }

        if (userEmail) {
            if (!isValid(userEmail) && !isValidEmail.test(userEmail)) {
                return res.status(400).send({ status: false, message: message('User Email') })
            }

            if (checkUserDetail.userEmail != userEmail) {
                let checkEmail = await userModel.findOne({ userEmail: userEmail, isDeleted: false })
                if (checkEmail) {
                    return res.status(400).send({ status: false, message: "User Email already in use" })
                }
            }
        } else {
            userEmail = checkUserDetail.userEmail
        }

        if (password) {
            if (!isValid(password) && !isValidPassword.test(password)) {
                return res.status(400).send({ status: false, message: message('Password') })
            }
            password = await argon2.hash(password)
        } else {
            password = checkUserDetail.password
        }

        let updateData = { userName, userPhone, userEmail, password }

        let updateUser = await userModel.findOneAndUpdate({ _id: userId }, { $set: updateData }, { new: true })

        return res.status(200).send({ status: true, message: "User updated successfully", data: updateUser })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let deleteUser = async function (req, res) {
    try {
        let userId = req.params.userId

        if (!isValid(userId) && !isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: message('User Id') })
        }

        let deleteUser = await userModel.findOneAndUpdate({ _id: userId, isDeleted: false }, { $set: { isDeleted: true } }, { new: true })
        if (!deleteUser) {
            return res.status(404).send({ status: false, message: "User not found" })
        }

        return res.status(200).send({ status: true, message: "User deleted successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createUser, loginUser, getUser, updateUser, deleteUser }