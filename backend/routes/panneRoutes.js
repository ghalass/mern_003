const express = require('express')
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")

const {
    addPanne,
    getAllPannes,
    updatePanne,
    deletePanne,
    downloadPannesExcel,
} = require("../controllers/panneController")


router.post('/add', protect, addPanne)
router.get('/get', protect, getAllPannes)
router.put('/:id', protect, updatePanne)
router.delete('/:id', protect, deletePanne)
router.get('/downloadexcel', protect, downloadPannesExcel)


module.exports = router