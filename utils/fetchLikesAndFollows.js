const Follow = require('../models/Follow.model')
const PostLike = require('../models/PostLike.model')

const likesAndFollows = async(user) => {
    let follows = [];
    let likes = [];

    if (user) {
        follows = await Follow.find({follower: user});
        likes = await PostLike.find({user: user});
        likes = likes.map(elem => elem.post);
        follows = follows.map(elem => elem.followedUser);
    }

    return [follows, likes]
}

module.exports = likesAndFollows