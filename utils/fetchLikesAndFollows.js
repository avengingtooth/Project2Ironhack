const Follow = require('../models/Follow.model')
const PostLike = require('../models/PostLike.model')

const likesAndFollows = async(req) => {
    let follows = [];
    let likes = [];

    if (req.session.currentUser) {
        follows = await Follow.find({follower: req.session.currentUser});
        likes = await PostLike.find({user: req.session.currentUser});
        likes = likes.map(elem => elem.post);
        follows = follows.map(elem => elem.followedUser);
    }

    return [follows, likes]
}

module.exports = likesAndFollows