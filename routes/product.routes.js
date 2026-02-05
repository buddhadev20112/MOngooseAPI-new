const express = require("express");
const productModel = require("../models/product.models");
const { checkAuth } = require("../middleware/auth");
const { checkRole } = require("../middleware/role.middleware"); // role-based access
const upload = require("../middleware/multer");

const productRouter = express.Router();

// ==================== Admin Routes ====================

// Add product (Admin only)
productRouter.post("/add", checkAuth, checkRole("admin"), upload.single("pimg"), async (req, res) => {
  try {
    const productobj = await productModel.create({
      product_name: req.body.pname,
      product_qty: req.body.pqty,
      product_price: req.body.pprice,
      product_img: req.file?.filename || null,
      product_description: req.body.product_description,
      product_category: req.body.product_category,
      product_created_at: Date.now(),
      product_updated_at: Date.now(),
      product_status: req.body.product_status,
      product_stock: req.body.product_stock,
    });

    res.status(201).json({ message: "Product added successfully", product: productobj });
  } catch (error) {
    if (error?.errors) {
      const firstKey = Object.keys(error.errors)[0];
      return res.status(400).json({ error: error.errors[firstKey].message });
    }
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Update product (Admin only)
productRouter.put("/update/:id", checkAuth, checkRole("admin"), upload.single("pimg"), async (req, res) => {
  try {
    const updateData = {
      product_name: req.body.pname,
      product_qty: req.body.pqty,
      product_price: req.body.pprice,
      product_description: req.body.product_description,
      product_category: req.body.product_category,
      product_updated_at: Date.now(),
    };

    if (req.file) updateData.product_img = req.file.filename;

    const productObj = await productModel.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!productObj) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated successfully", product: productObj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product (Admin only)
productRouter.delete("/delete/:id", checkAuth, checkRole("admin"), async (req, res) => {
  try {
    const productObj = await productModel.deleteOne({ _id: req.params.id });
    if (!productObj.deletedCount) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== User Routes ====================

// Get all products (User & Admin)
productRouter.get("/all", checkAuth, checkRole("user", "admin"), async (req, res) => {
  try {
    const productobj = await productModel.find({});
    res.status(200).json(productobj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID (User & Admin)
productRouter.get("/:id", checkAuth, checkRole("user", "admin"), async (req, res) => {
  try {
    const productobj = await productModel.findById(req.params.id);
    if (!productobj) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(productobj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search products by name (User & Admin)
productRouter.get("/search/:key", checkAuth, checkRole("user", "admin"), async (req, res) => {
  try {
    const key = req.params.key;
    const products = await productModel.find({ product_name: { $regex: key, $options: "i" } });

    if (products.length === 0) return res.status(404).json({ message: "No products matched your search" });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get products in price range (User & Admin)
productRouter.get("/range/:min/:max", checkAuth, checkRole("user", "admin"), async (req, res) => {
  try {
    const min = Number(req.params.min);
    const max = Number(req.params.max);

    if (min >= max) return res.status(400).json({ message: "Invalid price range" });

    const products = await productModel.find({ product_price: { $gte: min, $lte: max } });

    if (products.length === 0) return res.status(404).json({ message: "No products found in this range" });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = productRouter;
console.log("✅ Product Router with Role-based Access is working");
