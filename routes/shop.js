const path = require('path');
const express = require('express');

const rootDir = require('../util/path.js')
const adminData = require("./admin")

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('Main page!');
    console.log('shop.js', adminData.products);
    res.render("shop");
});

module.exports = router;