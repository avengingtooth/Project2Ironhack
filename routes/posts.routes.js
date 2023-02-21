const express = require('express');
const router = express.Router();
const Tag = require("../models/Tag.model.js")
const Post = require('../models/Post.model');
const isPostAuthor = require('../middleware/isPostAuthor.js');
const isLoggedIn = require('../middleware/isLoggedIn.js');
const postData = require('../public/js/postData.js');

router.get('/all', async(req, res, next) => {
    try{
        let curVisiblePosts = await Post.find().populate('author tags')
        console.log(curVisiblePosts[curVisiblePosts.length - 1])
        res.render('post/feed', {curVisiblePosts})
    }
    catch(error){
        console.log(error)
        res.render('post/feed')
    }
})

router.get('/creation', isLoggedIn, (req, res, next) => {
    res.render('post/create');
})

router.post('/creation', isLoggedIn, async(req, res, next) => {
    try{
        let {title, content, newTags} = await postData(req.body)
        await Post.create({
            author: req.session.currentUser._id,
            title: title,
            content: content,
            tags: newTags
        })
    
        res.redirect('/')
    }
    catch(error){
        console.log(error)
    }
})
 
router.get('/following', (req, res, next) => {
    res.render('post/following')
})

router.get('/liked', (req, res, next) => {
    res.render('post/liked')
})

router.get('/:postId/edit', isLoggedIn, isPostAuthor, async(req, res, next) => {
    console.log(req.params.postId)
    const curPost = await Post.findById(req.params.postId).populate('author tags')
    res.render('post/edit', curPost)
})

router.post('/:postId/edit', isLoggedIn, isPostAuthor, async(req, res, next) => {
    const values = await postData(req.body)
    console.log(values.tags,req.body)
    await Post.updateOne({_id: req.params.postId}, {tags: values.tags})
    res.redirect(`/posts/${req.params.postId}`)
})

router.get('/:postId/delete', isLoggedIn, isPostAuthor, async(req, res, next) => {
    await Post.deleteOne({_id: req.params.postId})
    res.redirect(`/posts/all`)
})

router.get('/:id', async(req, res, next) => {
    const curPost = await Post.findById(req.params.id).populate('author tags')
    const correctUser = curPost.author._id.equals(req.session.currentUser._id);
    res.render('post/onePost', {curPost, correctUser})
})

module.exports = router