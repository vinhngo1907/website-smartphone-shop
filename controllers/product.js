const Product = require("../models/product")
const Cart = require("../models/cart")
const Comment = require("../models/comment")
const Components = require("../src/constants/components")
const perPage = 8
var sort_item
var sort_value = "Giá thấp tới cao";
var price
module.exports.list = async(req, res) => {
    try {
        var message = req.flash('message')
        const products = await Product.list()
        var page = parseInt(req.query.page) || 1

        var start = (page - 1) * perPage
        var end = page * perPage;

        const count = products.length
        res.render("products/list", {
            page,
            count,
            products: products.slice(start, end),
            prevPage: Components.prevPage(page),
            nextPage: Components.nextPage(page, count),
            range: Components.range(page, perPage, count),
            title: "All",
            user: req.user,
            numItems: req.session.numItems,
            message
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports.info = async(req, res) => {
    const idProduct = req.params.id
    const comments = await Comment.list(idProduct)
    const count = await Comment.count(idProduct)
    const product = await Product.get(idProduct)
    let total = 0
    let avg = 0
    for (let cmt of comments) {
        total = total + parseInt(cmt.rating)
    }
    avg = avg + total / (comments.length)
        // console.log(Math.ceil(avg).toString())
    res.render("products/info", {
        product,
        user: req.user,
        comments,
        count,
        avg: (!isNaN(avg)) ? avg : 0,
        numItems: req.session.numItems
    })
}

module.exports.category = async(req, res) => {
    var loai = req.params['cate']
    var page = Number(req.query.page) || 1
    var title = ""
    var products
    var count = 0
    try {
        const cart = await Cart.detail(req.user ? req.user._id : req.signedCookies.sessionId)
        if (loai !== "All") {
            products = await Product.category(loai, perPage, page - 1);
            title = loai;
            count = await Product.count1(loai);
        }
        // sort_item = req.query.orderby

        if (loai === 'All') {
            title = "All"
            products = await Product.list1(perPage, page - 1);
            count = await Product.count();
            // if (sort_item === '1') {
            //     sort_value = 'Giá thấp tới cao'
            //     price = 1
            //     products = await Product.sortList(price, perPage, page - 1);
            //     count = await Product.count();
            // } else if (sort_item === '-1') {
            //     sort_value = 'Giá cao tới thấp'
            //     price = -1
            //     products = await Product.sortList(price, perPage, page - 1);
            //     count = await Product.count();
            // } else {
            //     products = await Product.list1(perPage, page - 1);
            //     count = await Product.count();
            // }
        }
        // const data = [{
        //     NumOfPage: Number,
        //     cate: String
        // }];
        // for (var i = 0; i < count / perPage; i++) {
        //     data[i] = {
        //         NumOfPage: i + 1,
        //         cate: req.params['cate']
        //     }
        // }

        res.render("products/list", {
            page,
            count,
            products,
            title,
            nextPage: Components.nextPage(page, count),
            prevPage: Components.prevPage(page),
            range: Components.range(page, perPage, count),
            user: req.user,
            // numItems: req.session.numItems,
            numItems: (cart != undefined) ? cart.items.length : 0,
            sort_value,
            message: req.flash('message')
        })
    } catch (error) {
        console.log(error)
    }
}
module.exports.orderby = async(req, res) => {
    // var loai = req.params['cate']
    var page = Number(req.query.page)
    var title = ""
    var products
    var count = 0
    try {

        sort_item = req.params.orderby

        if (sort_item === '1') {
            sort_value = 'Giá thấp tới cao'
            price = 1
            products = await Product.sortList(price, perPage, page - 1);
            count = await Product.count();
        }
        if (sort_item === '-1') {
            sort_value = 'Giá cao tới thấp'
            price = -1
            products = await Product.sortList(price, perPage, page - 1);
            count = await Product.count();
        }
        const data1 = [{
            NumOfPage: Number,
            orderby: String
        }];
        console.log(data1)
        for (var i = 0; i < count / perPage; i++) {
            data1[i] = {
                NumOfPage: i + 1,
                orderby: sort_item
            }
        }

        res.render("products/list", {
            page,
            count,
            products,
            title,
            nextPage: Components.nextPage(page, count),
            prevPage: Components.prevPage(page),
            range: Components.range(page, perPage, count),
            user: req.user,
            numItems: req.session.numItems,
            data1,
            sort_value
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports.orderbyPost = async(req, res) => {
    var page = Number(req.query.page)
    var products
    var count = 0
    try {
        sort_item = req.body.orderby
        if (sort_item === '1') {
            sort_value = 'Giá thấp tới cao'
            price = 1
            products = await Product.sortList(price, perPage, page - 1);
            count = await Product.count();
        } else if (sort_item === '-1') {
            sort_value = 'Giá cao tới thấp'
            price = -1
            products = await Product.sortList(price, perPage, page - 1);
            count = await Product.count();
        }
        const data1 = [{
            NumOfPage: Number,
            orderby: String
        }];
        for (var i = 0; i < count / perPage; i++) {
            data1[i] = {
                NumOfPage: i + 1,
                orderby: sort_item
            }
        }
        console.log(data1)
        res.render("products/list", {
            page,
            count,
            products,
            title: 'All',
            nextPage: Components.nextPage(page, count),
            prevPage: Components.prevPage(page),
            range: Components.range(page, perPage, count),
            user: req.user,
            numItems: req.session.numItems,
            data1,
            sort_value
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports.search = async(req, res) => {
    try {
        const key = req.params.key
        const page = Number(req.query.page)
        const products = await Product.search(key, perPage, page - 1)
        const count = await Product.countSearch(key)
        const data2 = [{
            NumOfPage: Number,
            key: String
        }];
        for (var i = 0; i < count / perPage; i++) {
            data2[i] = {
                NumOfPage: i + 1,
                key: key
            }
        }
        console.log(data2)
        res.render('products/list', {
            products,
            page,
            title: "All",
            user: req.user,
            nextPage: Components.nextPage(page, count),
            prevPage: Components.prevPage(page),
            range: Components.range(page, perPage, count),
            data2
        });
    } catch (error) {
        console.log(error)
    }
}

exports.searchPost = async(req, res) => {
    try {
        const key = req.body.key; //Lấy key từ input
        const page = Number(req.query.page);

        const products = await Product.search(key, perPage, page - 1);
        const count = await Product.countSearch(key);
        const data2 = [{
            NumOfPage: Number, //chỉ số trang
            key: String //từ khóa cần tìm
        }];
        for (var i = 0; i < count / perPage; i++) {
            data2[i] = {
                NumOfPage: i + 1,
                key: key
            }
        }
        // console.log(data2, typeof data2[0].NumOfPage)
        if (typeof data2[0].NumOfPage === 'function') {
            return res.render('error', { message: 'Product is not available!!', title: 'You can see some more products' })
        }
        res.render('products/list', {
            products,
            page,
            title: "All",
            user: req.user,
            nextPage: Components.nextPage(page, count),
            prevPage: Components.prevPage(page),
            range: Components.range(page, perPage, count),
            data2
        });
    } catch (error) {
        console.log(error)
    }
}