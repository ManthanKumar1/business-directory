let jwt = require('jsonwebtoken')

let authenticationAdmin = async function (req, res, next) {
    try {
        let bearerToken = req.headers["authorization"]
        if (!bearerToken) {
            return res.status(404).send({ status: false, msg: "Token must be present" })
        }

        let token = bearerToken.split(" ")[1]

        jwt.verify(token, "business-directory", (error, decodedToken) => {
            if (error) {
                return res.status(401).send({ status: false, msg: error.message })
            }
            req.token = decodedToken
            next()
        })
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports = { authenticationAdmin }