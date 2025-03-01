const express = require('express')
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")

const {
    addEngin,
    getAllEngins,
    updateEngin,
    deleteEngin,
    downloadEnginsExcel,
} = require("../controllers/enginController")


router.post('/add', protect, addEngin)
router.get('/get', protect, getAllEngins)
router.put('/:id', protect, updateEngin)
router.delete('/:id', protect, deleteEngin)
router.get('/downloadexcel', protect, downloadEnginsExcel)


module.exports = router