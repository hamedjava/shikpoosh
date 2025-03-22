const db = require('../frameworks/database/mongo'); // اتصال به دیتابیس
const Product = require('../entities/product');

class ProductRepository {
    async getAll() {
        const products = await db.collection('products').find().toArray();
        return products.map(p => new Product(p._id, p.name, p.price, p.category));
    }
}

module.exports = new ProductRepository();
