const express = require('express');
const router = express.Router();
const Tag = require("../models/Tag.model.js")
const Post = require('../models/Post.model');
const isPostAuthor = require('../middleware/isPostAuthor.js');
const isLoggedIn = require('../middleware/isLoggedIn.js');

router.get('/all', async(req, res, next) => {
    let curVisiblePosts = await Post.find()
    console.log(curVisiblePosts)
    res.render('post/feed', {curVisiblePosts})
})

router.get('/creation', isLoggedIn, (req, res, next) => {
    res.render('post/create');
})

router.post('/creation', isLoggedIn, async(req, res, next) => {
    try{
        let {title, content, tag} = req.body
        console.log(typeof tag)
        if (typeof tag == 'string'){
            tag = [tag]
        }
        let newTags = []
        for(let i = 0; i < tag.length; i++){
            let curTag = tag[i]
            if(curTag.length > 0){
                try{
                    newTags.push(await Tag.create({name: curTag}))
                }
                catch{
                }
            }
        }

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

router.get('/:postId/edit', isLoggedIn, isPostAuthor, (req, res, next) => {
    
    res.render('post/edit')
})

router.post('/:postId/edit', (req, res, next) => {
    res.render('post/updateEdit')
})

// router.get('/:id', (req, res, next) => {
//     res.render('post/post')
// })

module.exports = router