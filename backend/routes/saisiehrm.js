
const express = require('express')
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")

const {
    getSaisieHrm,
    addPanneHim,
    deletePanneHim
} = require("../controllers/saisiehrmController")


router.post('/getSaisieHrm', protect, getSaisieHrm)
router.post('/addPanneHim', protect, addPanneHim)
router.delete('/deletePanneHim/:id', protect, deletePanneHim)


module.exports = router