const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام محصول الزامی است"],
      trim: true,
      minlength: [3, "نام محصول باید حداقل 3 کاراکتر باشد"]
    },
    price: {
      type: Number,
      required: [true, "قیمت محصول الزامی است"],
      min: [0, "قیمت محصول باید یک عدد مثبت باشد"]
    },
    description: {
      type: String,
      required: [true, "توضیحات محصول الزامی است"],
      maxlength: [500, "توضیحات محصول نباید بیشتر از 500 کاراکتر باشد"]
    },
    category: {
      type: String,
      required: [true, "دسته‌بندی محصول الزامی است"],
      enum: {
        values: ["لوازم خانگی", "پوشاک", "لوازم الکترونیکی"],  // به جای این موارد دسته‌بندی‌های واقعی خود را قرار دهید
        message: "دسته‌بندی محصول معتبر نیست"
      }
    }
  },
  { timestamps: true }  // ثبت زمان ایجاد و بروزرسانی
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
