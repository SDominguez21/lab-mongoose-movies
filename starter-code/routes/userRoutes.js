const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require('passport');
const ensureLogin = require("connect-ensure-login");

router.get("/signup", (req, res, next) => {
  console.log("I'm inside get /signup");
  res.render("user-views/signup");
});

router.post("/signup", (req, res, next) => {
  const thePassword = req.body.thePassword;
  const theUsername = req.body.theUsername;

  const salt = bcrypt.genSaltSync(3);
  const hashedPassWord = bcrypt.hashSync(thePassword, salt);
  console.log("I'm right outsie the create user");

  User.create({
    username: theUsername,
    password: hashedPassWord
  })
    .then(() => {
      console.log("yay");
      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});

router.get("/login", (req, res, next) => {
    // MANUAL WAY
//   if (req.session.errorCount <= 0) {
//     req.session.errorMessage = null;
//   }
//   req.session.errorCount -= 1;

//   res.render("user-views/login", { error: req.session.errorMessage });
// });

// router.post("/login", (req, res, next) => {
//   const password = req.body.thePassword;
//   const username = req.body.theUsername;

//   User.findOne({ username: username })
//     .then(user => {
//       if (!user) {
//         req.session.errorMessage = "sorry, no one with that username found";
//         req.session.errorCount = 1;
//         res.redirect("/login");
//       }
//       if (bcrypt.compareSync(password, user.password)) {
//         req.session.currentUser = user;
//         res.redirect("/");
//       } else {
//         req.session.errorMessage = "wrong password";
//         req.session.errorCount = 1;
//         res.redirect("/login");
//       }
//     })
//     .catch(error => {
//       next(error);
//     });
// });

res.render('user-views/login')
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true,
    passReqToCallback: true
  }));

  router.post('/logout', (req, res, next)=>{
    req.logout();
    res.redirect("/login");
  })

router.get("/profile", (req, res, next) => {
    // MANUAL WAY
//   if (req.session.currentUser) {
//     res.render("user-views/profile", { user: req.session.currentUser });
//   } else {
//     req.session.errorCount = 1;
//     req.session.errorMessage =
//       "Sorry, you must be logged in to use that feature please log in";
//     res.redirect("/login");
//   }

res.render('/profile');
});

router.post("/logout", (req, res, next) => {
//   req.session.destroy();
  req.logout();
  res.redirect("/");
});

module.exports = router;