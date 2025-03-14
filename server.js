require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());

// ✅ اتصال به MongoDB
async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
}
connectDB();

// ✅ یک API ساده برای تست
app.get("/", (req, res) => {
    res.send("🚀 Shikpoosh Server is Running!");
});

// ✅ راه‌اندازی سرور
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
app.get("/api/test", (req, res) => {
    res.json({ message: "API is working fine! 🚀" });
});
const Product = require("./models/Product");

app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "خطای سرور", error });
    }
});

app.post('/products', async (req, res) => {
    try {
        const { name, price, category, description } = req.body;
        
        if (!name || !price || !category) {
            return res.status(400).json({ message: "لطفاً همه فیلدهای ضروری را پر کنید." });
        }

        const newProduct = new Product({ name, price, category, description });
        await newProduct.save();

        res.status(201).json({ message: "محصول با موفقیت اضافه شد!", product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "خطای سرور", error });
    }
});
