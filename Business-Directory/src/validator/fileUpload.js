const aws = require('aws-sdk')

// aws.config.update({
//     accessKeyId: "AKIAYS2NUM6S5FS52YFV",
//     secretAccessKey: "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",
//     region: "ap-south-1"
// })

let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        let s3 = new aws.S3({ apiVersion: '2006-03-01' })

        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "abc/" + file.originalname,
            Body: file.buffer
        }

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            console.log("file uploaded succesfully")
            return resolve(data.Location)
        })
    })
}

module.exports = { uploadFile }