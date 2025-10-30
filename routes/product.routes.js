// routes/product.routes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

// Base route: /api/products

// Create a new Product
router.post("/", productController.create);

// Retrieve all Products
router.get("/", productController.findAll);

// Retrieve a single Product with id
router.get("/:id", productController.findOne);

// Update a Product with id
router.put("/:id", productController.update);

// Delete a Product with id
router.delete("/:id", productController.delete);

module.exports = router;