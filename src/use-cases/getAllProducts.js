const ProductRepository = require('../repositories/ProductRepository');

class GetAllProducts {
    async execute() {
        return await ProductRepository.getAll();
    }
}

module.exports = new GetAllProducts();