const express = require("express");
const router = express.Router()
const ObjectId = require("mongodb").ObjectId
const Cart = require("../../models/cart")
const Product = require('../../models/product')

router.get('/list', async(req, res, next) => {
    const USER = req.user
    const sessionID = req.signedCookies.sessionId
    try {
        const cart = await Cart.list(USER ? USER._id : sessionID)
        const viewCart = await Cart.showCart(cart, Product)
        res.json({ success: true, viewCart })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Internal server error' })
    }
})

router.get("/coupon", async(req, res) => {
    try {
        const USER = req.user
        const sessionID = req.signedCookies.sessionId
        const cart = await Cart.list(USER ? USER._id : sessionID)
            // let data = [];
            // let total = 0;
        if (cart.coupon === req.query.code) {
            await Cart.deleteCoupon(USER ? USER._id : sessionID, cart.items)
            res.json({ success: true, message: 'Removed coupon' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Internal server error' })
    }
})
router.post('/add', async(req, res) => {
    var idProduct = req.body.idProduct
    const USER = req.user
    const sessionId = req.signedCookies.sessionId
    try {
        var data = await Cart.add(USER ? USER._id : sessionId, idProduct)
        let cartList = await Cart.list(USER ? USER._id : sessionId)
        let numItems = cartList.items.length
        res.json({ data, success: true, message: 'Item added to cart successfully!', numItems })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Something wrong' })
    }
})


router.post('/minus', async(req, res) => {
    var idProduct = req.body.idProduct
    const USER = req.user
    const sessionId = req.signedCookies.sessionId
    try {
        var data = await Cart.minus(USER ? USER._id : sessionId, idProduct)
        res.json({ data, success: true, message: 'Item minus from cart successfully!' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Something wrong' })
    }
})

router.post("/delete", async(req, res) => {
    var idProduct = req.body.idProduct
    const USER = req.user
    const sessionId = req.signedCookies.sessionId
    let id = USER ? USER._id : sessionId
    var numItems = 0
    try {
        // const cart = await Cart.detail(id)
        // if (cart != undefined) {
        //     for (let item of cart.items) {
        //         if (item.idProduct === idProduct) {
        //             cart.items.splice(cart.items.indexOf(item), 1)
        //             break
        //         }
        //     }
        //     const userId = ObjectId(id)
        //     await Cart.updateCart(userId, cart)
        //     numItems = cart.items.length
        //     console.log(numItems)
        //     res.json({ success: true, message: 'Your Product Permanently Deleted.', numItems })

        // } else {
        //     numItems = 0
        //     return res.json({ success: false, message: 'Your cart not found please add new product', numItems })
        // }
        await Cart.delete(id, idProduct)
        let cartList = await Cart.list(id)
        let numItems = cartList.items.length
        res.json({
            success: true,
            message: 'Your Product Permanently Deleted!',
            numItems
        })

    } catch (error) {
        console.log(error)
        numItems = 0
        res.json({ success: false, message: 'Something wrong', numItems })
    }
})

module.exports = router