// const User = require("../../models/user")
const Components = require("../constants/components")
const ObjectId = require("mongodb").ObjectId
const Cart = require("../../models/cart")
    // const randomString = require("randomstring")

module.exports = async(req, res, next) => {
    try {
        function guid() {
            return s4() + s4() + s4() + s4() + s4() + s4();
        }

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        let sessionId = guid()
        if (!req.signedCookies.sessionId) {
            res.cookie("sessionId", sessionId, { signed: true })
        }
        // let cart = new Components.cart(req.session.cart ? req.session.cart : {})
        // req.session.cart = cart
        // res.locals.session = req.session

        let order = new Components.order(req.session.order ? req.session.order : {})
        req.session.order = order
        res.locals.session = req.session

        // Get number items of current cart
        const USER = req.user
        const CART = await Cart.detail(USER ? USER._id : req.signedCookies.sessionId)
        if (typeof CART !== 'undefined') {
            req.session.numItems = CART.items.length
        }

        next();
    } catch (error) {
        console.log(error)
    }
}