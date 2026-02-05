const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: [true, "Product name is required"],
    validate: {
      validator: function (value) {
        return /^[A-Za-z0-9 ]{3,100}$/.test(value);
      },
      message: "Product name must be 3–100 characters long and contain only letters, numbers, and spaces"
    }
  },

  product_qty: {
    type: Number,
    required: [true, "Product quantity is required"],
    min: [1, "Product quantity cannot be less than 1"],
    validate: {
      validator: function (qty) {
        return Number.isInteger(qty) && qty >= 1;
      },
      message: "Product quantity must be an integer and at least 1"
    }
  },

  product_price: {
    type: Number,
    required: [true, "Price can't be blank"],
    validate: {
      validator: function (value) {
        return Number.isInteger(value) && value >= 10; // Minimum 10
      },
      message: "Price must be an integer and at least 10"
    }
  },

  product_img: {
    type: String,
    required: function () { return this.isNew; }, // required only on creation
    validate: {
      validator: function (imgvalue) {
        return !imgvalue || /\.(jpg|jpeg|png|webp)$/i.test(imgvalue);
      },
      message: "Product image must be a valid image file (jpg, jpeg, png, webp)"
    }
  },

  product_description: {
    type: String,
    required: [true, "Product description is required"],
    minlength: [10, "Description must be at least 10 characters long"],
    maxlength: [1000, "Description cannot exceed 1000 characters"]
  },

  product_category: {
    type: Number,
    required: [true, "Product category is required"],
    validate: {
      validator: function (value) {
        return Number.isInteger(value) && value > 0 && value <= 10;
      },
      message: "Product category must be a positive integer between 1 and 10"
    }
  },
   createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    
  product_stock: {
    type: Number,
    required: [true, "Product stock is required"],
    validate: {
      validator: function (value) {
        return Number.isInteger(value) && value >= 0;
      },
      message: "Product stock must be a non-negative integer"
    }
  },

  product_status: {
    type: Number,
    required: [true, "Product status is required"],
    validate: {
      validator: function (value) {
        return value === 0 || value === 1;
      },
      message: "Product status must be either 0 (inactive) or 1 (active)"
    }
  },

  product_created_at: {
    type: Number,
    required: [true, "Product creation time is required"],
    validate: {
      validator: function (value) {
        return typeof value === "number" && value > 0;
      },
      message: "Product creation time must be a valid timestamp"
    }
  },

  product_updated_at: {
    type: Number,
    required: [true, "Product update time is required"],
    validate: {
      validator: function (value) {
        return typeof value === "number" && value > 0;
      },
      message: "Product update time must be a valid timestamp"
    }
  }

}, { versionKey: false });

module.exports = mongoose.model("Product", productSchema,);
