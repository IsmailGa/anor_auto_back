const jwt = require("jsonwebtoken");
const pool = require("../models/db");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Неавторизованный доступ" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT);

    const result = await pool.query(
      "SELECT * FROM admins WHERE id = $1 AND token = $2",
      [decoded.id, token]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Неавторизованный доступ" });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Токен недействителен" });
  }
};

module.exports = authMiddleware;
