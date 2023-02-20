const express = require('express');
const router = express.Router();

router.post('/follow/:userId', (req, res, next) => {
    res.render('api/follow')
})

router.delete('/follow/:userId', (req, res, next) => {
    res.render('api/unfollow')
})

router.post('/like/:postId', (req, res, next) => {
    res.render('api/like')
})

router.delete('/like/:postId', (req, res, next) => {
    res.render('api/unlike')
})

module.exports = router