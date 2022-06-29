const User = require("../../models/user")

module.exports.check = async(req, res, next) => {

    if (req.query.email !== '') {
        const userExist = await User.check(req.query.email)
        console.log("Email checked", userExist)
        if (userExist) {
            return res.json({ success: false, message: 'User already exist. Please try again.' })
        }
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(req.query.email).toLowerCase())) {
            // msg.email = "Email address is not valid!"
            return res.json({ success: false, message: 'Email address is not valid!' })
        }
        return res.json({ success: true, message: '' })
    }
}

module.exports.verify = async(req, res, next) => {
    try {
        const accountExist = await User.verifyUser(req.query.email)
        console.log("Account verified ", accountExist)
        res.json(accountExist)
    } catch (error) {
        next(error)
    }
}

module.exports.phone = async(req, res, next) => {
    if (req.query.sdt !== '') {
        const phoneExist = await User.phone(req.query.sdt)
        console.log("Phone checked ", phoneExist)
        if (phoneExist) {
            return res.json({ success: false, message: 'Phone already taken. Please try again.' })
        }
        var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        if (vnf_regex.test(String(req.query.sdt)) == false) {
            return res.json({ success: false, message: 'Phone Number is not valid!' })
        }
        return res.json({ success: true, message: '' })
    }
}

module.exports.contact = async(req, res) => {
    let send = req.body.inputSend
    console.log(send)
    if (!send) {
        return res.json({ success: false, message: 'This field is required' })
    }
    if (req.user) {
        // return res.render("contact", { title: "Contact", numItems: req.session.numItems, message: 'You are logged, please use your email logged' })
        return res.json({ success: false, message: 'You are logged, please use your email logged' })
    }
    try {
        const user = await User.get(send)
        const feedBack = await User.getContact(send)

        if (feedBack || user) {
            return res.json({ success: false, message: 'Your email already exist' })
        }
        let contact = {
            email: send,
            createdAt: new Date()
        }
        await User.contact(contact)
            // return res.redirect("/contact")
        return res.json({
            success: true,
            message: 'Your email has been sent successfully !'
        })
    } catch (error) {
        console.log(error)
    }
}