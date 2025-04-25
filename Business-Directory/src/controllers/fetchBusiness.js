let businessModel = require('../models/businessModel')
let { isValid } = require('../validator/validation')

let fetchBusiness = async function (req, res) {
    try {
        const { latitude, longitude } = req.query

        // if (!isValid(latitude) || !isValid(longitude)) {
        //     return res.status(400).send({ status: false, message: "Latitude and longitude are required" })
        // }

        const lat = parseFloat(latitude)
        const lon = parseFloat(longitude)

        // if (isNaN(lat) || isNaN(lon)) {
        //     return res.status(400).send({ status: false, message: "Invalid latitude or longitude" })
        // }

        let businesses = await businessModel.find({ isDeleted: false })

        if (businesses.length === 0) {
            return res.status(404).send({ status: false, message: "Business not found" })
        }

        businesses = businesses
            .map(business => {
                const businessLat = parseFloat(business.latitude)
                const businessLon = parseFloat(business.longitude)

                if (isNaN(businessLat) || isNaN(businessLon)) {
                    business.distance = Infinity
                } else {
                    business.distance = Math.sqrt(Math.pow(businessLat - lat, 2) + Math.pow(businessLon - lon, 2))
                }

                return business
            })
            .sort((a, b) => a.distance - b.distance)

        return res.status(200).send({ status: true, message: "All business details", count: businesses.length, data: businesses })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { fetchBusiness }