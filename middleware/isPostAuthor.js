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
            const post = await Post.findById(id);
            console.log(post.author, id);
            next();
            if (post.author.equals(id)) {
                res.locals.post = post;
                next();
            }

        }

        res.status(403);
        throw Error('Forbidden')
    } catch (error) {
        next(error);
    }
}

module.exports = isPostAuthor;