const Cart = require("../models/cart")
const Product = require("../models/product")
const Order = require("../models/order")
const Components = require("../src/constants/components")
const Coupon = require('../models/coupon')

module.exports.list = async(req, res) => {
    const sessionID = req.signedCookies.sessionId
    const USER = req.user
    var message = req.flash('message')
    try {
        let id = USER ? USER._id : sessionID
        let data = []
        let total = 0;
        const cart = await Cart.list(id) // response Object
        if (typeof cart !== "undefined") {
            for (let item of cart.items) {
                const PRODUCT = await Product.get(item.idProduct)
                PRODUCT.qty = item.qty
                PRODUCT.newPrice = Cart.newPrice(PRODUCT.price, PRODUCT.sale_off)
                data.push(PRODUCT)
                total += PRODUCT.newPrice * PRODUCT.qty
            }
            if (cart.coupon) {
                let coupon = await Coupon.detail(cart.coupon)
                if (coupon.payment > total) {
                    await Cart.deleteCoupon(id, cart.items)
                }
            }
        }
        // let money = Components.formatMoney(total, 'en')
        res.render("carts/list", { data, user: req.user, total, numItems: req.session.numItems, message })
            // const viewCart = await Cart.showCart(cart, Product)
            // return res.render("carts/list", { data: viewCart.data, user: req.user, total: viewCart.total, numItems: req.session.numItems, message })
    } catch (error) {
        console.log(error)
    }
}

module.exports.checkOut = async(req, res, next) => {
    try {
        let total = 0;
        let data = []; //Mảng chứa id các sản phẩm sẽ được đưa vào cart
        // let currentDate = new Date()
        const USER = req.user
        const sessionID = req.signedCookies.sessionId
        const cart = await Cart.list(USER ? USER._id : sessionID)
            // console.log(cart)
        const coupon = await Coupon.detail(cart.coupon)
            // console.log(coupon)
        if (typeof cart !== "undefined") {
            for (let item of cart.items) {
                const PRODUCT = await Product.get(item.idProduct)
                PRODUCT.qty = item.qty
                data.push(PRODUCT)
                PRODUCT.new_price = Cart.newPrice(PRODUCT.price, PRODUCT.sale_off)
                total += PRODUCT.new_price * PRODUCT.qty
            }

            if (coupon) {
                return res.render("carts/checkout", {
                    data,
                    user: USER ? USER : "",
                    total: total - coupon.discount,
                    coupon,
                    numItems: req.session.numItems
                })
            }
            return res.render("carts/checkout", { data, user: USER ? USER : "", total, numItems: req.session.numItems, title: 'check-out' })
        }

    } catch (error) {
        console.log(error)
    }
}
module.exports.deleteCart = async(req, res, next) => {
    const USER = req.user
    const sessionID = req.signedCookies.sessionId
    try {
        const cart = await Cart.list(USER ? USER._id : sessionID)
        if (typeof cart !== "undefined") {
            await Cart.deleteCart(USER ? USER._id : sessionID)
        }
        return res.redirect("back")
    } catch (error) {
        console.log(error)
    }
}
module.exports.postCheckOut = async(req, res) => {
    const { name, phoneNumb, address } = req.body

    const orderProduct = req.session.order
    try {
        const arrIdProduct = []; //Mảng chứa id và qty các sản phẩm sẽ được đưa vào đơn hàng
        const USER = req.user
        const sessionID = req.signedCookies.sessionId
        const cart = await Cart.list(USER ? USER._id : sessionID)
            // const count = cart.items.length
        for (let item of cart.items) {
            arrIdProduct.push({ idProduct: item.idProduct, qty: item.qty })
        }
        let data = {
            userId: USER ? USER._id : sessionID,
            email: USER ? USER.email : req.body.email,
            nguoiNhan: name[0].charAt(0).toUpperCase() + name.slice(1),
            sdtNguoiNhan: phoneNumb,
            diaChiNhan: address,
            listIdProduct: arrIdProduct,
            createdAt: new Date(),
            status: 0
        }
        if (cart.coupon) {
            data.coupon = cart.coupon
            const code = await Coupon.detail(cart.coupon)
            code.used = code.used + 1
            await Coupon.used(code._id, code.used)
            orderProduct.coupon = code.discount
        }
        await Order.add(data)

        orderProduct.items = arrIdProduct
        orderProduct.numItems = arrIdProduct.length
        orderProduct.user = USER ? USER : req.body

        // Xóa các sản phẩm trong giỏ hàng
        if (typeof cart !== "undefined") {
            await Cart.deleteCart(USER ? USER._id : sessionID)
        }
        return res.redirect("/cart/thank-you")
    } catch (error) {
        console.log(error)
    }
}


