const express = require('express');
const Post = require('../models/Post.model')
const likesAndFollows = require('../utils/fetchLikesAndFollows.js')
const User = require('../models/User.model')
const Tag = require('../models/Tag.model')
const router = express.Router();

// query regexp find any value of given field which contain the search value (case insensitive)

// searches for users
router.use('/users', async(req, res, next) => {
    const searchValue = req.query.search
    const users = await User.find(
        {
            username: {
                $regex: searchValue,
                $options: 'i'
            }
        },
        {
            password: 0
        }
    )
    let queryResults = []
    for (let i = 0; i < users.length; i++){
        let curUser = users[i]._id
        let curUserPosts = await Post.find({author: curUser._id}).populate('author tags')
        let [follows, likes] = await likesAndFollows(curUser)
        queryResults.push({user: users[i], post: curUserPosts, follows: follows, likes: likes})
        console.log(queryResults)
    }

    if(queryResults.length > 0){
        res.render('search/userResults', {searchValue, queryResults})
    }
    else{
        res.render('search/noResult', {searchValue})
    }
})

// searches for titles
router.use('/post', async(req, res, next) => {
    const searchValue = req.query.search
    const queryResults = await Post.find({
        title: {
            $regex: searchValue,
            $options: 'i'
        },
    }).populate('author tags')
    // fetches likes and follows in order to pass it when rendering post
    let [follows, likes] = await likesAndFollows(req.session.currentUser)

    if(queryResults.length > 0){
        res.render('search/postResults', {searchValue, queryResults, follows, likes})
    }
    else{
        res.render('search/noResult', {searchValue})
    }
})

// searches for tags
router.use('/tag', async(req, res, next) => {
    const searchValue = req.query.search
    // gets all the matching tags by their id
    const tagId = await Tag.find({
        name: {
            $regex: searchValue,
            $options: 'i'
        }
    })
    // gets all posts which use the tags
    const queryResults = await Post.find({tags: {$in: tagId}}).populate('author tags')
    let [follows, likes] = await likesAndFollows(req.session.currentUser)

    if(queryResults.length > 0){
        res.render('search/postResults', {searchValue, queryResults, follows, likes})
    }
    else{
        res.render('search/noResult', {searchValue})
    }
})

module.exports = router