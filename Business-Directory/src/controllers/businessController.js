let businessModel = require('../models/businessModel')
let { isValid, isValidObjectId, message, isValidPhone, isValidEmail } = require('../validator/validation')

let createBusiness = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { businessName, contactPersonName, businessEmail, phoneNumber, alternateNumber, whatsappNumber, address, country, state, city, pincode, latitude, longitude, businessType, other, industry, keywords, businessDescription, businessPhoto, registrationNumber, registrationCertificate, gstNumber, gstCertificate, panNumber, panCard, otherDocumentNumber, otherDocuments } = data

        if (!isValid(businessName)) {
            return res.status(400).send({ status: false, message: message('Business Name') })
        }

        if (!isValid(contactPersonName)) {
            return res.status(400).send({ status: false, message: message('Contact Person Name') })
        }

        if (!isValid(businessEmail) && !isValidEmail.test(businessEmail)) {
            return res.status(400).send({ status: false, message: message('Business Email') })
        }

        if (!isValid(phoneNumber) && !isValidPhone.test(phoneNumber)) {
            return res.status(400).send({ status: false, message: message('Phone Number') })
        }

        if (alternateNumber) {
            if (!isValid(alternateNumber) && !isValidPhone.test(alternateNumber)) {
                return res.status(400).send({ status: false, message: message('Alternate Number') })
            }
        }

        if (whatsappNumber) {
            if (!isValid(whatsappNumber) && !isValidPhone.test(whatsappNumber)) {
                return res.status(400).send({ status: false, message: message('Whatsapp Number') })
            }
        }

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

        if (!isValid(latitude)) {
            return res.status(400).send({ status: false, message: message('Latitude') })
        }

        if (!isValid(longitude)) {
            return res.status(400).send({ status: false, message: message('Longitude') })
        }

        if (!isValid(businessType) && !['Retail', 'Wholesale', 'Manufacture', 'Service', 'Other'].includes(businessType)) {
            return res.status(400).send({ status: false, message: message('Business Type') })
        }

        if (businessType == 'Other') {
            if (!isValid(other)) {
                return res.status(400).send({ status: false, message: message('Other') })
            }
        }

        // if (!isValid(industry)) {
        //     return res.status(400).send({ status: false, message: message('Industry') })
        // }

        // if (!isValid(keywords)) {
        //     return res.status(400).send({ status: false, message: message('Keywords') })
        // }

        if (!isValid(businessDescription)) {
            return res.status(400).send({ status: false, message: message('Business Description') })
        }

        // if (!isValid(businessPhoto)) {
        //     return res.status(400).send({ status: false, message: message('Business Photo') })
        // }

        const arrayFields = [
            { field: industry, fieldName: 'Industry' },
            { field: keywords, fieldName: 'Keywords' },
            { field: businessPhoto, fieldName: 'Business Photo' }
        ]

        for (let { field, fieldName } of arrayFields) {
            if (Array.isArray(field)) {
                data[fieldName.toLowerCase()] = field.map(item => item.trim()).filter(item => isValid(item))
            }
        }

        if (!isValid(registrationNumber)) {
            return res.status(400).send({ status: false, message: message('Registration Number') })
        }

        if (!isValid(registrationCertificate)) {
            return res.status(400).send({ status: false, message: message('Registration Certificate') })
        }

        if (!isValid(gstNumber)) {
            return res.status(400).send({ status: false, message: message('GST Number') })
        }

        if (!isValid(gstCertificate)) {
            return res.status(400).send({ status: false, message: message('GST Certificate') })
        }

        if (!isValid(panNumber)) {
            return res.status(400).send({ status: false, message: message('PAN Number') })
        }

        if (!isValid(panCard)) {
            return res.status(400).send({ status: false, message: message('PAN Card') })
        }

        if (!isValid(otherDocumentNumber)) {
            return res.status(400).send({ status: false, message: message('Other Document Number') })
        }

        if (!isValid(otherDocuments)) {
            return res.status(400).send({ status: false, message: message('Other Documents') })
        }

        let createBusiness = await businessModel.create(data)

        return res.status(201).send({ status: true, message: "Business created successfully", data: createBusiness })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getBusiness = async function (req, res) {
    try {
        let { businessId, adminId, isApproved } = req.query

        if (businessId && !adminId && !isApproved) {
            if (!isValid(businessId) && !isValidObjectId(businessId)) {
                return res.status(400).send({ status: false, message: message('Business Id') })
            }

            let fetchBusiness = await businessModel.findOne({ _id: businessId, isDeleted: false })
            if (!fetchBusiness) {
                return res.status(404).send({ status: false, message: "Business not found" })
            }

            return res.status(200).send({ status: true, message: "Your details", data: fetchBusiness })
        } else if (!businessId && adminId && !isApproved) {
            if (!isValid(adminId) && !isValidObjectId(adminId)) {
                return res.status(400).send({ status: false, message: message('Admin Id') })
            }

            let fetchBusiness = await businessModel.find({ adminId: adminId, isDeleted: false, isApproved: true })
            if (fetchBusiness.length == 0) {
                return res.status(404).send({ status: false, message: "Business not found" })
            }

            return res.status(200).send({ status: true, message: "Your details", count: fetchBusiness.length, data: fetchBusiness })
        } else if (!businessId && !adminId && isApproved) {
            if (!isValid(isApproved)) {
                return res.status(400).send({ status: false, message: message('Is Approved') })
            }

            let fetchBusiness = await businessModel.find({ isDeleted: false, isApproved: isApproved })
            if (fetchBusiness.length == 0) {
                return res.status(404).send({ status: false, message: "Business not found" })
            }

            return res.status(200).send({ status: true, message: `All business with approval ${isApproved} details`, count: fetchBusiness.length, data: fetchBusiness })
        } else {
            let fetchBusiness = await businessModel.find({ isDeleted: false })
            if (fetchBusiness.length == 0) {
                return res.status(404).send({ status: false, message: "Business not found" })
            }

            return res.status(200).send({ status: true, message: "All business details", count: fetchBusiness.length, data: fetchBusiness })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let updateBusiness = async function (req, res) {
    try {
        let businessId = req.params.businessId
        if (!isValid(businessId) && !isValidObjectId(businessId)) {
            return res.status(400).send({ status: false, message: message('Business Id') })
        }

        let checkBusiness = await businessModel.findOne({ _id: businessId, isDeleted: false })
        if (!checkBusiness) {
            return res.status(404).send({ status: false, message: "Business not found" })
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { businessName, contactPersonName, businessEmail, phoneNumber, alternateNumber, whatsappNumber, address, country, state, city, pincode, latitude, longitude, businessType, other, industry, keywords, businessDescription, businessPhoto, registrationNumber, registrationCertificate, gstNumber, gstCertificate, panNumber, panCard, otherDocumentNumber, otherDocuments } = data

        if (businessName) {
            if (!isValid(businessName)) {
                return res.status(400).send({ status: false, message: message('Business Name') })
            }
        } else {
            businessName = checkBusiness.businessName
        }

        if (contactPersonName) {
            if (!isValid(contactPersonName)) {
                return res.status(400).send({ status: false, message: message('Contact Person Name') })
            }
        } else {
            contactPersonName = checkBusiness.contactPersonName
        }

        if (businessEmail) {
            if (!isValid(businessEmail) && !isValidEmail.test(businessEmail)) {
                return res.status(400).send({ status: false, message: message('Business Email') })
            }
        } else {
            businessEmail = checkBusiness.businessEmail
        }

        if (phoneNumber) {
            if (!isValid(phoneNumber) && !isValidPhone.test(phoneNumber)) {
                return res.status(400).send({ status: false, message: message('Phone Number') })
            }
        } else {
            phoneNumber = checkBusiness.phoneNumber
        }

        if (alternateNumber) {
            if (!isValid(alternateNumber) && !isValidPhone.test(alternateNumber)) {
                return res.status(400).send({ status: false, message: message('Alternate Number') })
            }
        } else {
            alternateNumber = checkBusiness.alternateNumber
        }

        if (whatsappNumber) {
            if (!isValid(whatsappNumber) && !isValidPhone.test(whatsappNumber)) {
                return res.status(400).send({ status: false, message: message('Whatsapp Number') })
            }
        } else {
            whatsappNumber = checkBusiness.whatsappNumber
        }

        if (address) {
            if (!isValid(address)) {
                return res.status(400).send({ status: false, message: message('Address') })
            }
        } else {
            address = checkBusiness.address
        }

        if (country) {
            if (!isValid(country)) {
                return res.status(400).send({ status: false, message: message('Country') })
            }
        } else {
            country = checkBusiness.country
        }

        if (state) {
            if (!isValid(state)) {
                return res.status(400).send({ status: false, message: message('State') })
            }
        } else {
            state = checkBusiness.state
        }

        if (city) {
            if (!isValid(city)) {
                return res.status(400).send({ status: false, message: message('City') })
            }
        } else {
            city = checkBusiness.city
        }

        if (pincode) {
            if (!isValid(pincode)) {
                return res.status(400).send({ status: false, message: message('Pincode') })
            }
        } else {
            pincode = checkBusiness.pincode
        }

        if (latitude) {
            if (!isValid(latitude)) {
                return res.status(400).send({ status: false, message: message('Latitude') })
            }
        } else {
            latitude = checkBusiness.latitude
        }

        if (longitude) {
            if (!isValid(longitude)) {
                return res.status(400).send({ status: false, message: message('Longitude') })
            }
        } else {
            longitude = checkBusiness.longitude
        }

        if (businessType) {
            if (!isValid(businessType) && !['Retail', 'Wholesale', 'Manufacture', 'Service', 'Other'].includes(businessType)) {
                return res.status(400).send({ status: false, message: message('Business Type') })
            }

            if (businessType == 'Other') {
                if (!isValid(other)) {
                    return res.status(400).send({ status: false, message: message('Other') })
                }
            }
        } else {
            businessType = checkBusiness.businessType
        }

        if (industry) {
            if (!Array.isArray(industry) || industry.some(item => !isValid(item))) {
                return res.status(400).send({ status: false, message: message('Industry') });
            }
        } else {
            industry = checkBusiness.industry;
        }

        if (keywords) {
            if (!Array.isArray(keywords) || keywords.some(item => !isValid(item))) {
                return res.status(400).send({ status: false, message: message('Keywords') });
            }
        } else {
            keywords = checkBusiness.keywords;
        }

        if (businessDescription) {
            if (!isValid(businessDescription)) {
                return res.status(400).send({ status: false, message: message('Business Description') })
            }
        } else {
            businessDescription = checkBusiness.businessDescription
        }

        if (businessPhoto) {
            if (!Array.isArray(businessPhoto) || businessPhoto.some(photo => !isValid(photo))) {
                return res.status(400).send({ status: false, message: message('Business Photo') });
            }
        } else {
            businessPhoto = checkBusiness.businessPhoto;
        }

        if (registrationNumber) {
            if (!isValid(registrationNumber)) {
                return res.status(400).send({ status: false, message: message('Registration Number') })
            }
        } else {
            registrationNumber = checkBusiness.registrationNumber
        }

        if (registrationCertificate) {
            if (!isValid(registrationCertificate)) {
                return res.status(400).send({ status: false, message: message('Registration Certificate') })
            }
        } else {
            registrationCertificate = checkBusiness.registrationCertificate
        }

        if (gstNumber) {
            if (!isValid(gstNumber)) {
                return res.status(400).send({ status: false, message: message('GST Number') })
            }
        } else {
            gstNumber = checkBusiness.gstNumber
        }

        if (gstCertificate) {
            if (!isValid(gstCertificate)) {
                return res.status(400).send({ status: false, message: message('GST Certificate') })
            }
        } else {
            gstCertificate = checkBusiness.gstCertificate
        }

        if (panNumber) {
            if (!isValid(panNumber)) {
                return res.status(400).send({ status: false, message: message('PAN Number') })
            }
        } else {
            panNumber = checkBusiness.panNumber
        }

        if (panCard) {
            if (!isValid(panCard)) {
                return res.status(400).send({ status: false, message: message('PAN Card') })
            }
        } else {
            panCard = checkBusiness.panCard
        }

        if (otherDocumentNumber) {
            if (!isValid(otherDocumentNumber)) {
                return res.status(400).send({ status: false, message: message('Other Document Number') })
            }
        } else {
            otherDocumentNumber = checkBusiness.otherDocumentNumber
        }

        if (otherDocuments) {
            if (!isValid(otherDocuments)) {
                return res.status(400).send({ status: false, message: message('Other Documents') })
            }
        } else {
            otherDocuments = checkBusiness.otherDocuments
        }

        let updateData = { businessName, contactPersonName, businessEmail, phoneNumber, alternateNumber, whatsappNumber, address, country, state, city, pincode, latitude, longitude, businessType, other, industry, keywords, businessDescription, businessPhoto, registrationNumber, registrationCertificate, gstNumber, gstCertificate, panNumber, panCard, otherDocumentNumber, otherDocuments }

        let updateBusiness = await businessModel.findOneAndUpdate({ _id: businessId }, { $set: updateData }, { new: true })

        return res.status(200).send({ status: true, message: "Business updated successfully", data: updateBusiness })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// let addBusinessDetails = async function (req, res) {
//     try {
//         let businessId = req.params.businessId
//         if (!isValid(businessId) && !isValidObjectId(businessId)) {
//             return res.status(400).send({ status: false, message: message('Business Id') })
//         }

//         let checkBusiness = await businessModel.findOne({ _id: businessId, isDeleted: false })
//         if (!checkBusiness) {
//             return res.status(404).send({ status: false, message: "Business not found" })
//         }

//         let data = req.body
//         if (Object.keys(data).length == 0) {
//             return res.status(400).send({ status: false, message: "Body cannot be empty" })
//         }

//         let { businessName, contactPersonName, businessEmail, phoneNumber, alternateNumber, whatsappNumber, address, country, state, city, pincode, latitude, longitude, businessType, other, industry, keywords, businessDescription, businessPhoto, registrationNumber, registrationCertificate, gstNumber, gstCertificate, panNumber, panCard, otherDocumentNumber, otherDocuments } = data

//         if (businessName) {
//             if (!isValid(businessName)) {
//                 return res.status(400).send({ status: false, message: message('Business Name') })
//             }
//         } else {
//             businessName = checkBusiness.businessName
//         }

//         if (contactPersonName) {
//             if (!isValid(contactPersonName)) {
//                 return res.status(400).send({ status: false, message: message('Contact Person Name') })
//             }
//         } else {
//             contactPersonName = checkBusiness.contactPersonName
//         }

//         if (businessEmail) {
//             if (!isValid(businessEmail) && !isValidEmail.test(businessEmail)) {
//                 return res.status(400).send({ status: false, message: message('Business Email') })
//             }
//         } else {
//             businessEmail = checkBusiness.businessEmail
//         }

//         if (phoneNumber) {
//             if (!isValid(phoneNumber) && !isValidPhone.test(phoneNumber)) {
//                 return res.status(400).send({ status: false, message: message('Phone Number') })
//             }
//         } else {
//             phoneNumber = checkBusiness.phoneNumber
//         }

//         if (alternateNumber) {
//             if (!isValid(alternateNumber) && !isValidPhone.test(alternateNumber)) {
//                 return res.status(400).send({ status: false, message: message('Alternate Number') })
//             }
//         } else {
//             alternateNumber = checkBusiness.alternateNumber
//         }

//         if (whatsappNumber) {
//             if (!isValid(whatsappNumber) && !isValidPhone.test(whatsappNumber)) {
//                 return res.status(400).send({ status: false, message: message('Whatsapp Number') })
//             }
//         } else {
//             whatsappNumber = checkBusiness.whatsappNumber
//         }

//         if (address) {
//             if (!isValid(address)) {
//                 return res.status(400).send({ status: false, message: message('Address') })
//             }
//         } else {
//             address = checkBusiness.address
//         }

//         if (country) {
//             if (!isValid(country)) {
//                 return res.status(400).send({ status: false, message: message('Country') })
//             }
//         } else {
//             country = checkBusiness.country
//         }

//         if (state) {
//             if (!isValid(state)) {
//                 return res.status(400).send({ status: false, message: message('State') })
//             }
//         } else {
//             state = checkBusiness.state
//         }

//         if (city) {
//             if (!isValid(city)) {
//                 return res.status(400).send({ status: false, message: message('City') })
//             }
//         } else {
//             city = checkBusiness.city
//         }

//         if (pincode) {
//             if (!isValid(pincode)) {
//                 return res.status(400).send({ status: false, message: message('Pincode') })
//             }
//         } else {
//             pincode = checkBusiness.pincode
//         }

//         if (latitude) {
//             if (!isValid(latitude)) {
//                 return res.status(400).send({ status: false, message: message('Latitude') })
//             }
//         } else {
//             latitude = checkBusiness.latitude
//         }

//         if (longitude) {
//             if (!isValid(longitude)) {
//                 return res.status(400).send({ status: false, message: message('Longitude') })
//             }
//         } else {
//             longitude = checkBusiness.longitude
//         }

//         if (businessType) {
//             if (!isValid(businessType) && !['Retail', 'Wholesale', 'Manufacture', 'Service', 'Other'].includes(businessType)) {
//                 return res.status(400).send({ status: false, message: message('Business Type') })
//             }

//             if (businessType == 'Other') {
//                 if (!isValid(other)) {
//                     return res.status(400).send({ status: false, message: message('Other') })
//                 }
//             }
//         } else {
//             businessType = checkBusiness.businessType
//         }

//         if (industry) {
//             if (!Array.isArray(industry) || industry.some(item => !isValid(item))) {
//                 return res.status(400).send({ status: false, message: message('Industry') })
//             } else {
//                 industry = [...(checkBusiness.industry || []), ...industry]
//             }
//         } else {
//             industry = checkBusiness.industry
//         }

//         if (keywords) {
//             if (!Array.isArray(keywords) || keywords.some(item => !isValid(item))) {
//                 return res.status(400).send({ status: false, message: message('Keywords') })
//             } else {
//                 keywords = [...(checkBusiness.keywords || []), ...keywords]
//             }
//         } else {
//             keywords = checkBusiness.keywords
//         }

//         if (businessDescription) {
//             if (!isValid(businessDescription)) {
//                 return res.status(400).send({ status: false, message: message('Business Description') })
//             }
//         } else {
//             businessDescription = checkBusiness.businessDescription
//         }

//         if (businessPhoto) {
//             if (!Array.isArray(businessPhoto) || businessPhoto.some(photo => !isValid(photo))) {
//                 return res.status(400).send({ status: false, message: message('Business Photo') })
//             } else {
//                 businessPhoto = [...(checkBusiness.businessPhoto || []), ...businessPhoto]
//             }
//         } else {
//             businessPhoto = checkBusiness.businessPhoto
//         }

//         if (registrationNumber) {
//             if (!isValid(registrationNumber)) {
//                 return res.status(400).send({ status: false, message: message('Registration Number') })
//             }
//         } else {
//             registrationNumber = checkBusiness.registrationNumber
//         }

//         if (registrationCertificate) {
//             if (!isValid(registrationCertificate)) {
//                 return res.status(400).send({ status: false, message: message('Registration Certificate') })
//             }
//         } else {
//             registrationCertificate = checkBusiness.registrationCertificate
//         }

//         if (gstNumber) {
//             if (!isValid(gstNumber)) {
//                 return res.status(400).send({ status: false, message: message('GST Number') })
//             }
//         } else {
//             gstNumber = checkBusiness.gstNumber
//         }

//         if (gstCertificate) {
//             if (!isValid(gstCertificate)) {
//                 return res.status(400).send({ status: false, message: message('GST Certificate') })
//             }
//         } else {
//             gstCertificate = checkBusiness.gstCertificate
//         }

//         if (panNumber) {
//             if (!isValid(panNumber)) {
//                 return res.status(400).send({ status: false, message: message('PAN Number') })
//             }
//         } else {
//             panNumber = checkBusiness.panNumber
//         }

//         if (panCard) {
//             if (!isValid(panCard)) {
//                 return res.status(400).send({ status: false, message: message('PAN Card') })
//             }
//         } else {
//             panCard = checkBusiness.panCard
//         }

//         if (otherDocumentNumber) {
//             if (!isValid(otherDocumentNumber)) {
//                 return res.status(400).send({ status: false, message: message('Other Document Number') })
//             }
//         } else {
//             otherDocumentNumber = checkBusiness.otherDocumentNumber
//         }

//         if (otherDocuments) {
//             if (!isValid(otherDocuments)) {
//                 return res.status(400).send({ status: false, message: message('Other Documents') })
//             }
//         } else {
//             otherDocuments = checkBusiness.otherDocuments
//         }

//         let updateData = { businessName, contactPersonName, businessEmail, phoneNumber, alternateNumber, whatsappNumber, address, country, state, city, pincode, latitude, longitude, businessType, other, industry, keywords, businessDescription, businessPhoto, registrationNumber, registrationCertificate, gstNumber, gstCertificate, panNumber, panCard, otherDocumentNumber, otherDocuments }

//         let updateBusiness = await businessModel.findOneAndUpdate({ _id: businessId }, { $set: updateData }, { new: true })

//         return res.status(200).send({ status: true, message: "Business updated successfully", data: updateBusiness })
//     } catch (error) {
//         return res.status(500).send({ status: false, message: error.message })
//     }
// }

let deleteBusiness = async function (req, res) {
    try {
        let businessId = req.params.businessId
        if (!isValid(businessId) && !isValidObjectId(businessId)) {
            return res.status(400).send({ status: false, message: message('Business Id') })
        }

        let checkBusiness = await businessModel.findOne({ _id: businessId, isDeleted: false })
        if (!checkBusiness) {
            return res.status(404).send({ status: false, message: "Business not found" })
        }

        let deleteBusiness = await businessModel.findOneAndUpdate({ _id: businessId }, { $set: { isDeleted: false } }, { new: true })

        return res.status(200).send({ status: true, message: "Business deleted successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createBusiness, getBusiness, updateBusiness, deleteBusiness }