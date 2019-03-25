const Product = require("../models/product");
const {
    validationResult
} = require('express-validator/check')
const fileHelper = require('../util/file');

exports.getAddProduct = (req, res, next) => {
    console.log('Add Product page!');
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    res.render("admin/edit-product", {
        pageTitle: "Add Product!",
        path: "/admin/add-product",
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
}

exports.postAddProduct = (req, res, next) => {
    console.log('Added product page!');
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    if (!image) {
        return res.status(422).render("admin/edit-product", {
            pageTitle: "Add Product!",
            path: "/admin/add-product",
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: 'Attached file is not an image',
            validationErrors: []
        });
    }
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render("admin/edit-product", {
            pageTitle: "Add Product!",
            path: "/admin/add-product",
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const imageUrl = image.path;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    })
    product
        .save()
        .then(result => {
            // console.log(result)
            console.log('Created Product')
            res.redirect("/admin/products")
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
            // return res.status(500).render("admin/edit-product", {
            //     pageTitle: "Add Product!",
            //     path: "/admin/add-product",
            //     editing: false,
            //     hasError: true,
            //     product: {
            //         title: title,
            //         imageUrl: imageUrl,
            //         price: price,
            //         description: description
            //     },
            //     errorMessage: 'Database operation failed, please try again',
            //     validationErrors: []
            // });
        })
}

exports.getEditProduct = (req, res, next) => {
    console.log('Edit Product page!');
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render("admin/edit-product", {
                pageTitle: "Edit Product!",
                path: "/admin/edit-product",
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            });
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const image = req.file;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("admin/edit-product", {
            pageTitle: "Edit Product!",
            path: "/admin/edit-product",
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                price: updatedPrice,
                description: updatedDesc,
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    Product.findById(prodId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/')
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            if (image) {
                fileHelper.deleteFile(product.imageUrl)
                product.imageUrl = image.path;
            }
            return product.save()
                .then(result => {
                    console.log('Updated Product!')
                    res.redirect('/admin/products');
                })
        })

        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getProducts = (req, res, next) => {
    console.log('Admin Product page!');
    Product.find({
            userId: req.user._id
        })
        .then(products => {
            console.log(products)
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Products!",
                path: "/admin/products",
            });
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    console.log('Post Delete product page!')
    Product.findById(prodId)
        .then(product => {
            console.log(product)
            if (!product) {
                return next(new Error('Product not found!'))
            }
            fileHelper.deleteFile(product.imageUrl)
            return Product.deleteOne({ _id: prodId, userId: req.user._id})
        })
        .then(() => {
            console.log("Destoryed Product!")
            res.status(200).json({message: 'Success!'});
        })
        .catch(err => {
            res.status(500).json({message: 'Failed to delete product!'})
            // const error = new Error(err)
            // error.httpStatusCode = 500;
            // return next(error);
        })

}