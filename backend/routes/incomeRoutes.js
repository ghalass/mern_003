const express = require('express')
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")

const {
    addIncome,
    getAllIncome,
    downloadIncomeExcel,
    deleteIncome
} = require("../controllers/incomeController")


router.post('/add', protect, addIncome)
router.get('/get', protect, getAllIncome)
router.get('/downloadexcel', protect, downloadIncomeExcel)
router.delete('/:id', protect, deleteIncome)


module.exports = router