const express = require('express');
const router = express.Router();

router.get("/myProfile", (req, res, next) => {
  res.render("profile/myProfile");
});


router.get("/:userId", (req, res, next) => {
    res.render("profile/userProfile");
})

module.exports = router