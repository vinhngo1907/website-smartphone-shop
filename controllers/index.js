const Cart = require("../models/cart")
const Product = require("../models/product")
const User = require("../models/user")
const Components = require("../src/constants/components")
module.exports.index = async(req, res) => {
    try {
        const USER = req.user
        let cart = await Cart.detail(USER ? USER._id : req.signedCookies.sessionId)
        const products = await Product.list()
        return res.render("index", {
            user: req.user,
            numItems: (cart != undefined) ? cart.items.length : 0,
            products
        })
    } catch (error) {
        console.log(error)
    }

}

module.exports.about = async(req, res) => {
    try {
        const USER = req.user
        let cart = await Cart.detail(USER ? USER._id : req.signedCookies.sessionId)

        return res.render("about", {
            user: USER ? USER : '',
            title: "About",
            numItems: (cart != undefined) ? cart.items.length : 0
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports.contact = async(req, res) => {
    try {
        const USER = req.user
        let cart = await Cart.detail(USER ? USER._id : req.signedCookies.sessionId)
        return res.render("contact", {
            user: USER ? USER : '',
            title: "Contact",
            numItems: (cart != undefined) ? cart.items.length : 0
        })
    } catch (error) {
        console.log(error)
    }
}
module.exports.postContact = async(req, res) => {
    const { send, name, content } = req.body
    if (!send) {
        return res.render("contact", { title: "Contact", numItems: req.session.numItems, message: 'Email can not be blank' })
    }
    try {
        const USER = req.user
        if (!USER) {
            const user = await User.get(send)
                // const feedBack = await User.getContact(send)

            if (user) {
                return res.render("contact", { title: "Contact", numItems: req.session.numItems, message: 'You registed, please use your email logged' })
            }
            await User.contact({
                email: send,
                customer: name ? Components.titleCase(name) : '',
                content,
                createdAt: new Date()
            })
            return res.render('contact', {
                title: "Contact",
                numItems: req.session.numItems,
                msg: 'Your contact has been sent successfully !'
            })
        }
        var email = req.user ? req.user.email : send
        var customer = req.user ? req.user.name : name
        await User.contact({
            email: email,
            customer: customer ? Components.titleCase(customer) : '',
            content,
            createdAt: new Date()
        })
        return res.render('contact', {
            user: req.user,
            title: "Contact",
            numItems: req.session.numItems,
            msg: 'Your contact has been sent successfully !'
        })
    } catch (error) {
        console.log(error)
    }
}