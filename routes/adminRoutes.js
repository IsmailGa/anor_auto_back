const express = require("express")
const {adminLogin, adminRegister, adminLogout} = require("../controllers/adminController")
const authMiddleware  = require("../middleWare/authMiddleWare");
const router = express.Router()
const { check } = require('express-validator');

const adminValidationRules = [
  check('username')
    .isLength({ min: 6 })
    .withMessage('Имя пользователя должно быть более 6 символов'),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Пароль пользователя должен быть более 8 символов'),
];

router.post("/register",  adminValidationRules ,adminRegister)
router.post("/login", adminLogin)
router.post("/logout", authMiddleware, adminLogout)

module.exports = router