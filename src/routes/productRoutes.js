const express = require('express');
const productController = require('../controllers/ProductController'); // این رو اضافه کردیم
const product = require('../entities/product'); // مسیر رو چک کن

const router = express.Router();

router.get('/products', productController.getAllProducts);

module.exports = router;
