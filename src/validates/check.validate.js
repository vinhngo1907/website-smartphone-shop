module.exports.postSignUp = (req, res, next) => {
    let msg = {}
    const { email, name, username, password, sdt, addr, re_pass } = req.body
    if (!email || !name || !username || !password || !sdt || !addr || !re_pass) {
        msg.message = "All fields is required"
    } else {
        // var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // if (!re.test(String(email).toLowerCase())) {
        //     msg.email = "Email address is not valid!"
        // }

        if (password.length < 6) {
            msg.pass = "Password must be more than 6 characters!"
        }
        // var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        // if (vnf_regex.test(String(sdt)) == false) {
        //     msg.sdt = "Phone Number is not valid!"
        // }

        if (re_pass !== password) {
            msg.re_pass = "Password does not match!"
        }
    }

    if (Object.keys(msg).length > 0) {
        res.render("users/signUp", {
            msg,
            values: req.body
        })
        return
    }
    next()
}
module.exports.requireAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next()
    } else {
        res.redirect("/user/info")
    }
}
module.exports.postSignIn = (req, res, next) => {
    let msg = {}
    const { email, password } = req.body
    if (!email || !password) {
        msg.email = "Email or/and password can not be blank!"
    }

    // if (!password) {
    //     msg.pass = "Password is required!"
    // }
    if (Object.keys(msg).length > 0) {
        res.render("users/signIn", {
            msg,
            values: req.body
        })
        return
    }
    next()
}