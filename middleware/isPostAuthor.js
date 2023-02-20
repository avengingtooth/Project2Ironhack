const { isValidObjectId } = require("mongoose");
const Post = require("../models/Post.model");

/**
 * MiddleWare that guards a route that includes a postID from access by anyone but
 * the author of that post
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
async function isPostAuthor(req, res, next) {
    try {
        const id = req.params.postId
        if (isValidObjectId(id)) {
            console.log('id', id)
            const post = await Post.findById(id).populate('tags').populate('author');
            res.locals.post = post;
            console.log('Post', post)
            console.log('author', post.author, '\ncurrent user', req.session.currentUser);
            if (post.author._id.equals(req.session.currentUser._id)) {
                res.locals.post = post;
                console.log("hurray")
                return next();
            }

        }
        res.status(403);
        throw Error('Forbidden');
    } catch (error) {
        next(error);
    }
}

module.exports = isPostAuthor;