// Delete a coupon already exist in order
module.exports.deleteCoupon = async(req, res) => {
    const USER = req.user
    const sessionID = req.signedCookies.sessionId
    const cart = await Cart.list(USER ? USER._id : sessionID)
        // let data = [];
        // let total = 0;
    if (cart.coupon === req.params.code) {
        await Cart.deleteCoupon(USER ? USER._id : sessionID, cart.items)
        return res.redirect("/cart/check-out")
    }
}

module.exports.getThankYou = async(req, res) => {
    const orderProduct = req.session.order

    const USER = req.user;
    let data = []; //Mảng dánh sách đơn hàng
    let total = 0;

    for (let item of orderProduct.items) {
        const PRODUCT = await Product.get(item.idProduct)
        PRODUCT.qty = item.qty
        PRODUCT.newPrice = Cart.newPrice(PRODUCT.price, PRODUCT.sale_off)
        data.push(PRODUCT)
        total = total + (PRODUCT.newPrice * PRODUCT.qty)
    }

    res.render("carts/thank-you", {
        user: USER ? USER : "",
        customer: USER ? USER : orderProduct.user,
        data,
        total,
        coupon: orderProduct ? orderProduct.coupon : 0
    })
}

module.exports.orders = async(req, res) => {
    try {
        const USER = req.user;
        let cart = await Cart.detail(USER ? USER._id : req.signedCookies.sessionId)

        var data = []; //Mảng dánh sách đơn hàng
        if (USER) {
            var ORDER = await Order.list(USER._id)
            data = ORDER;
            for (var i = 0; i < ORDER.length; i++) {
                var total = 0;
                var LISTPRODUCT = [] // Mang danh sach san pham
                for (var j = 0; j < ORDER[i].listIdProduct.length; j++) {
                    const PRODUCT = await Product.get(ORDER[i].listIdProduct[j].idProduct)
                    LISTPRODUCT.push(PRODUCT)
                    PRODUCT.qty = ORDER[i].listIdProduct[j].qty
                    PRODUCT.newPrice = Cart.newPrice(PRODUCT.price, PRODUCT.sale_off)
                    total = total + (PRODUCT.newPrice + PRODUCT.qty)
                }
                data[i].LISTPRODUCT = LISTPRODUCT
                data[i].total = total
                data[i].createdAt = Components.formatDate(data[i].createdAt)
            }
            return res.render('carts/orders', { data, user: USER, numItems: (cart != undefined) ? cart.items.length : 0 });
        } else {
            return res.redirect('/user/sign-in')
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports.delete = async(req, res) => {
    var idProduct = req.params['id']
        // var idProduct = req.body.idProduct
    const USER = req.user
    const sessionID = req.signedCookies.sessionId
    try {
        await Cart.delete(USER ? USER._id : sessionID, idProduct)
            // req.flash('message', 'Your Product Permanently Deleted.')
        res.redirect("/cart/list")
    } catch (error) {
        console.log(error)
    }
}

module.exports.cancleOrder = async(req, res) => {
    try {
        const USER = req.user
        if (USER) {
            var order = await Order.detail(req.body.idOrder)
            order.status = 3
            await Order.delete(order._id, order)
                // res.redirect("/cart/orders")
            return res.json({ success: true, message: 'Your order will be cancled' })
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports.getDetailOrder = async(req, res) => {
    try {
        const USER = req.user
        if (!USER) {
            res.redirect('/user/sign-in')
        } else {
            const idOrder = req.params.id
            const order = await Order.detail(idOrder)
            order.createdAt = Components.formatDate(order.createdAt)
            const data = await Order.view(order)
            const voucher = await Coupon.detail(data.coupon)
            if (voucher) {
                data.coupon = voucher.discount
            }
            res.render("carts/order-detail", { data, user: USER })
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports.getAddress = async(req, res) => {
    const idOrder = req.params['id']
    try {
        const USER = req.user
        const order = await Order.detail(idOrder)
        if (USER) {
            res.render('carts/editAddress', { user: USER, data: order })
        } else {
            res.redirect(`/cart/detail-order/${idOrder}`)
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports.postAddress = async(req, res) => {
    const idOrder = req.params['id']
    const { nguoiNhan, sdtNguoiNhan, diaChiNhan } = req.body
    try {
        // const order = await Order.detail(idOrder)
        // console.log(order)
        let customer = nguoiNhan.charAt(0).toUpperCase() + nguoiNhan.slice(1)
        let data = {
            nguoiNhan: customer,
            sdtNguoiNhan,
            diaChiNhan,
        }
        await Order.updateAddress(idOrder, data)
        res.redirect(`/cart/detail-order/${idOrder}`)
    } catch (error) {
        console.log(error)
    }
}