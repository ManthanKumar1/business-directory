let express = require('express')
let router = express.Router()

let { createAdmin, loginAdmin, getAdmin, updateAdmin, deleteAdmin } = require('../controllers/adminController')
let { createSalesman, loginSalesman, getSalesman } = require('../controllers/salesmanController')
let { createBusiness, getBusiness, updateBusiness, deleteBusiness } = require('../controllers/businessController')

let {fetchBusiness} = require('../controllers/fetchBusiness')
let { approveSalesman, approveBusiness } = require('../controllers/approvalController')

// test api
router.get('/test', function (req, res) {
    return res.status(200).send({ status: true, message: 'Code run perfectly' })
})

// fetchBusiness
router.get('/fetchBusiness', fetchBusiness)

// approval
router.post('/approveSalesman/:adminId', approveSalesman)
router.post('/approveBusiness/:adminId', approveBusiness)

// admin
router.post('/createAdmin', createAdmin)
router.post('/loginAdmin', loginAdmin)
router.get('/getAdmin', getAdmin)
router.post('/updateAdmin/:adminId', updateAdmin)
router.post('/deleteAdmin/:adminId', deleteAdmin)

// salesman
router.post('/createSalesman', createSalesman)
router.post('/loginSalesman', loginSalesman)
router.get('/getSalesman', getSalesman)

// business
router.post('/createBusiness', createBusiness)
router.get('/getBusiness', getBusiness)
router.post('/updateBusiness/:businessId', updateBusiness)
router.post('/deleteBusiness/:businessId', deleteBusiness)

module.exports = router