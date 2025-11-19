const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const passport = require("passport");
const { SaveRedirectUrl } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

// SIGNUP
router
  .route("/signup")
  .get(UserController.renderSignupForm)
  .post(wrapAsync(UserController.signup));

// LOGIN
router
  .route("/login")
  .get(UserController.renderLoginForm)
  .post(
    SaveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    UserController.login
  );

// LOGOUT
router.get("/logout", UserController.logout);

module.exports = router;
