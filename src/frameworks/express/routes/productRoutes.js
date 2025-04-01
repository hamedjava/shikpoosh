const express = require('express');

const ProductController = require('../../../frameworks/express/controllers/productController');

const router = express.Router();

// بررسی مقداردهی صحیح کنترلر
if (!ProductController || Object.keys(ProductController).length === 0) {
    console.error("❌ خطا: ProductController مقداردهی نشده است!");
} else {
    console.log("📌 ProductController Methods:", Object.keys(ProductController));
}

// روت‌ها
router.post('/', ProductController.createProduct);
router.get('/', ProductController.getAllProducts);
router.get("/search", ProductController.searchProducts);
router.get('/sorted-by-price-asc', ProductController.getSortedProductsByPriceAsc);
router.get('/sorted-by-price-desc', ProductController.getSortedProductsByPriceDesc);
router.get('/sorted-by-category', ProductController.getProductsSortedByCategory);
router.get('/:id', ProductController.getProductById);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);



module.exports = router;
