require("dotenv").config()
const pool = require("../models/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { validationResult, body } = require("express-validator")

exports.adminRegister = async (req, res) => {
    body("username").isLength({min : 6}).withMessage("Имя пользователя должно быть более 6 символов")
    body("password").isLength({min : 8}).withMessage("Пароль пользователя должно быть более 8 сивмолов")

    const error = validationResult(req)
    if(!error.isEmpty()) {
        return res.status(400).json({error : error.array() }) 
    }

    const { username, password} = req.body


    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        await pool.query("INSERT INTO admins (username, password) VALUES($1, $2)", [username, hashedPassword])
        res.status(201).json({ message: 'Админ зарегистрирован!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

exports.adminLogin = async (req, res) => {
    const {username, password} = req.body
    try {
        const adminResult = await pool.query("SELECT * FROM admins WHERE username = $1", [username])
        if(adminResult.rows.length == 0) {
            return res.status(400).json({message: "Неверные учётные данные"})
        }

        const admin = adminResult.rows[0]

        const isMatch = await bcrypt.compare(password, admin.password)

        if(!isMatch)  {
            return res.status(400).json({message: "Неверные учётные данные"})
        }

        const token = jwt.sign(
            {id: admin.id , username: admin.username},
            process.env.JWT,
            {expiresIn: '30d'}
        )

        res.json({token})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}