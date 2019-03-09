const path = require('path');
const express = require('express');

const rootDir = require('../util/path.js')
const adminData = require("./admin")

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('Main page!');
    const products= adminData.products;
    res.render("shop", {
        prods: products,
        pageTitle: "Shop!",
        path: "/",
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
});

module.exports = router;