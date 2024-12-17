const express = require("express");
const jwt = require("jsonwebtoken");

const validateToken =
  ("/validate-token",
  (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ valid: false });

    try {
      jwt.verify(token, process.env.JWT);
      res.json({ valid: true });
    } catch (err) {
      res.status(401).json({ valid: false });
    }
  });

module.exports = validateToken;
