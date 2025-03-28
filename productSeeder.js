require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product'); // مسیر مدل خود را بررسی کن

const MONGO_URI = 'mongodb://localhost:27017/shikpoosh'; // آدرس MongoDB Compass

// اتصال به دیتابیس
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected for Seeding"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// محصولات نمونه برای درج در دیتابیس
const sampleProducts = [
    { name: "تی‌شرت نخی مردانه", price: 250000, category: "مردانه", stock: 10 },
    { name: "لباس زیر زنانه", price: 150000, category: "زنانه", stock: 15 },
    { name: "شلوار کتان", price: 320000, category: "مردانه", stock: 8 },
    { name: "ست لباس راحتی زنانه", price: 450000, category: "زنانه", stock: 12 },
    { name: "جوراب اسپرت", price: 50000, category: "اکسسوری", stock: 20 },
    { name: "هودی پاییزی", price: 600000, category: "مردانه", stock: 5 },
    { name: "بلوز نخی زنانه", price: 270000, category: "زنانه", stock: 14 },
    { name: "کفش ورزشی", price: 850000, category: "کفش", stock: 7 },
    { name: "پیراهن مجلسی زنانه", price: 900000, category: "زنانه", stock: 6 },
    { name: "کاپشن زمستانی", price: 1200000, category: "مردانه", stock: 4 },
    { name: "شلوار جین", price: 380000, category: "مردانه", stock: 10 },
    { name: "کراوات رسمی", price: 190000, category: "اکسسوری", stock: 8 },
    { name: "دستکش چرمی", price: 220000, category: "اکسسوری", stock: 10 },
    { name: "لباس خواب زنانه", price: 370000, category: "زنانه", stock: 9 },
    { name: "کفش رسمی مردانه", price: 980000, category: "کفش", stock: 5 },
    { name: "عینک آفتابی", price: 450000, category: "اکسسوری", stock: 12 },
    { name: "کلاه بیسبال", price: 130000, category: "اکسسوری", stock: 15 },
    { name: "جوراب نخی", price: 40000, category: "اکسسوری", stock: 18 },
    { name: "ساعت مچی", price: 1500000, category: "اکسسوری", stock: 3 },
    { name: "سویشرت اسپرت", price: 550000, category: "مردانه", stock: 7 },
    { name: "سوت اسپرت", price: 550000, category: "مرنه", stock: 7 },
];

// تابع برای افزودن محصولات به دیتابیس
const seedProducts = async () => {
    try {
        await Product.deleteMany(); // حذف همه محصولات قبلی
        const insertedProducts = await Product.insertMany(sampleProducts);
        console.log(`✅ ${insertedProducts.length} محصول جدید اضافه شد.`);
        mongoose.connection.close(); // بستن اتصال به دیتابیس
    } catch (error) {
        console.error("❌ خطا در اضافه کردن محصولات:", error);
    }
};

// اجرای تابع
seedProducts();
