const ObjectId = require("mongodb").ObjectId;
var { dbs } = require("../dbs")
var PRODUCTS = "products"
    // var CONTACTS = "contacts"
const list = async() => {
    return await dbs.production.collection(PRODUCTS).find().toArray()
}
exports.list = list


module.exports.list1 = async(perPage, n) => {
    return await dbs.production.collection(PRODUCTS).find().skip(perPage * n).limit(perPage).toArray()
};
const get = async(id) => {
    var results = await dbs.production.collection(PRODUCTS).find({ _id: ObjectId(id) }).toArray()
    return results[0]
}
exports.get = get

// module.exports.category = async(proCategory) => {
//     return await dbs.production.collection(PRODUCTS).find({ proCategory }).toArray()
// }

module.exports.category = async(loai, perPage, n) => {
    return await dbs.production.collection(PRODUCTS).find({ proCategory: loai }).skip(perPage * n).limit(perPage).toArray();
};
module.exports.category1 = async(loai) => {
    return await dbs.production.collection(PRODUCTS).find({ proCategory: loai }).toArray();
};

const count = async() => {
    return await dbs.production.collection(PRODUCTS).find().count();
}
exports.count = count;

module.exports.count1 = async(loai) => {
    return await dbs.production.collection(PRODUCTS).find({ proCategory: loai }).count();
}

module.exports.search = async(key, perPage, n) => {
    await dbs.production.collection(PRODUCTS).createIndex({ proName: "text", proCategory: "text", screen: "text", rom: "text" });
    return await dbs.production.collection(PRODUCTS).find({ $text: { $search: key } }).skip(perPage * n).limit(perPage).toArray();
};

exports.countSearch = async(key) => {
    await dbs.production.collection(PRODUCTS).createIndex({ proName: "text", proCategory: "text", screen: "text", rom: "text" });
    return await dbs.production.collection(PRODUCTS).find({ $text: { $search: key } }).count();
};

exports.sortList = async(price, perPage, n) => {
    return await dbs.production.collection(PRODUCTS).find().skip(perPage * n).limit(perPage).sort({ price }).toArray()

}

// exports.contacts = async() => {
//     return await dbs.production.collection(CONTACTS).find().toArray()
// }