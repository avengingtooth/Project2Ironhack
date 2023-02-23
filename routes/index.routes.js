const express = require('express');
const router = express.Router();

/**
 * Index page, redirects to our main page, the "all posts" feed
 */
router.get("/", (req, res, next) => {
  res.redirect("/posts/all");
});

module.exports = router;
