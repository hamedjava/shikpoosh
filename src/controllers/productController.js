const Product = require('../entities/product');

// ایجاد محصول جدید
exports.createProduct = async (req, res) => {
    try {
        const { name, price, category, description } = req.body;
        const newProduct = new Product({ name, price, category, description });
        await newProduct.save();
        res.status(201).json({ message: "✅ محصول اضافه شد", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "❌ خطای سرور", error });
    }
};

// دریافت همه محصولات
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "❌ خطای سرور", error });
    }
};

// دریافت محصول بر اساس ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "❌ محصول یافت نشد" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "❌ خطای سرور", error });
    }
};

// بروزرسانی محصول
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: "❌ محصول یافت نشد" });
        res.status(200).json({ message: "✅ محصول بروزرسانی شد", product });
    } catch (error) {
        res.status(500).json({ message: "❌ خطای سرور", error });
    }
};

// حذف محصول
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "❌ محصول یافت نشد" });
        res.status(200).json({ message: "✅ محصول حذف شد" });
    } catch (error) {
        res.status(500).json({ message: "❌ خطای سرور", error });
    }
};
