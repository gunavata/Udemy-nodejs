const path = require('path');
const express = require('express');

const rootDir = require('../util/path.js')

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
    console.log('Product page!');
    res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
    console.log('Added product page!');
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;