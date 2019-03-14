const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error.js');
const sequelize = require('./util/database.js');
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
    User.findById(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

sequelize
    .sync({force: true})
    .then(result => {
        return User.findById(1)
        // console.log(result)
    })
    .then(user => {
        if (!user) {
            return User.create({name: 'Max', email: 'test@test.com'})
        }
        return Promise.resolve(user);
    })
    .then(user => {
        // console.log(user);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    })