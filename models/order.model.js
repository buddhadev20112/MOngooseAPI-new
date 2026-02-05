const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    order_date: {
        type: Date,
        required: [true, 'Order Date is mandatory'],
        default: Date.now
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        required: [true, 'user_id is required'],
        ref: "userModel"
    },
    products: [
        {
            product_id: {
                type: mongoose.Types.ObjectId,
                ref: "productModel",
                required: [true, "Product ID is required"]
            },
            quantity: {
                type: Number,
                default: 1,
                min: [1, "Quantity cannot be less than 1"]
            }
        }
    ],
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    payment_method: {
        type: String,
        enum: ["cash", "card", "online"],
        required: [true, "Payment method is required"]
    },
    total_amount: {
        type: Number,
        required: [true, "Total amount is required"],
        min: [0, "Total amount cannot be negative"]
    },
    delivery_address: {
        type: String,
        required: [true, "Delivery address is required"]
    }
}, { versionKey: false });

// -------------------- Helper method to auto-add product --------------------
orderSchema.methods.addProduct = async function (productId, quantity = 1) {
    const existing = this.products.find(p => p.product_id.toString() === productId.toString());
    if (existing) {
        existing.quantity += quantity;
    } else {
        this.products.push({ product_id: productId, quantity });
    }

    // Recalculate total amount
    let total = 0;
    for (const item of this.products) {
        const product = await mongoose.model("Product").findById(item.product_id);
        if (product) total += product.product_price * item.quantity;
    }
    this.total_amount = total;
    await this.save();
    return this;
};

module.exports = mongoose.model("Order", orderSchema);
