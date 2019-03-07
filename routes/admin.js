const path = require('path');
const express = require('express');

const rootDir = require('../util/path.js')

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
    console.log('Product page!');
    res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
    console.log('Added product page!');
    products.push( {title: req.body.title});
    res.redirect('/');
});

exports.routes = router;
exports.products = products;