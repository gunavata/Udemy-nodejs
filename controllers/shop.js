const Product = require("../models/product");
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    console.log('Index page!');
    Product.fetchAll()
        .then(([rows]) => {
            res.render("shop/index", {
                prods: rows,
                pageTitle: "Shop!",
                path: "/",
            });
        })
        .catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
    console.log('Product page!');
    Product.fetchAll()
        .then(([rows]) => {
            res.render("shop/product-list", {
                prods: rows,
                pageTitle: "All Products!",
                path: "/products",
            });
        })
        .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
    console.log('Single Product page!');
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(([product]) => {
            res.render('shop/product-detail', {
                product: product[0],
                pageTitle: product.title,
                path: '/products'
            })
        })
        .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
    console.log('Cart page!');
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }
            res.render("shop/cart", {
                pageTitle: "Your Cart!",
                path: "/cart",
                products: cartProducts
            })
        })
    });
}

exports.postCart = (req, res, next) => {
    console.log('Post cart page!');
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    })
    res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next) => {
    console.log('Post delete cart page')
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price)
        res.redirect('/cart');
    })
}

exports.getOrders = (req, res, next) => {
    console.log('Orders page!');
    res.render("shop/orders", {
        pageTitle: "Your Orders!",
        path: "/orders",
    });
}

exports.getCheckout = (req, res, next) => {
    console.log('Checkout page!');
    res.render("shop/checkout", {
        pageTitle: "Checkout!",
        path: "/checkout",
    });
}