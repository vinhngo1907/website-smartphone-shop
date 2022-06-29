//We need to work with "MongoClient" interface in order to connect to a mongodb server
const MongoClient = require("mongodb").MongoClient

// Note: A production application should not expose database credentials in plain text.
// For strategies on handling credentials, visit 12factor: https://12factor.net/config.

const PROD_URI = process.env.MONGO_URL

var dbs = { production: {} }

// Use connect method to connect to the Server
function connectDB(url) {
    return MongoClient.connect(url, {
        // useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false
    }).then(client => client.db())
}


exports.initdb = async() => {
    let database = await connectDB(PROD_URI)
    dbs.production = database
}

exports.dbs = dbs