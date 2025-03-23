const express = require('express');
const GetAllProducts = require("../../../domain/use-cases/getAllProducts");
const ProductRepository = require("../../../data/repositories/ProductRepository");

const Product = require('../../../domain/entities/product'); // مسیر رو چک کن

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

