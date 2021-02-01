var express = require('express');
var router = express.Router();
const Cart = require('../models/cart');
const Item = require('../models/items');
const Order = require('../models/order');
const mongoose = require('mongoose');
let category = ["", "Student","Professor","Public", "Staff", "Alumni","Membership"]

/* GET users listing. */
router.get('/', function(req, res, next) {
    Cart.aggregate([{
        $match: {
            user_id: mongoose.Types.ObjectId(req.user._id),
            is_deleted: false,
            quantity: { $gt: 0 }
        },
      }, {
        $lookup: {
            from: "items", // collection name in db
            localField: "item_id",
            foreignField: "_id",
            as: "itemObj"
        }
    },{$unwind: '$itemObj'}]).exec(function(err, cart) {
        let totalSum = 0;
        cart.forEach(function(cartItem){
            totalSum += cartItem.quantity * cartItem.itemObj.price.value;
          });
        res.render('manage_cart', { user: req.user, category: category, cart: cart, totalSum: totalSum.toFixed(2)});
    });
  });

router.post('/', function(req, res) {
    Item.findOne({_id: req.body._id}, function(err,obj) { 
        Cart.findOneAndUpdate({user_id: req.user._id, item_id:req.body._id, is_deleted:false},
            {$set: {user_id: req.user._id, title: obj.title,bookgenre: obj.bookgenre,author: obj.author, item_id:req.body._id, is_deleted: false},
           $inc : {quantity:req.body.quantity}}, {upsert: true, new: true }, function(err, data){ 
            if(err) return console.log(err);
            res.render('details', { user: req.user, item: obj, category: category, cart: data});
        });
     })
});

router.get('/update', function(req, res, next) {
    Cart.aggregate([{
        $match: {
            user_id: mongoose.Types.ObjectId(req.user._id),
            is_deleted: false,
            quantity: { $gt: 0 }
        },
      }, {
        $lookup: {
            from: "items", // collection name in db
            localField: "item_id",
            foreignField: "_id",
            as: "itemObj"
        }
    },{$unwind: '$itemObj'}]).exec(function(err, cart) {
        let totalSum = 0;
        cart.forEach(function(cartItem){
            totalSum += cartItem.quantity * cartItem.itemObj.price.value;
          });
        res.render('manage_cart', { user: req.user, category: category, cart: cart, totalSum: totalSum.toFixed(2)});
    });
  });

router.post('/update', function(req, res) {
    Item.findOne({_id: req.body._id}, function(err,obj) { 
        Cart.findOneAndUpdate({user_id: req.user._id, item_id:req.body._id, is_deleted:false},
            {$set: {user_id: req.user._id,title: obj.title,bookgenre: obj.bookgenre,author: obj.author, item_id:req.body._id, is_deleted: false},
            $inc : {quantity:req.body.quantity}}, {upsert: true, new: true }, function(err, data){ 
            if(err) return console.log(err);
        });
    });
    Cart.aggregate([{
        $match: {
            user_id: mongoose.Types.ObjectId(req.user._id),
            is_deleted: false,
            quantity: { $gt: 0 }
        },
      }, {
        $lookup: {
            from: "items", // collection name in db
            localField: "item_id",
            foreignField: "_id",
            as: "itemObj"
        }
    },{$unwind: '$itemObj'}]).exec(function(err, cart) {
        let totalSum = 0;
        cart.forEach(function(cartItem){
            totalSum += cartItem.quantity * cartItem.itemObj.price.value;
          });
        
        res.render('manage_cart', { user: req.user, category: category, cart: cart, totalSum: totalSum.toFixed(2)});
    });
});

router.post('/checkout', function(req, res) {
    Cart.find({
        user_id: mongoose.Types.ObjectId(req.user._id),
        is_deleted: false,
        quantity: { $gt: 0 }
    },function(err, data){
        let cartArray = [];
        let titleArray = [];
        let genreArray = [];
        let authorArray =[];
        let card;
        data.forEach(function(cartItem){
			console.log(cartItem.item_id);
            cartArray.push(cartItem.item_id);
            titleArray.push(cartItem.title);
            genreArray.push(cartItem.bookgenre);
            authorArray.push(cartItem.author);
        })
        let order = new Order(
            {
                user_id: req.user._id,
                cart_list: cartArray,
                title_list: titleArray,
                genre_list:genreArray,
                author_list:authorArray,
                total_price: req.body.total_price,
                card: req.body.card,
                currency: "usd"
            }
        );
        order.save(function (err) {
              if (err) {
                console.log(card);
                console.log('Could not create')
              }
              Cart.update({user_id: req.user._id}, {"$set":{"is_deleted": true}}, {"multi": true}, (err, writeResult) => {
                res.render('checkout_complete', { user: req.user,card:req.body.card,total_price:req.body.total_price, category: category});
            });
          })
        });
    })
module.exports = router;