const ObjectId = require("mongodb").ObjectId
const { dbs } = require("../dbs")
const ORDERS = "orders"
const Product = require("./product")
const Cart = require("./cart")

const detail = async(id) => {
    return await dbs.production.collection(ORDERS).findOne({ _id: ObjectId(id) })
}
exports.detail = detail

exports.view = async(order) => {
    // var result = await this.detail(order)
    var total = 0;
    var LISTPRODUCT = [] // Mang danh sach san pham
    for (var item of order.listIdProduct) {
        const PRODUCT = await Product.get(item.idProduct)
        LISTPRODUCT.push(PRODUCT)
        PRODUCT.newPrice = Cart.newPrice(PRODUCT.price, PRODUCT.sale_off)
        PRODUCT.qty = item.qty
        total = total + (PRODUCT.newPrice * PRODUCT.qty)
    }
    order.LISTPRODUCT = LISTPRODUCT
    order.total = total;
    return order
}


// const list = async(email) => {
//     return await dbs.production.collection(ORDERS).find({ email }).toArray()
// }
const list = async(id) => {
    return await dbs.production.collection(ORDERS).find({ userId: ObjectId(id) }).sort({ 'createdAt': -1 }).toArray()
}
exports.list = list

const add = async(order) => {
    return await dbs.production.collection(ORDERS).insertOne(order)
}
exports.add = add

exports.delete = async(id, order) => {
    return await dbs.production.collection(ORDERS).updateOne({ _id: ObjectId(id) }, { $set: order })
        // return await dbs.production.collection(ORDERS).deleteOne({ _id: ObjectId(id) })
}

exports.deleteCoupon = async(idOrder, listIdProduct) => {
    return await dbs.production.collection(ORDERS).updateOne({ id: ObjectId(idOrder) }, { $set: { listIdProduct }, $unset: { coupon: "" } })
}

exports.updateAddress = async(idOrder, data) => {
    return await dbs.production.collection(ORDERS).updateOne({ _id: ObjectId(idOrder) }, {
        $set: {
            nguoiNhan: data.nguoiNhan,
            sdtNguoiNhan: data.sdtNguoiNhan,
            diaChiNhan: data.diaChiNhan
        }
    })
}