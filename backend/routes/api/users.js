const express = require("express");
const router = express.Router;
const bcrypt = require("bcrypt.js");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const User = require("../../models/User");

router.POST("/register", (req, res) => {
  const {errors, isValid} = validateRegisterInput(req.body);
  const {name, email, password} = req.body;

  if(!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists"});
    } else {
      const newUser = new User({
        name,
        email,
        password
      });
      
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json.user)
            .catch(err => console.log(err));
        });
      });

    }
  });
});

