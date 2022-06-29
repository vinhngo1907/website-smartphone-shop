const ObjectId = require("mongodb").ObjectId
const { dbs } = require('../dbs')
const COUPONS = 'coupons'

const list = async() => {
    return dbs.production.collection(COUPONS).find().toArray()
}

exports.list = list

const detail = async(code) => {
    var result = dbs.production.collection(COUPONS).findOne({ code })
    return result
}
exports.detail = detail

const check = async(code) => {
    const coupon = await detail(code)
    if (!coupon) {
        return false
    }
    // let currentDate = new Date()
    // if (coupon.expiration < currentDate) {
    //     return false
    // }
    return true
}

exports.check = check

exports.used = async(id, numb) => {
    return dbs.production.collection(COUPONS).findOneAndUpdate({ _id: ObjectId(id) }, { $set: { used: numb } })
}