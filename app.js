const express = require('express');

const app = express();

app.use('/', (req, res, next) => {
    console.log("Always runs!");
    next();
})

app.use('/add-product', (req, res, next) => {
    console.log('Product page!');
    res.send("<form action='/product' method='post'><input type='text' name ='title'><button type='submit'>Add product!</button></form>");
});

app.use('/product', (req, res, next) => {
    console.log('Added product page!');
    console.log(req.body);
    res.redirect('/');
});

app.use('/', (req, res, next) => {
    console.log('Main page!');
    res.send("<h1>Hello from Express!</h1>");
});

app.listen(3000);