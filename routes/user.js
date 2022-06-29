const express = require("express")

// const passport = require("passport")
const multer = require('multer')
const router = express.Router()
const controller = require("../controllers/user")
const validate = require("../src/validates/check.validate")

// const validate = require("../validates/auth.validate")
// const APP_CONSTANT = require("../src/constants/appConstants")
// const middleWare = require("../src/middlewares/auth.middleware")
const upload = multer({ dest: './src/public/uploads/' });

router.get("/account", controller.account)
router.get("/sign-up", validate.requireAuth, controller.signUp)
router.get("/sign-in", validate.requireAuth, controller.signIn)
router.get("/info", controller.info)
router.get('/edit', controller.edit);
router.get("/forgot-password", controller.getForgotPass);
router.get("/change-password", controller.getChangePass);
router.get("/verify-email", controller.getVerifyEmail);
router.get("/log-out", controller.getLogout)

// router.post("/contact", controller.postContact)

router.post('/edit', upload.single('avatar'), controller.postEdit);
router.post("/sign-up", validate.postSignUp, controller.postSignUp)
router.post("/sign-in", validate.postSignIn, controller.postSignIn)

// router.post('/sign-in', validate.postSignIn, passport.authenticate('local', {
//     successRedirect: '/products',
//     failureRedirect: '/user/sign-in'
// }));

router.post("/forgot-password", controller.postForgotPass);
router.post("/change-password", controller.postChangePass);
router.get("/verify-email", controller.postVerifyEmail);
module.exports = router;