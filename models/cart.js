const ObjectId = require("mongodb").ObjectId
const { dbs } = require("../dbs")
const CART = "carts"
const Components = require("../src/constants/components")
const list = async(id) => {
    var objectID = ObjectId(id)
    return await dbs.production.collection(CART).findOne({ userId: objectID })
}
exports.list = list

const get = async(email) => {
    return await dbs.production.collection(CART).findOne({ email })
}
exports.get = get

const detail = async(id) => {
    var objectID = ObjectId(id)
    return await dbs.production.collection(CART).findOne({ userId: objectID })
}
exports.detail = detail

const add = async(id, idProduct) => {
    // await dbs.production.collection(CART).dropIndex({ "createdAt": 1 }, { expireAfterSeconds: 3600 })
    var items = []
    var checkCart = await detail(id)
        // console.log("This is checkcart: ", checkCart)
    if (typeof checkCart === "undefined") {
        var cart = {
            idProduct,
            qty: 1
        }
        items.push(cart)
        var data = {
            userId: ObjectId(id),
            items,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        // await dbs.production.collection(CART).createIndex({ "createdAt": 1 }, { expireAfterSeconds: 86400 })
        return await dbs.production.collection(CART).insertOne(data)
    } else {
        var userId = ObjectId(id)
        var itemMatch = await checkCart.items.find(item => {
            return item.idProduct.indexOf(idProduct) !== -1
        })

        if (itemMatch) {
            for (var item of checkCart.items) {
                if (item.idProduct === itemMatch.idProduct) {
                    item.qty += 1
                    break
                }

            }
            checkCart.updatedAt = new Date()
            await updateCart(userId, checkCart)
        } else {
            checkCart.items.push({ idProduct, qty: 1 })
            checkCart.updatedAt = new Date()
            await updateCart(userId, checkCart)
        }
    }

}
exports.add = add

const minus = async(id, idProduct) => {
    const userId = ObjectId(id)
    const checkCart = await detail(id)
    const itemMatch = await checkCart.items.find(item => {
        return item.idProduct.indexOf(idProduct) !== -1
    })

    if (itemMatch) {
        for (var item of checkCart.items) {
            if (item.idProduct === itemMatch.idProduct) {
                item.qty = (item.qty > 1) ? item.qty - 1 : item.qty
                break
            }
        }
        checkCart.updatedAt = new Date()
        await updateCart(userId, checkCart)
    }
}

exports.minus = minus

// Update cart when add or minus item in cart
const updateCart = async(userId, cart) => {
    // await dbs.production.collection(CART).updateOne({ userId }, { $set: cart })
    return await dbs.production.collection(CART).findOneAndUpdate({ userId }, { $set: cart })

    // const result = await list(userId)
    // return result
}

exports.updateCart = updateCart

const newPrice = (price, sale_off) => {
    var new_price = 0;
    if (sale_off !== 0) {
        new_price = price - (price * sale_off) / 100;
    } else {
        new_price = price;
    }
    return new_price
}

exports.newPrice = newPrice

exports.count = async(idProduct) => {
    return await dbs.production.collection(CART).count({ idProduct })
}

// return await dbs.production.collection(CART).updateOne({ userId: ObjectId(id) }, { $set: { items: [] }, $unset: { coupon: "" } })
exports.delete = async(id, idProduct) => {
    const userId = ObjectId(id)
    const cart = await detail(id)
    if (typeof cart !== 'undefined') {
        for (let item of cart.items) {
            if (item.idProduct === idProduct) {
                cart.items.splice(cart.items.indexOf(item), 1)
                break
            }
        }
        await updateCart(userId, cart)
    } else {
        return
    }
}

exports.deleteCart = async(id) => {
    return await dbs.production.collection(CART).updateOne({ userId: ObjectId(id) }, { $set: { items: [] }, $unset: { coupon: "" } })
}

exports.deleteCoupon = async(id, items) => {
    return await dbs.production.collection(CART).findOneAndUpdate({ userId: ObjectId(id) }, { $set: { items }, $unset: { coupon: "" } })
}

// Update cart when use coupon
exports.reUpdateCart = async(id, items, coupon) => {
    await dbs.production.collection(CART).findOneAndUpdate({ userId: ObjectId(id) }, { $set: { items, coupon } })
    return await list(id)
}

// Show products list

exports.showCart = async(cart, Product) => {
    let data = []
    let total = 0;
    let viewCart = new Object()
    let money = 0
    if (typeof cart !== "undefined") {
        for (let item of cart.items) {
            const PRODUCT = await Product.get(item.idProduct)
            PRODUCT.qty = item.qty
            PRODUCT.newPrice = this.newPrice(PRODUCT.price, PRODUCT.sale_off)
            data.push(PRODUCT)
            total += PRODUCT.newPrice * PRODUCT.qty
        }
        // money = Components.formatMoney(total, 'en')
        viewCart = { data, total }
    }
    return viewCart
}