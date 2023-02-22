 /**
  * Middleware that checks whether the current request was sent by a user that is logged into the app or not.
  * Only lets requests through that come from users that are NOT logged in.
  * @param {Request} req 
  * @param {Response} res 
  * @param {NextFunction} next 
  * @returns 
  */
function isLoggedOut (req, res, next) {
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
  if (req.session.currentUser) {
    return res.redirect("/");
  }
  next();
};

module.exports = isLoggedOut;