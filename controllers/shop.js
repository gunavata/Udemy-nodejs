const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
    console.log('Index page!');
    Product.fetchAll()
        .then(products => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop!",
                path: "/",
            });
        })
        .catch(err => {
            console.log(err)
        });
}

exports.getProducts = (req, res, next) => {
    console.log('Product page!');
    Product.fetchAll()
        .then(products => {
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "All Products!",
                path: "/products",
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
                path: '/products'
            })
        })
        .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
    console.log('Cart page!');
    req.user
        .getCart()
        .then(products => {
            res.render("shop/cart", {
                pageTitle: "Your Cart!",
                path: "/cart",
                products: products
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
            req.user.addToCart(product);
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
    .deleteItemFromCart(prodId)
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
        .addOrder()
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
    console.log('Orders page!');
    req.user
        .getOrders()
        .then(orders => {
            res.render("shop/orders", {
                pageTitle: "Your Orders!",
                path: "/orders",
                orders: orders
            });
        })
        .catch(err => console.log(err))
}