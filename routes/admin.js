const express = require('express');
const {
    body
} = require('express-validator/check');

const adminController = require("../controllers/admin");
const isauth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add-product', isauth, adminController.getAddProduct);

router.get('/products', isauth, adminController.getProducts);

router.post('/add-product',
    [
        body('title')
        .isString()
        .isLength({
            min: 3
        })
        .trim(),
        body('price')
        .isFloat(),
        body('description')
        .isLength({
            min: 5,
            max: 400
        })
        .trim()
    ], isauth, adminController.postAddProduct);

router.get('/edit-product/:productId', isauth, adminController.getEditProduct);

router.post('/edit-product', [
    body('title')
    .isString()
    .isLength({
        min: 3
    })
    .trim(),
    body('price')
    .isFloat(),
    body('description')
    .isLength({
        min: 5,
        max: 400
    })
    .trim()
], isauth, adminController.postEditProduct);

router.post('/delete-product', isauth, adminController.postDeleteProduct);

module.exports = router;