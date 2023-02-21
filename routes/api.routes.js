const express = require('express');
const { isValidObjectId } = require('mongoose');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const Follow = require('../models/Follow.model');
const PostLike = require('../models/PostLike.model');

router.post('/follow/:userId', isLoggedIn, async (req, res, next) => {
    try {
        const follower = req.session.currentUser;
        const followedUser = req.params.userId;
        if (isValidObjectId(followedUser)) {
            await Follow.findOneAndUpdate({follower, followedUser}, {follower, followedUser}, {upsert: true});
            return res.status(201).json({message: `You are now following this user.`});
        } 
        // user not found, display error
        res.status(404).json({errorMessage: `Specified user not found!`})
    } catch (error) {
        next(error);
    }
})

router.delete('/follow/:userId', isLoggedIn, async (req, res, next) => {
    try {
        const follower = req.session.currentUser;
        const followedUser = req.params.userId;
        if (isValidObjectId(followedUser)) {
            await Follow.findOneAndDelete({follower, followedUser});
            return res.status(201).json({message: `You are no longer following this user`});
        } 
        // user not found, display error
        res.status(404).json({errorMessage: `Specified user not found!`});
    } catch (error) {
        next(error);
    }
})

router.post('/like/:postId', async (req, res, next) => {
    try {
        const user = req.session.currentUser;
        const post = req.params.postId;
        if (isValidObjectId(post)) {
            await PostLike.findOneAndUpdate({post, user}, {post, user}, {upsert: true});
            return res.status(201).json({message: `You are now liking this post`});
        } 
        // user not found, display error
        res.status(404).json({errorMessage: `Specified post not found!`})
    } catch (error) {
        next(error);
    }
})

router.delete('/like/:postId', async (req, res, next) => {
    try {
        const user = req.session.currentUser;
        const post = req.params.postId;
        if (isValidObjectId(post)) {
            await PostLike.findOneAndDelete({user, post});
            return res.status(201).json({message: `You are no longer liking this post`});
        } 
        // user not found, display error
        res.status(404).json({errorMessage: `Specified post not found!`});
    } catch (error) {
        next(error);
    }
})

module.exports = router