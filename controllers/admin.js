const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    console.log('Product page!');
    res.render("admin/add-product", {
        pageTitle: "Add Product!",
        path: "/admin/add-product",
    });
}

exports.postAddProduct = (req, res, next) => {
    console.log('Added product page!');
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, imageUrl, price, description);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    console.log('Admin Product page!');
    Product.fetchAll(products => {
        res.render("admin/products", {
            prods: products,
            pageTitle: "Admin Products!",
            path: "/admin/products",
        });
    });
}