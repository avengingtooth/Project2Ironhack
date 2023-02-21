 /**
  * Middleware that checks whether the current request was sent by a user that is logged into the app or not.
  * Only lets requests through that come from users that ARE logged in.
  * @param {Request} req 
  * @param {Response} res 
  * @param {NextFunction} next 
  * @returns 
  */
 function isLoggedIn (req, res, next) {
  // checks if the user is logged in when trying to access a specific page
  if (!req.session.currentUser) {
    return res.redirect("/auth/login");
  }

  next();
};

module.exports = isLoggedIn;