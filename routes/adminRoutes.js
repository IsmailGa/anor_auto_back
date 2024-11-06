const express = require("express")
const {adminLogin, adminRegister} = require("../controllers/adminController")


const router = express.Router()


router.post("/register",  adminRegister)
router.post("/login", adminLogin)

module.exports = router