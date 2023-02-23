/**
 * Middleware that adds the current user from the session to the locals,
 * to make it available in view templates
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
function exposeUsertoView(req, res, next){
    if(req.session.currentUser){
        res.locals.currentUser = req.session.currentUser;
    }
    next();
};

module.exports = exposeUsertoView;