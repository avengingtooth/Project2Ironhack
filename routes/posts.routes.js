const express = require('express');
const router = express.Router();
const Tag = require("../models/Tag.model.js")
const Post = require('../models/Post.model');
const isPostAuthor = require('../middleware/isPostAuthor.js');
const isLoggedIn = require('../middleware/isLoggedIn.js');
const setupTags = require('../utils/setupTags.js');
const Follow = require('../models/Follow.model.js');
const PostLike = require('../models/PostLike.model.js');

router.get('/all', async(req, res, next) => {
    try{
        let curVisiblePosts = await Post.find().sort('-createdAt').populate('author tags');

        // create arrays of all users the user follows, and of all posts the user liked
        let follows = [];
        let likes = [];
        if (req.session.currentUser) {
            follows = await Follow.find({follower: req.session.currentUser});
            likes = await PostLike.find({user: req.session.currentUser});
            likes = likes.map(elem => elem.post);
            follows = follows.map(elem => elem.followedUser);
        }
        res.render('post/feed', {curVisiblePosts, follows, likes})
    }
    catch(error){
        console.log(error)
        next(error)
    }
})

router.get('/creation', isLoggedIn, (req, res, next) => {
    res.locals.jsScripts.push('createTagInput');
    res.render('post/create');
})

router.post('/creation', isLoggedIn, async(req, res, next) => {
    try{
        let {title, content, tag} = req.body;
        const tags = await setupTags(tag);

        const errorMessages = [];
        if (!title.length) errorMessages.push('Please enter a title for your post!');
        if (!content.length) errorMessages.push('Please enter a body for your post!');

        if (errorMessages.length) {
            res.locals.jsScripts.push('createTagInput');
            return res.render('post/create', {post: {title, content, tags}, errorMessages})
        }

        await Post.create({
            author: req.session.currentUser._id,
            title,
            content,
            tags
        })
    
        res.redirect('/')
    }

    catch(error){
        next(error)
    }
})
 
router.get('/following', isLoggedIn, async (req, res, next) => {
    try {
        // create arrays of all users the user follows, and of all posts the user liked
        let follows = [];
        let likes = [];

        follows = await Follow.find({follower: req.session.currentUser});
        likes = await PostLike.find({user: req.session.currentUser});
        likes = likes.map(elem => elem.post);
        follows = follows.map(elem => elem.followedUser);

        let curVisiblePosts = await Post.find({
            'author': {$in: follows}
        }).sort('-createdAt').populate('author tags')

        res.render('post/feed', {curVisiblePosts, follows, likes})
    }
    catch(error){
        console.log(error)
        next(error)
    }
})

router.get('/liked', async (req, res, next) => {
    try {
        // create arrays of all users the user follows, and of all posts the user liked
        let follows = [];
        let likes = [];

        follows = await Follow.find({follower: req.session.currentUser});
        likes = await PostLike.find({user: req.session.currentUser});
        likes = likes.map(elem => elem.post);
        follows = follows.map(elem => elem.followedUser);

        let curVisiblePosts = await Post.find({
            '_id': {$in: likes}
        }).sort('-createdAt').populate('author tags')
        
        res.render('post/feed', {curVisiblePosts, follows, likes})
    }
    catch(error){
        console.log(error)
        next(error)
    }
})

router.get('/:postId/edit', isLoggedIn, isPostAuthor, async(req, res, next) => {
    console.log(req.params.postId)
    // NOTE: use of isPostAuthor middleware will set the post in locals, don't need another find
    // const curPost = await Post.findById(req.params.postId).populate('author tags')
    try {
        const curPost = await res.locals.post.populate('author tags');
        res.locals.jsScripts.push('createTagInput');
        res.render('post/edit', curPost)    
    } catch (error) {
        next(error)
    }
    
})

router.post('/:postId/edit', isLoggedIn, isPostAuthor, async(req, res, next) => {
    console.log('trying to edit, provided values:', req.body)
    try {
        let {title, content, tag} = req.body;
        const tags = await setupTags(tag);

        const updatedPost = {tags}
        if (title.length) updatedPost.title = title;
        if (content.length) updatedPost.content = content;

        await Post.findByIdAndUpdate(req.params.postId, updatedPost)
        res.redirect(`/posts/${req.params.postId}`)
    } catch (error) {
        next(error);
    }
})

router.post('/:postId/delete', isLoggedIn, isPostAuthor, async(req, res, next) => {
    // await Post.deleteOne({_id: req.params.postId})
    try {
        await res.locals.post.delete();
        res.redirect(`/posts/all`)
    } catch (error) {
        next(error);
    }
})

router.get('/:postId', async(req, res, next) => {
    const curPost = await Post.findById(req.params.postId).populate('author tags')

    // NOTE: this functionality has been used to hbs helper function
    // const correctUser = curPost.author._id.equals(req.session.currentUser._id)

    // create arrays of all users the user follows, and of all posts the user liked
    let follows = [];
    let likes = [];
    if (req.session.currentUser) {
        follows = await Follow.find({follower: req.session.currentUser});
        likes = await PostLike.find({user: req.session.currentUser});
        likes = likes.map(elem => elem.post);
        follows = follows.map(elem => elem.followedUser);
    }

    res.locals.jsScripts.push('delete');
    res.render('post/onePost', {curPost, follows, likes})
})

module.exports = router