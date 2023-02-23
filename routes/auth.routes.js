const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// Cloudinary for profile picture upload
const {fileUploader, cloudinary} = require('../config/cloudinary.config');

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /auth/signup
router.get("/signup", isLoggedOut, (req, res) => {
  res.locals.jsScripts.push('preview');
  res.render("auth/signup");
});

// POST /auth/signup
router.post("/signup", isLoggedOut, fileUploader.single('image-url'),(req, res) => {
  const {username, email, firstName, lastName, password, passwordConfirmation} = req.body;

  const newUser = {profilePictureURL: ''};
  const errorMessages = [];

  if (username.length) newUser.username = username;
  else errorMessages.push('Please enter a username');

  if (email.length) newUser.email = email;
  else errorMessages.push('Please enter an email address');

  if (firstName.length) newUser.firstName = firstName;
  else errorMessages.push('Please enter your first name');

  if (lastName.length) newUser.lastName = lastName;
  else errorMessages.push('Please enter your last name');

  if (!password.length) errorMessages.push('Please enter your password')
  else if (password !== passwordConfirmation) errorMessages.push('Please make sure that both password entries are identical.')

  if (req.file) {
    const transformed = cloudinary.url(req.file.filename, {width: 200, crop: "limit"});
    newUser.profilePictureURL = transformed;
  } else {
    console.log('no file chosen')
  }
  

  if (errorMessages.length) {
    res.locals.jsScripts.push('preview');
    res.status(400).render("auth/signup", {
      errorMessages,
    });

    return;
  }

  //   ! This regular expression checks password for special characters and minimum length
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(400)
      .render("auth/signup", {
        errorMessage: "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter."
    });
    return;
  }
  */

  // Create a new user - start by hashing the password
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // Create a user and save it in the database
      newUser.password = hashedPassword;
      return User.create(newUser);
    })
    .then((user) => {
      res.redirect("/auth/login");
    })
    .catch((error) => {
      res.locals.jsScripts.push('preview');
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        console.log(error);
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Provide a valid username or email.",
        });
      } else {
        next(error);
      }
    });
});

// GET /auth/login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

// POST /auth/login
router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;

  // Check that username, email, and password are provided
  if (email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide both email and password.",
    });

    return;
  }


  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
        return;
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("auth/login", { errorMessage: "Wrong credentials." });
            return;
          }

          // Add the user object to the session object
          req.session.currentUser = user.toObject();
          // Remove the password field
          delete req.session.currentUser.password;

          res.redirect("/");
        })
        .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
    })
    .catch((err) => next(err));
});

// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    }

    res.redirect("/");
  });
});

module.exports = router;