const express = require('express');
const { isValidObjectId } = require('mongoose');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const Follow = require('../models/Follow.model');
const Post = require('../models/Post.model');
const PostLike = require('../models/PostLike.model');
const User = require('../models/User.model');
const Comment = require('../models/Comment.model');

router.post('/follow/:userId', isLoggedIn, async (req, res, next) => {
    try {
        const follower = req.session.currentUser;
        if (isValidObjectId(req.params.userId)) {
            const followedUser = await User.findById(req.params.userId);
            if (followedUser) {
                await Follow.findOneAndUpdate({follower, followedUser}, {follower, followedUser}, {upsert: true});
                return res.status(201).json({message: `You are now following this user.`});
            }
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
        if (isValidObjectId(req.params.userId)) {
            const followedUser = await User.findById(req.params.userId);
            if (followedUser) {
                await Follow.findOneAndDelete({follower, followedUser});
                return res.status(201).json({message: `You are no longer following this user`});
            }
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
        if (isValidObjectId(req.params.postId)) {
            const post = await Post.findById(req.params.postId);
            if (post) {
                await PostLike.findOneAndUpdate({post, user}, {post, user}, {upsert: true});
                return res.status(201).json({message: `You are now liking this post`});
            }
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
        if (isValidObjectId(req.params.postId)) {
            const post = await Post.findById(req.params.postId);
            if (post) {
                await PostLike.findOneAndDelete({user, post});
                return res.status(201).json({message: `You are no longer liking this post`});
            }
        }
        // post not found, display error
        res.status(404).json({errorMessage: `Specified post not found!`});
    } catch (error) {
        next(error);
    }
});

router.get('/comments/:postId', async (req, res, next) => {
    try {
        const id = req.params.postId;
        if (isValidObjectId(id)) {
            const comments = await Comment.find({post: id}, 'author content createdAt').populate('author', 'username');
            return res.status(201).json({comments});
        }

        res.status(404).json({errorMessage: `Specified post not found!`});
    } catch (error) {
        next(error);
    }
});

router.post('/comments/:postId', isLoggedIn, async (req, res, next) => {
    try {
        console.log('body in comment post', req.body)
        const id = req.params.postId;
        if (isValidObjectId(id)) {
            const {content} = req.body;
            if (!content.length) {
                return res.status(400).json({errorMessage: 'Unable to create a comment with an empty body!'})
            }
            const author = req.session.currentUser;

            const comment = await (await Comment.create({author, content, post: id})).populate('author', 'username');

            return res.status(201).json({comment});
        }

        res.status(404).json({errorMessage: `Specified post not found!`});
    } catch (error) {
        next(error);
    }
});

module.exports = router