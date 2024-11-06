const express = require("express")
const { getAllProducts, addProduct, getProductById, updateProduct, deleteProduct } = require("../controllers/productController")
const authMiddleware = require("../middleWare/authMiddleWare")
const router = express.Router()


router.get("/", getAllProducts)
router.get("/:id", getProductById);
router.post("/", authMiddleware, addProduct)
router.put("/:id", authMiddleware, updateProduct)
router.delete("/:id", authMiddleware,  deleteProduct)

module.exports = router
