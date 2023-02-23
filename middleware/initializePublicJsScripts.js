function initializePublicJsScripts(req, res, next) {
    res.locals.jsScripts = [];
    next();
}

module.exports = initializePublicJsScripts;