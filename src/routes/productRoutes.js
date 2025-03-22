const express = require('express');
const ProductRepository = require('../repositories/ProductRepository');
const GetAllProducts = require('../use-cases/getAllProducts');
const Product = require('../entities/product'); // مسیر رو چک کن



const router = express.Router();

const getAllProductsUseCase = new GetAllProducts(new ProductRepository()); // وابستگی تزریق شد ✅

router.get('/products', async (req, res) => {
    try {
        const products = await getAllProductsUseCase.execute();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;

