const Product = require("../models/product");
const Order = require('../models/order')

exports.getIndex = (req, res, next) => {
    console.log('Index page!');
    Product.find()
        .then(products => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop!",
                path: "/",
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err)
        });
}

exports.getProducts = (req, res, next) => {
    console.log('Product page!');
    Product.find()
        .then(products => {
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "All Products!",
                path: "/products",
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err)
        });
}

exports.getProduct = (req, res, next) => {
    console.log('Single Product page!');
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products',
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
    console.log('Cart page!');
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render("shop/cart", {
                pageTitle: "Your Cart!",
                path: "/cart",
                products: products,
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
    console.log('Post cart page!');
    const prodId = req.body.productId;
    Product
        .findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
    console.log('Post delete cart page')
    const prodId = req.body.productId;
    req.user
        .removeFromCart(prodId)
        .then(() => {
            console.log("Destoryed Product!")
            res.redirect('/cart')
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postOrder = (req, res, next) => {
    console.log('Post Order Page!')
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } }
            })
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products
            })
            return order.save();
        })
        .then(result => {
            req.user.clearCart();
            return res.redirect('/orders');
        })
        .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
    console.log('Orders page!');
    Order.find({ "user.userId": req.user._id })
        .then(orders => {
            res.render("shop/orders", {
                pageTitle: "Your Orders!",
                path: "/orders",
                orders: orders,
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => console.log(err))
}