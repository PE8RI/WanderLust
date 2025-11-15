module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.RedirectUrl = req.originalUrl;
    req.flash("error", "You are not logged in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.SaveRedirectUrl = (req, res, next) => {
  if (req.session.RedirectUrl) {
    res.locals.RedirectUrl = req.session.RedirectUrl;
  }
  next();
};
