function exposeUsertoView(req, res, next){
    if(req.session.currentUser){
        res.locals.currentUser = req.session.currentUser;
    }
    next();
};

module.exports = exposeUsertoView;