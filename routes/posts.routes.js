const express = require('express');
const router = express.Router();
const Tag = require("../models/Tag.model.js")
const Post = require('../models/Post.model');
const isPostAuthor = require('../middleware/isPostAuthor.js');
const isLoggedIn = require('../middleware/isLoggedIn.js');
const postData = require('../public/js/postData.js');

router.get('/all', async(req, res, next) => {
    try{
        let curVisiblePosts = await Post.find()
        console.log(curVisiblePosts[curVisiblePosts.length - 1].tags[0])
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
    const curPost = await Post.findById(req.params.postId)
    res.render('post/edit', curPost)
})

router.post('/:postId/edit', isLoggedIn, isPostAuthor, async(req, res, next) => {
    await Post.updateOne({_id: req.params.postId}, await postData(req.body))
    res.redirect(`/posts/${req.params.postId}`)
})

router.get('/:postId/delete', isLoggedIn, isPostAuthor, async(req, res, next) => {
    await Post.deleteOne({_id: req.params.postId})
    console.log(Post)
    res.redirect(`/posts/all`)
})

router.get('/:id', async(req, res, next) => {
    const curPost = await Post.findById(req.params.id)
    res.render('post/onePost', curPost)
})

module.exports = router