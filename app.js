const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error.js');
const User = require('./models/user');

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5c8cc05c754413567cdd93ee')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
    .connect('mongodb+srv://pahtfinder:Q0GiMNn9yRBiZHiJ@thebowwowers-bl6ui.gcp.mongodb.net/shop?retryWrites=true')
    .then(result => {
        User
            .findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Banglore',
                        email: 'banglore@mozambique.here',
                        cart: {
                            items: []
                        }
                    })
                }
                user.save();
            })
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    })