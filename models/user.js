// const ObjectId = require("mongodb").ObjectId;
const { dbs } = require("../dbs");
const USERS = "users"
const CONTACTS = "contacts"
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
// const SALT_ROUNDS = 10;
const list = async() => {
    return await dbs.production.collection(USERS).find().toArray()
}
exports.list = list

const detail = async(id) => {
    return await dbs.production.collection(USERS).findOne({ _id: id })
}
exports.detail = detail

const get = async(email) => {
    return await dbs.production.collection(USERS).findOne({ email });
}

exports.get = get

const add = async(user) => {
    return await dbs.production.collection(USERS).insertOne(user)
}

exports.add = add

module.exports.passwordValid = async(email, password) => {
    var user = await get(email)
    if (!user) {
        return false
    }
    return await bcrypt.compare(password, user.password)
}

module.exports.update = async(id, user) => {
    user.updatedAt = new Date()
    return await dbs.production.collection(USERS).updateOne({ _id: ObjectId(id) }, { $set: user });
};
const check = async(email) => {
    var user = await get(email)
    if (!user) {
        return false
    }
    return true
}
exports.check = check

const phone = async(sdt) => {
    var phoneNumb = await dbs.production.collection(USERS).findOne({ phoneNumb: sdt })
    if (!phoneNumb) {
        return false
    }
    return true
}
exports.phone = phone

const verifyUser = async(email) => {
    const account = await dbs.production.collection(USERS).findOne({ email })

    if (account && account.role) {
        return true
    }
    return false

}

exports.verifyUser = verifyUser

exports.contact = async(contact) => {
    return await dbs.production.collection(CONTACTS).insertOne(contact)
}

exports.getContact = async(send) => {
    const result = await dbs.production.collection(CONTACTS).findOne({ email: send })
    return result
}