const express = require("express")
const {adminLogin, adminRegister, adminLogout} = require("../controllers/adminController")
const router = express.Router()



router.post("/register",  adminRegister)
router.post("/login", adminLogin)
// router.post("/logout", adminLogout)

module.exports = router