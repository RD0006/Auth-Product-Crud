const express = require("express");
const mongoose = require("mongoose");
const { body, param } = require("express-validator");

const Product = require("../models/Product");
const authenticate = require("../middleware/authenticate");
const handleValidation = require("../middleware/validation");

const router = express.Router();

const productValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number"),
  body("stock")
    .isNumeric()
    .withMessage("Stock must be a number")
];

const idValidation = [
  param("id").custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid product id")
];

// POST /api/products
router.post(
  "/",
  authenticate,
  productValidation,
  handleValidation,
  async (req, res) => {
    try {
      const { name, price, stock } = req.body;

      const product = await Product.create({
        name,
        price,
        stock
      });

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/products/:id
router.get("/:id", idValidation, handleValidation, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/products/:id
router.put(
  "/:id",
  authenticate,
  idValidation,
  productValidation,
  handleValidation,
  async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          price: req.body.price,
          stock: req.body.stock
        },
        { new: true, runValidators: true }
      );

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// DELETE /api/products/:id
router.delete(
  "/:id",
  authenticate,
  idValidation,
  handleValidation,
  async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;