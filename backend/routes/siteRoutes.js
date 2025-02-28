const express = require('express')
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")

const {
    addSite,
    getAllSites,
    updateSite,
    deleteSite,
    downloadSitesExcel,
} = require("../controllers/siteController")


router.post('/add', protect, addSite)
router.get('/get', protect, getAllSites)
router.put('/:id', protect, updateSite)
router.delete('/:id', protect, deleteSite)
router.get('/downloadexcel', protect, downloadSitesExcel)


module.exports = router