const express = require('express');
const Post = require('../models/Post.model')
const likesAndFollows = require('../utils/fetchLikesAndFollows.js')
const User = require('../models/User.model')
const Tag = require('../models/Tag.model')
const router = express.Router();

router.use('/users', async(req, res, next) => {
    const searchValue = req.query.search
    console.log(searchValue)
    const queryResults = await User.find({
        username: {
            $regex: searchValue,
            $options: 'i'
        },
    })
    console.log(queryResults)

    if(queryResults.length > 0){
        res.render('search/userResults', {searchValue, queryResults})
    }
    else{
        res.render('search/noResult', {searchValue})
    }
})

router.use('/post', async(req, res, next) => {
    const searchValue = req.query.search
    const queryResults = await Post.find({
        title: {
            $regex: searchValue,
            $options: 'i'
        },
    }).populate('author tags')
    console.log(queryResults)
    let [follows, likes] = await likesAndFollows(req)

    if(queryResults.length > 0){
        res.render('search/postResults', {searchValue, queryResults, follows, likes})
    }
    else{
        res.render('search/noResult', {searchValue})
    }
})

router.use('/tag', async(req, res, next) => {
    const searchValue = req.query.search
    const tagId = await Tag.find({
        name: {
            $regex: searchValue,
            $options: 'i'
        }
    })
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