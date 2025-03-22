const db = require('../frameworks/database/mongo'); // اتصال به دیتابیس
const Product = require('../entities/product');

class ProductRepository {
    async getAll() {
        return await Product.find({}); // تمام محصولات رو از دیتابیس بگیر
    }
}

module.exports = ProductRepository; // دقت کن که کلاس رو صادر کردی
