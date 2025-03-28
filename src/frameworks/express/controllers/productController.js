const Product = require("../../../domain/entities/product");
// ایجاد محصول
const createProduct = async (req, res) => {
    try {
        const { name, price, category } = req.body;
        const newProduct = new Product({ name, price, category });
        await newProduct.save();
        
        res.status(201).json({
            success: true,
            message: "محصول با موفقیت ایجاد شد",
            data: newProduct,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "خطای سرور", error });
    }
};

// دریافت همه محصولات
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "خطای سرور", error });
    }
};

// دریافت محصول بر اساس شناسه
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "محصول یافت نشد" });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "خطای سرور", error });
    }
};

// بروزرسانی محصول
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ success: false, message: "محصول یافت نشد" });
        }

        res.status(200).json({
            success: true,
            message: "محصول با موفقیت بروزرسانی شد",
            data: product,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "خطای سرور", error });
    }
};

// حذف محصول
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "محصول یافت نشد" });
        }

        res.status(200).json({
            success: true,
            message: "محصول با موفقیت حذف شد",
            data: product,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "خطای سرور", error });
    }
};

// جستجوی محصولات

const searchProducts = async (req, res) => {
    try {
        const { name, category } = req.query;
        let query = {};

        if (name) {
            query.name = { $regex: name, $options: "i" }; // جستجو با regex برای تطابق جزئی
        }
        if (category) {
            query.category = { $regex: category, $options: "i" };
        }

        const products = await Product.find(query);
        res.json({ success: true, products });
    } catch (error) {
        console.error("❌ خطا در جستجوی محصولات:", error);
        res.status(500).json({ success: false, message: "خطای سرور", error });
    }
};



// دریافت محصولات مرتب‌شده بر اساس قیمت
const getSortedProductsByPrice = async (req, res) => {
    try {
        const { order } = req.query;
        const sortOrder = order === "desc" ? -1 : 1;
        const products = await Product.find().sort({ price: sortOrder });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "خطای سرور", error });
    }
};

// مرتب‌سازی صعودی بر اساس قیمت
const getSortedProductsByPriceAsc = async (req, res) => {
    try {
        const products = await Product.find().sort({ price: 1 }); // 1 برای صعودی
        res.json({ success: true, products });
    } catch (error) {
        console.error("❌ خطا در مرتب‌سازی صعودی محصولات:", error);
        res.status(500).json({ success: false, message: "خطای سرور", error });
    }
};

// مرتب‌سازی نزولی بر اساس قیمت
const getSortedProductsByPriceDesc = async (req, res) => {
    try {
        const products = await Product.find().sort({ price: -1 }); // -1 برای نزولی
        res.json({ success: true, products });
    } catch (error) {
        console.error("❌ خطا در مرتب‌سازی نزولی محصولات:", error);
        res.status(500).json({ success: false, message: "خطای سرور", error });
    }
};



// دریافت محصولات بر اساس جدیدترین تاریخ ایجاد
const getNewestProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "خطای سرور", error });
    }
};

// دریافت محصولات مرتب‌شده بر اساس دسته‌بندی
const getProductsSortedByCategory = async (req, res) => {
    try {
        const products = await Product.find().sort({ category: 1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "خطای سرور", error });
    }
};




// const getSortedProductsByPriceAsc = async (req, res) => {
//     req.query.order = "asc";
//     return getSortedProductsByPrice(req, res);
// };

// const getSortedProductsByPriceDesc = async (req, res) => {
//     req.query.order = "desc";
//     return getSortedProductsByPrice(req, res);
// };



module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
    getSortedProductsByPrice,
    getSortedProductsByPriceAsc, // مرتب‌سازی صعودی
    getSortedProductsByPriceDesc, // مرتب‌سازی نزولی
    getNewestProducts,
    getProductsSortedByCategory,
};
