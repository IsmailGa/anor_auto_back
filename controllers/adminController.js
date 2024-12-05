require("dotenv").config();
const pool = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.adminRegister = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO admins (username, password) VALUES($1, $2)", [
      username,
      hashedPassword,
    ]);
    res.status(201).json({ message: "Админ зарегистрирован!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const adminResult = await pool.query(
      "SELECT * FROM admins WHERE username = $1",
      [username]
    );
    if (adminResult.rows.length === 0) {
      return res.status(400).json({ message: "Неверные учётные данные" });
    }

    const admin = adminResult.rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Неверные учётные данные" });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT,
      { expiresIn: "30d" }
    );

    await pool.query("UPDATE admins SET token = $1 WHERE id = $2", [
      token,
      admin.id,
    ]);

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      })
      .json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.adminLogout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "Не авторизован" });
    }

    const decoded = jwt.verify(token, process.env.JWT);
    await pool.query("UPDATE admins SET token = NULL WHERE id = $1", [
      decoded.id,
    ]);

    res.clearCookie("token").json({ message: "Выход выполнен" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
