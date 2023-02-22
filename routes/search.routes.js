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
    const queryResults = await User.find({
        username: {
            $regex: searchValue,
            $options: 'i'
        },
    })

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
    console.log(queryResults)
    // fetches likes and follows in order to pass it when rendering post
    let [follows, likes] = await likesAndFollows(req)

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
    let [follows, likes] = await likesAndFollows(req)

    if(queryResults.length > 0){
        res.render('search/postResults', {searchValue, queryResults, follows, likes})
    }
    else{
        res.render('search/noResult', {searchValue})
    }
})

module.exports = router