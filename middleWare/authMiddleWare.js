require("dotenv").config();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT); // Make sure JWT_SECRET is in .env
        req.admin = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Неверный токен' });
    }
};

module.exports = authMiddleware;
