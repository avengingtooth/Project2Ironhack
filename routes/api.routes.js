const express = require('express');
const { isValidObjectId } = require('mongoose');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const Follow = require('../models/Follow.model');
const Post = require('../models/Post.model');
const PostLike = require('../models/PostLike.model');
const User = require('../models/User.model');
const Comment = require('../models/Comment.model');


/**
 * API route that will set the current user as follower of the user identified via the id in the url.
 * 
 * If the current user is already following that user, nothing will happen (user will still be following,
 * and no error is returned)
 * 
 * returns status 201 if the user was found and is now being followed
 * returns status 404 if no user was found under the given id (including if the id was not a valid object id)
 */
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

/**
 * API route that will remove the current user as follower from the user identified via the id in the url.
 * 
 * If the current user is already not following that user, nothing will happen (user will still not be following, 
 * and no error is returned)
 * 
 * returns status 204 if the user was found and is now not being followed
 * returns status 404 if no user was found under the given id (including if the id was not a valid object id)
 */
router.delete('/follow/:userId', isLoggedIn, async (req, res, next) => {
    try {
        const follower = req.session.currentUser;
        if (isValidObjectId(req.params.userId)) {
            const followedUser = await User.findById(req.params.userId);
            if (followedUser) {
                await Follow.findOneAndDelete({follower, followedUser});
                return res.sendStatus(204);
            }
        } 
        // user not found, display error
        res.status(404).json({errorMessage: `Specified user not found!`});
    } catch (error) {
        next(error);
    }
})

/**
 * API route that will set the current user to like the post identified via the id in the url.
 * 
 * If the current user is already liking that post, nothing will happen (user will still be liking the post,
 * and no error is returned)
 * 
 * returns status 201 if the post was found and is now liked
 * returns status 404 if no post was found under the given id (including if the id was not a valid object id)
 */
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

/**
 * API route that will remove the like of current user from the post identified via the id in the url.
 * 
 * If the current user is already not not liking that post, nothing will happen (user will still not be 
 * liking the post, and no error is returned)
 * 
 * returns status 204 if the post was found and is now not liked
 * returns status 404 if no post was found under the given id (including if the id was not a valid object id)
 */
router.delete('/like/:postId', async (req, res, next) => {
    try {
        const user = req.session.currentUser;
        if (isValidObjectId(req.params.postId)) {
            const post = await Post.findById(req.params.postId);
            if (post) {
                await PostLike.findOneAndDelete({user, post});
                return res.sendStatus(204);
            }
        }
        // post not found, display error
        res.status(404).json({errorMessage: `Specified post not found!`});
    } catch (error) {
        next(error);
    }
});

/**
 * route that will fetch all comments belonging to the post identified via the id in the url and
 * returns them to the frontend
 * 
 * returns status 201 if the comment was created, together with an array of all the comments found for that post
 * returns status 404 if no post was found under the given id (including if the id was not a valid object id)
 */
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

/**
 * route that will create a comment sent by the front end via AJAX, on the post identified
 * via the id in the url
 * 
 * returns status 201 if the comment was created
 * returns status 404 if no post was found under the given id (including if the id was not a valid object id)
 */
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