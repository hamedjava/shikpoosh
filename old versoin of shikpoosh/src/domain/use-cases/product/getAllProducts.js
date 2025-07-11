class GetAllProducts {
    constructor(productRepository) {
        this.productRepository = productRepository; // وابستگی از بیرون میاد ✅
    }

    async execute() {
        return await this.productRepository.getAll();
    }
}

module.exports = GetAllProducts; // شیء صادر نمی‌کنیم، کلاس رو صادر می‌کنیم ✅