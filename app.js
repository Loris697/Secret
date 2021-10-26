//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
//const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/secretDB");
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

//userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:[ "password" ]});
const User = mongoose.model('User', userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.route("/register")

  .get(function(req, res) {
    res.render("register");
  })

  .post(function(req, res) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        newUser = new User({
        username: req.body.username,
        password: hash
      });

      newUser.save(function(err){
        if (err) console.log(err);
        else res.render("secrets");
      });
    });
    /*const newUser = new User({
      username: req.body.username,
      password: md5(req.body.password)
    });

    newUser.save(function(err){
      if (err) console.log(err);
      else res.render("secrets");
    });*/
  });

app.route("/login")

  .get(function(req, res) {
    res.render("login");
  })

  .post(function(req, res) {
    User.findOne({username: req.body.username}, function(err, userFound){
      if (err) console.log(err);
      //else if (userFound.password === md5(req.body.password)) res.render("secrets");
      //else res.render("login");
      else{
        bcrypt.compare(req.body.password, userFound.password, function(err, result){
          if (err) console.log(err)
          else if (result) res.render("secrets");
          else res.render("login");
        });
      }
    });
  });

app.get("/logout", function(req, res){
  res.redirect("/");
});



app.listen(3000, function() {
  console.log("Listening at port 3000.");
});
