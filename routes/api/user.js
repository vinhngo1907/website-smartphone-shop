const express = require("express")
const router = express.Router()
const users = require("../../controllers/api/user")
const Coupon = require("../../models/coupon")
const Cart = require('../../models/cart')
const Product = require("../../models/product")

router.get("/check", users.check)

// router.get("/verify", users.verify)

router.get("/phone", users.phone)

// router.get("/coupon", async(req, res, next) => {
//     try {
//         const code = req.query.code
//             // console.log('Code...', code)
//         const codeExist = await Coupon.check(code)
//             // console.log("Coupon checked ", codeExist)
//         if (codeExist) {
//             var codeValid = await Coupon.detail(code)
//         }

//         res.json({ codeExist, codeValid, message: '' })
//     } catch (error) {
//         console.log(error)
//         next(error)
//     }
// })

router.post("/coupon", async(req, res, next) => {
    try {
        const code = req.body.code
        const USER = req.user
        const sessionID = req.signedCookies.sessionId

        // console.log('Code...', code)
        const codeExist = await Coupon.check(code)
            // console.log("Coupon checked ", codeExist)
        if (codeExist) {
            var codeValid = await Coupon.detail(code)
            let currentDate = new Date()
            let total = 0
            codeValid.expiration = new Date(codeValid.expiration)
            const cart = await Cart.list(USER ? USER._id : sessionID)

            for (let item of cart.items) {
                const PRODUCT = await Product.get(item.idProduct)
                PRODUCT.qty = item.qty
                PRODUCT.new_price = Cart.newPrice(PRODUCT.price, PRODUCT.sale_off)
                total += PRODUCT.new_price * PRODUCT.qty
            }
            if (codeValid.expiration < currentDate) {
                // $('#message').html('Coupon was expired.');
                return res.json({ codeExist, success: false, message: 'Coupon was expired.' })
            }

            if (codeValid.payment > total || codeValid.used >= codeValid.limit) {
                // $('#message').html('Coupon or/and invoice not enough condition.');
                return res.json({ codeExist, success: false, message: 'Coupon or/and invoice not enough condition.' })

            }
            const result = await Cart.reUpdateCart(USER ? USER._id : sessionID, cart.items, code)
            res.json({ codeExist, codeValid, result, success: true, message: '' })
        } else {
            return res.json({ codeExist, message: 'Coupon not found' })
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// router.get("/voucher", async(req, res, next) => {
//     try {
//         const code = req.query.code
//             // console.log('Code...', code)
//         const codeValid = await Coupon.detail(code)
//             // console.log("Voucher detail ", codeValid)
//         res.json(codeValid)
//     } catch (error) {
//         console.log(error)
//         next(error)
//     }
// })

// router.get('/apply', async(req, res) => {
//     // const { code } = req.body
//     const coupon = req.query.code
//     try {
//         const USER = req.user
//         const sessionID = req.signedCookies.sessionId
//         const cart = await Cart.list(USER ? USER._id : sessionID)
//         const result = await Cart.reUpdateCart(USER ? USER._id : sessionID, cart.items, coupon)
//         res.json(result)
//     } catch (error) {
//         console.log(error)
//     }
// })

router.post('/contact', users.contact)

module.exports = router