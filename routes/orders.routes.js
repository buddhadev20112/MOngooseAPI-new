const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");

router.post("/place/:uid", async (req, res) => {
    try {
        const { products, payment_method, total_amount } = req.body;
        const order = await Order.create({
            user_id: req.params.uid,
            products,
            payment_method,
            total_amount
        });
        res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get("/view/:oid", async (req, res) => {
    try {
        const order = await Order.findById(req.params.oid)
            .populate("user_id")
            .populate("products.product_id");
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json({
            orderDetails: {
                order_id: order._id,
                order_date: order.order_date,
                status: order.status,
                payment_method: order.payment_method,
                total_amount: order.total_amount
            },
            userDetails: {
                name: order.user_id.name,
                phone: order.user_id.phone,
                email: order.user_id.email
            },
            products: order.products.map(p => ({
                product: p.product_id.product_name,
                price: p.product_id.product_price,
                quantity: p.quantity
            }))
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post("/auto-add/:userId", async (req, res) => {
    try {
        const { productId, quantity, payment_method, delivery_address } = req.body;

        let order = await Order.findOne({ user_id: req.params.userId, status: "pending" });

        if (!order) {
            // Create new pending order
            order = await Order.create({
                user_id: req.params.userId,
                products: [{ product_id: productId, quantity }],
                payment_method,
                total_amount: 0,
                delivery_address
            });
        } else {
            await order.addProduct(productId, quantity);
        }

        res.status(200).json({ message: "Product added successfully", order });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.post("/add", async (req, res) => {
    try {
        const { user_id, products, payment_method, total_amount, delivery_address } = req.body;

        const order = await Order.create({
            user_id,
            products,
            payment_method,
            total_amount,
            delivery_address
        });

        res.status(201).json({ message: "Order added successfully", order });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user_id")
            .populate("products.product_id");
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.put("/update/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json({ message: "Order status updated", order });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.delete("/delete/:id", async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json({ message: "Order deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.get("/status/:status", async (req, res) => {
    try {
        const orders = await Order.find({ status: req.params.status });
        res.json(orders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.get("/user/:userId", async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.params.userId });
        res.json(orders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.get("/date", async (req, res) => {
    try {
        const { start, end } = req.query;
        const orders = await Order.find({
            order_date: { $gte: new Date(start), $lte: new Date(end) }
        });
        res.json(orders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.get("/payment/:method", async (req, res) => {
    try {
        const orders = await Order.find({ payment_method: req.params.method });
        res.json(orders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.get("/product/:productId", async (req, res) => {
    try {
        const orders = await Order.find({ "products.product_id": req.params.productId });
        res.json(orders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.get("/sort", async (req, res) => {
    try {
        const { by = "order_date", order = "asc" } = req.query;
        const sortOrder = order === "asc" ? 1 : -1;
        const orders = await Order.find({}).sort({ [by]: sortOrder });
        res.json(orders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
