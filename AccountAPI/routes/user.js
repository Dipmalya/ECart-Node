const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uniqid = require("uniqid");

const salt = bcrypt.genSaltSync(10);
const User = require("../model/user.model");

const formUserId = name => {
  let nameInitials = name.match(/\b\w/g) || [];
  nameInitials = (
    (nameInitials.shift() || "") + (nameInitials.pop() || "")
  ).toUpperCase();
  return `${nameInitials}-${uniqid.time()}`;
};

router.get("/getUsers", (req, res, next) => {
  User.find({})
    .exec()
    .then(users => res.status(200).json(users));
});

router.get("/getUsersById/:userId", (req, res, next) => {
  const userId = req.params.userId;
  User.findOne({ userId })
    .select("-password")
    .exec()
    .then(user => res.status(200).json(user));
});

router.get("/getUsersByLOB/:lob", (req, res, next) => {
  const LOB = req.params.lob;
  User.find({ LOB })
    .select("-password")
    .exec()
    .then(user => res.status(200).json(user));
});

router.post("/login", (req, res, next) => {
  const {
    email = "",
    password = "",
    LOB = ""
  } = req.body;
  User.findOne({ email, LOB }, { __v: 0 })
    .exec()
    .then(user => {
      if (bcrypt.compareSync(password, user.password)) {
        const userDoc = user._doc;
        delete userDoc.password;
        res.status(200).json({ ...userDoc, success: true });
      } else {
        res.status(201).json({
          message: "Username or Password is invalid",
          errorCode: "Error103",
          success: false
        });
      }
    })
    .catch(() =>
      res.status(500).json({
        message: "Username or Password is invalid",
        errorCode: "Error103",
        success: false
      })
    );
});

router.post("/register", (req, res, next) => {
  const {
    name = "",
    email = "",
    password = "",
    mobile = "",
    company = "",
    LOB = ""
  } = req.body;

  User.countDocuments({
    $or: [{ email }, { mobile }]
  })
    .exec()
    .then(result => {
      if (result == 0) {
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          userId: formUserId(name),
          name,
          email,
          password: bcrypt.hashSync(password, salt),
          mobile,
          company,
          LOB
        });
        newUser
          .save()
          .then(() => {
            res.status(200).json({
              message: "User registered successfully",
              success: true
            });
          })
          .catch(() => {
            res.status(500).json({
              message: "Failed to register user",
              errorCode: "Error1002",
              success: false
            });
          });
      } else {
        res.status(201).json({
          message: "User already exists",
          errorCode: "Error1001",
          success: false
        });
      }
    });
});

router.post("/changePassword", (req, res, next) => {
  const {
    userId = "",
    password = "",
    newPassword = "",
    LOB = ""
  } = req.body;
  User.findOne({ userId, LOB }, { __v: 0 })
    .exec()
    .then(user => {
      if (bcrypt.compareSync(password, user.password) && password !== newPassword) {
        const userDoc = user._doc;
        userDoc.password = bcrypt.hashSync(newPassword, salt);
        User.findOneAndUpdate({ userId }, userDoc)
          .exec()
          .then(() => {
            res.status(200).json({
              message: "Password Changed successfully",
              success: true
            });
          })
          .catch(() =>
            res.status(500).json({
              message: "Password cannot be changed",
              errorCode: "Error105",
              success: false
            })
          );
      } else {
        res.status(201).json({
          message: "Username or Password is invalid",
          errorCode: "Error103",
          success: false
        });
      }
    })
    .catch(() =>
      res.status(500).json({
        message: "Username or Password is invalid",
        errorCode: "Error103",
        success: false
      })
    );
})

router.post("/forgotPassword", (req, res, next) => {
  const { email, mobile, LOB } = req.body;
  User.countDocuments({ email, mobile, LOB })
    .exec()
    .then(result => {
      if (result === 1) {
        res.status(200).json({
          message: "User can change password",
          success: true
        });
      } else {
        res.status(200).json({
          message: "User cannot change password",
          errorCode: "Error106",
          success: true
        });
      }
    })
    .catch(() =>
      res.status(500).json({
        message: "User cannot change password",
        errorCode: "Error106",
        success: false
      })
    );
})

module.exports = router;