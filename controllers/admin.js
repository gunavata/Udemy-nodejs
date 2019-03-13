const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    console.log('Add Product page!');
    res.render("admin/edit-product", {
        pageTitle: "Add Product!",
        path: "/admin/add-product",
        editing: false
    });
}

exports.postAddProduct = (req, res, next) => {
    console.log('Added product page!');
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    Product
        .create({
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description
        })
        .then(result => {
            // console.log(result)
            console.log('Created Product')
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getEditProduct = (req, res, next) => {
    console.log('Edit Product page!');
    const editMode = req.query.edit;
    if (!editMode) {
        console.log(editMode + " exited out due to editmode not on")
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if (!product) {
            console.log(product + " exited out due to no product by that ID")
            return res.redirect('/');
        }
        res.render("admin/edit-product", {
            pageTitle: "Edit Product!",
            path: "/admin/edit-product",
            editing: editMode,
            product: product
        });
    });
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedPrice, updatedDesc);
    updatedProduct.save();
    res.redirect('/admin/products');
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

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products')
}