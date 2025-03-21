require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;



const { MongoClient } = require("mongodb"); // ✅ این خط را اضافه کن

const uri = "mongodb://localhost:27017"; // آدرس اتصال به MongoDB
const dbName = "online_shop"; // نام دیتابیس
const collectionName = "products"; // نام کالکشن محصولات


// Middleware
app.use(express.json());
const corsOptions = {
    origin: '*',  // می‌تونی آدرس فرانت‌اند رو اینجا بذاری مثلاً "http://localhost:3000"
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // متدهایی که اجازه داریم استفاده کنیم
    allowedHeaders: ['Content-Type', 'Authorization']  // هدرهای مجاز
};

app.use(cors(corsOptions));

// اتصال به دیتابیس MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// استفاده از روتر محصولات
app.use('/products', productRoutes);


async function getSortedProductsByPrice(order = "asc") {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // تنظیم ترتیب مرتب‌سازی: 1 برای صعودی و -1 برای نزولی
        const sortOrder = order === "asc" ? 1 : -1;

        const products = await collection.find().sort({ price: sortOrder }).toArray();
        console.log(`🔍 Products sorted by price (${order === "asc" ? "Low to High" : "High to Low"}):`, products);
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await client.close();
    }
}

// مرتب‌سازی صعودی (ارزان‌ترین به گران‌ترین)
getSortedProductsByPrice("asc");

// مرتب‌سازی نزولی (گران‌ترین به ارزان‌ترین)
// getSortedProductsByPrice("desc");




// راه‌اندازی سرور
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

