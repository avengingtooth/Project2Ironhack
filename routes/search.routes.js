const express = require('express');
const Post = require('../models/Post.model');
const router = express.Router();

router.use('/', async(req, res, next) => {
    const searchValue = req.query.search
    console.log(searchValue)
    const queryResults = await Post.find({title: searchValue})
    console.log(queryResults)
    console.log(queryResults, "hiii")
    res.render('search/results')
})

module.exports = router