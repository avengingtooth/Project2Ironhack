const express = require('express');
const Post = require('../models/Post.model')
const Follow = require('../models/Follow.model')
const PostLike = require('../models/PostLike.model')
const router = express.Router();

router.use('/', async(req, res, next) => {
    const searchValue = req.query.search
    const queryResults = await Post.find({title: searchValue}).populate('author tags')
    let follows = [];
    let likes = [];

    if (req.session.currentUser) {
        follows = await Follow.find({follower: req.session.currentUser});
        likes = await PostLike.find({user: req.session.currentUser});
        likes = likes.map(elem => elem.post);
        follows = follows.map(elem => elem.followedUser);
    }

    res.render('search/results', {queryResults, follows, likes})
})

module.exports = router