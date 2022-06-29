const passport = require("passport")
const User = require("../models/user")
const bcrypt = require("bcrypt")
const SALT_ROUNDS = 10;
const path = require("path")
const nodemailer = require('nodemailer');
var randomstring = require("randomstring");
module.exports.account = (req, res) => {
    res.render("users/info")
}

module.exports.info = (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/user/sign-in')
        } else { res.render("users/info", { title: "info", user: req.user }) }
    } catch (error) {
        console.log(error)
    }
}

module.exports.postInfo = (req, res) => {

}
module.exports.signIn = (req, res) => {
    // if (req.user) {
    //     return res.redirect("/user/info")
    // }
    // var id = req.user ? req.user._id : req.signedCookies.sessionId
    // var cart = await Cart.detail(id)
    const message = req.flash("error")[0];
    res.render("users/signIn", { message: `${message}`, title: "sign-in" })
}

module.exports.signUp = (req, res) => {
    // if (req.user) {
    //     return res.redirect("/user/info")
    // }
    const message = req.flash("message")[0];
    res.render("users/signUp", { mess: message, title: "sign-up" })
}
module.exports.getLogout = (req, res) => {
    if (req.session.passport) {
        req.session.passport = null;
    }
    req.logout()
    return res.redirect("/")
}
module.exports.postSignUp = async(req, res) => {

    const { email, name, username, sdt, addr, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS)
    let createdAt = new Date()

    let accessToken = randomstring.generate({ length: 20 });
    let data = {
        email: email.trim(),
        name: name.trim(),
        username: username.trim(),
        phoneNumb: sdt.trim(),
        address: addr.trim(),
        password: hashedPassword,
        createdAt,
        updatedAt: createdAt,
        verify_token: accessToken.trim(),
        // isAuthenticated: false,
        isLocked: false,
        role: false
    }

    try {
        await User.add(data)
        req.flash("message", "User created successfully")
        res.redirect("back")
            // res.json({ success: true, message: 'User created successfully' })
    } catch (error) {
        console.log(error)
            // res.json({ success: false, message: 'Something wrong' })
    }
}

module.exports.postSignIn = async(req, res, next) => {
    try {
        passport.authenticate("local", {
            successReturnToOrRedirect: "/products",
            failureRedirect: '/user/sign-in',
            failureFlash: true
        })(req, res, next);

    } catch (error) {
        console.log(error)
    }
}

module.exports.edit = (req, res) => {
    if (req.user) {
        // console.log(req.user)
        res.render("users/edit", { user: req.user })
    } else {
        return res.redirect('/')
    }
}

module.exports.postEdit = async(req, res) => {
    const {
        email,
        name,
        username,
        phoneNumb,
        address,
    } = req.body

    let info = {
        email,
        name,
        username,
        phoneNumb,
        address,
        // avatar: avt,
        avatar: (typeof req.file !== 'undefined') ? req.file.path.split(path.sep).slice(2).join('/') : req.user.avatar,
        updatedAt: new Date()
    }

    try {
        await User.update(req.user._id, info);
        return res.redirect('info');
    } catch (error) {
        console.log(error)
    }
}

module.exports.getForgotPass = async(req, res) => {
    res.render("users/forgot-pass", {
        title: "forgot-password",
        // user: req.user,
    })
}

module.exports.postForgotPass = async(req, res) => {
    const mailHost = 'smtp.gmail.com'
    const mailPort = 587
    try {
        const email = req.body.email
        const user = await User.get(email)
        let msg = {}
        if (!user) {
            msg.email = "User does not exist"
            res.render("users/forgot-pass", { msg })
        } else {
            var tpass = randomstring.generate({
                length: 6
            });
            console.log("Mật khẩu mới của bạn là:", tpass)

            var transporter = nodemailer.createTransport({
                host: mailHost,
                port: mailPort,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            })

            var mainOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "Test",
                // text: "text ne" + tpass,
                html: "<p>Mật khẩu mới của bạn là:</p>" + tpass
            };
            transporter.sendMail(mainOptions, (err, info) => {
                if (err) {
                    console.log("Error: ", err);
                } else {
                    console.log("Sent:" + info.response);
                }
                transporter.close();
            });
            const hashedPassword = bcrypt.hashSync(tpass, SALT_ROUNDS)
            user.password = hashedPassword;

            await User.update(user._id, user);
            res.redirect("/user/sign-in");
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports.getChangePass = (req, res) => {
    res.render("users/change-pass", {
        user: req.user,
        title: "change-password"
    })
}

module.exports.postChangePass = async(req, res) => {
    let msg = {}
    var USER = req.user
    const { old_pass, password, re_pass } = req.body
    try {
        if (USER) {
            const result = bcrypt.compare(old_pass, password)
            console.log("alo?")
            if (!result) {
                msg.old_pass = "Old Password is wrong!"
            }
            if (password !== re_pass) {
                msg.pass = "Password does not match !"
            }
            if (Object.keys(msg).length > 0) {
                res.render("users/change-pass", { msg, values: req.body })
            }

            const hasedPassword = bcrypt.hashSync(password, SALT_ROUNDS)
            USER.password = hasedPassword
            await User.update(USER._id, USER)
        }
        return res.redirect("/user/sign-in")
    } catch (error) {
        console.log(error)
    }
}

module.exports.getVerifyEmail = async(req, res) => {
    res.render("users/very-email", { user: req.user, title: "verify-email" })
}

module.exports.postVerifyEmail = async(req, res) => {

}