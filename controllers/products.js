const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    console.log('Product page!');
    res.render("add-product", {
        pageTitle: "Add Product!",
        path: "/admin/add-product",
    });
}

exports.postAddProduct = (req, res, next) => {
    console.log('Added product page!');
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

exports.getProduct = (req, res, next) => {
    console.log('Main page!');
    Product.fetchAll(products => {
        res.render("shop", {
            prods: products,
            pageTitle: "Shop!",
            path: "/",
            hasProducts: products.length > 0,
        });
    });
}