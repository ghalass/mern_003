
const express = require('express')
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")

const {
    getSaisieHrm
} = require("../controllers/saisiehrmController")


router.get('/getSaisieHrm', protect, getSaisieHrm)


module.exports = router