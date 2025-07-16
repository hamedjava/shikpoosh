require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ایمپورت مسیرها و کنترلرها
const productRoutes = require('./src/frameworks/express/routes/productRoutes');
const productController = require('./src/frameworks/express/controllers/productController');
const authRoutes = require('./src/frameworks/express/routes/authRoutes');
const protectedRoutes = require('./src/frameworks/express/routes/protectedRoutes');
const cookieParser = require('cookie-parser');
const adminRoutes = require('./src/interface/http/routes/adminRoutes');
const sellerRoutes = require('./src/interface/http/routes/sellerRoutes');
const customerRoutes = require('./src/interface/http/routes/customerRoutes');



// استخراج متدهای مرتب‌ سازی از کنترلر
const { getSortedProductsByPriceAsc, getSortedProductsByPriceDesc } = productController;

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shikpoosh'; // استفاده از متغیر محیطی برای MongoDB URI

// بررسی مقدار MONGO_URI قبل از اتصال
if (!MONGO_URI) {
    console.error("❌ خطا: مقدار MONGO_URI در .env یافت نشد!");
    process.exit(1);
}

// اضافه کردن middleware برای پردازش داده‌های JSON
app.use(express.json());
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

///////////////////////////////////////////////////////////////
//اگر پورت دامته چیز دیگری بود اینجوری تنظیم میشه
// app.use(cors({
//     origin: 'http://localhost:5000', // یا هر دامنه فرانتت
//     credentials: true
// }));
///////////////////////////////////////////////////////////


// اتصال به دیتابیس
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // در صورت خطا، سرور به‌طور خودکار متوقف می‌شود
    });
    
app.use(cookieParser());
// استفاده از مسیرهای محصولات
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/customer', customerRoutes);


// نمایش مسیرهای فعال
if (process.env.NODE_ENV === 'development') {
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            console.log(`🔗 Path: ${middleware.route.path}, Methods: ${Object.keys(middleware.route.methods).join(', ')}`);
        }
    });
}

app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`🔗 مسیر فعال: ${middleware.route.path}, متد: ${Object.keys(middleware.route.methods).join(', ')}`);
    }
});

// راه‌اندازی سرور
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// مسیر تست
app.get('/', (req, res) => {
    res.send('✅ Server is running!');
});

// بررسی مقدار productRoutes
console.log("📌 آیا productRoutes مقدار دارد؟", productRoutes);
