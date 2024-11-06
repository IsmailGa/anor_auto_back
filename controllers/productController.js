const pool = require("../models/db");

exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addProduct = async (req, res) => {
  const {
    name_en,
    name_ru,
    category,
    part_number,
    price,
    status,
    image_url,
    size,
    weight,
    description_en,
    description_ru,
    created_at,
    updated_at,
  } = req.body;
  try {
    const newProduct = await pool.query(
      "INSERT INTO products (name_en, name_ru, category, part_number , price, status,  image_url , size, weight, description_en, description_ru ,created_at, updated_at ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
      [
        name_en,
        name_ru,
        category,
        part_number,
        price,
        status,
        image_url,
        size,
        weight,
        description_en,
        description_ru,
        created_at,
        updated_at,
      ]
    );
    res.json(newProduct.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.json({ message: "The product has been changed succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name_en,
    name_ru,
    category,
    part_number,
    price,
    status,
    image_url,
    size,
    weight,
    description_en,
    description_ru
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products
       SET name_en = $1, name_ru = $2, category = $3, part_number = $4,
           price = $5, status = $6, image_url = $7, size = $8, weight = $9,
           description_en = $10, description_ru = $11,
           updated_at = NOW()
       WHERE id = $12
       RETURNING *`,
      [
        name_en,
        name_ru,
        category,
        part_number,
        price,
        status,
        image_url,
        size,
        weight,
        description_en,
        description_ru,
        id,
      ]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error in updateProduct:", err.message);
    res.status(500).json({ message: err.message });
  }
};
