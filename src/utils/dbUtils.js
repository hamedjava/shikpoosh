const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; // آدرس اتصال به MongoDB
const dbName = "online_shop"; // نام دیتابیس
const collectionName = "products"; // نام کالکشن محصولات

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
        return products; // برگرداندن محصولات مرتب‌شده
    } catch (err) {
        console.error("❌ Error:", err);
        throw err;
    } finally {
        await client.close();
    }
}

async function getProductsSortedByCategory() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(dbName);
        const productsCollection = db.collection(collectionName);

        const products = await productsCollection
            .find()
            .collation({ locale: "fa" }) // مرتب‌سازی بر اساس زبان فارسی
            .sort({ category: 1 })
            .toArray();

        console.log(products);
        return products; // برگرداندن محصولات مرتب‌شده بر اساس دسته‌بندی
    } catch (error) {
        console.error("❌ Error:", error);
        throw error;
    } finally {
        await client.close();
    }
}

module.exports = { getSortedProductsByPrice, getProductsSortedByCategory };
