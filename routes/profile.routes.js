const express = require('express');
const { isValidObjectId } = require('mongoose');
const router = express.Router();
const Post = require('../models/Post.model')
const likesAndFollows = require('../utils/fetchLikesAndFollows')


// Cloudinary for profile picture upload
const {fileUploader, cloudinary} = require('../config/cloudinary.config');

const isLoggedIn = require('../middleware/isLoggedIn');
const User = require('../models/User.model');

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    res.locals.jsScripts.push('preview');
    res.render("profile/myProfile", {user:req.session.currentUser});
    
  } catch (error) {
    next(error);
  }
});

router.post('/', isLoggedIn, fileUploader.single('image-url'), async (req, res, next) => {
  try {
    // get form data, update profile, return to profile
    const {username, email, firstName, lastName, password, passwordConfirmation} = req.body;

    const updatedUser = {};

    if (username.length && username !== req.session.currentUser.username) updatedUser.username = username;
    if (email.length && email !== req.session.currentUser.email) updatedUser.email = email;
    if (firstName.length && firstName !== req.session.currentUser.firstName) updatedUser.firstName = firstName;
    if (lastName.length && lastName !== req.session.currentUser.lastName) updatedUser.lastName = lastName;

    // check for errors with the entered data
    const errorMessages = [];
    if (password !== passwordConfirmation) {
      errorMessages.push("Password and Password confirmation don't match!");
    }

    if (!errorMessages.length && updatedUser.username) {
      const userWithSameUsername = await User.findOne({username});
      if (userWithSameUsername) {
        errorMessages.push('Username must be unique!')
      }
    }

    if (!errorMessages.length && updatedUser.email) {
        const userWithSameEmail = await User.findOne({email});
        if (userWithSameEmail) {
          errorMessages.push('Email must be unique!')
        }
    }
    
    if (errorMessages.length) return res.render('profile/myProfile', {errorMessages, user:updatedUser});

    if (req.file) {
      const transformed = cloudinary.url(req.file.filename, {width: 200, crop: "limit"});
      updatedUser.profilePictureURL = transformed;
      
    } else {
      console.log('no file uploaded')
    }

    if (password.length) {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedUser.password = hashedPassword;
    }
    
    const user = await User.findByIdAndUpdate(req.session.currentUser._id, updatedUser, {new: true});
    req.session.currentUser = user.toObject();
    delete req.session.currentUser.password;

    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
});

router.get("/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.userId;
    if (!isValidObjectId(id)) throw Error(`${id} is not a valid user id!`);

    const user = await User.findById(id)
    let curUserPosts = await Post.find({author: id}, {password: 0}).populate('author tags')
    let [follows, likes] = await likesAndFollows(user)

    res.render("profile/userProfile", {queryResults: [{user: user, post: curUserPosts, follows: follows, likes: likes, currentUser: req.session.currentUser}]});

  } catch (error) {
    next(error);
  }
})

module.exports = router