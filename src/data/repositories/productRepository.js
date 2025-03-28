const mongo = require("../../frameworks/database/mongo");
const Product = require('../../domain/entities/product');

class ProductRepository {
    async getAll() {
        return await Product.find({}); // تمام محصولات رو از دیتابیس بگیر
    }
    static async find(filters) {
        return await Product.find(filters);
    }
}

module.exports = ProductRepository; // دقت کن که کلاس رو صادر کردی
