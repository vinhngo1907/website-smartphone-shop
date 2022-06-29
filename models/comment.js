const { dbs } = require("../dbs")
const ObjectId = require("mongodb").ObjectI;
const COMMENTS = "comments"

module.exports.list = async(idProduct) => {
    return await dbs.production.collection(COMMENTS).find({ idProduct }).toArray()
}


module.exports.add = async(comment) => {
    return await dbs.production.collection(COMMENTS).insertOne(comment)
}


module.exports.count = async(idProduct) => {
    return await dbs.production.collection(COMMENTS).find({ idProduct }).count()
}