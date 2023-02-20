const express = require('express');
const router = express.Router();

router.get('/all', (req, res, next) => {
    res.render('post/feed')
})

router.get('/:id', (req, res, next) => {
    res.render('post/post')
})

router.post('/creation', (req, res, next) => {
    res.render('post/create')
})

router.get('/following', (req, res, next) => {
    res.render('post/following')
})

router.get('/liked', (req, res, next) => {
    res.render('post/liked')
})

router.get('/:id/edit', (req, res, next) => {
    res.render('post/edit')
})

router.post('/:id/edit', (req, res, next) => {
    res.render('post/updateEdit')
})

module.exports = router