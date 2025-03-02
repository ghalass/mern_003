
const express = require('express')
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")

const {
    getSaisieHrm,
    addPanneHim,
    deletePanneHim,

    updateSaisieHrm,
    addSaisieHrm
} = require("../controllers/saisiehrmController")


router.post('/getSaisieHrm', protect, getSaisieHrm)
router.post('/addPanneHim', protect, addPanneHim)
router.delete('/deletePanneHim/:id', protect, deletePanneHim)

router.put('/:id', protect, updateSaisieHrm)
router.post('/', protect, addSaisieHrm)


module.exports = router