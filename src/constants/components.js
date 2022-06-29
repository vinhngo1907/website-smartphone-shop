const CartModel = require("../../models/cart")
const perPage = 8

const prevPage = (page) => {
    var pg = page === 1 ? 1 : page - 1
    return pg
}

exports.prevPage = prevPage

const nextPage = (page, count) => {
    var pg = page < Math.ceil(count / perPage) ? page + 1 : page
    return pg
}
exports.nextPage = nextPage

const appendLeadingZeroes = (n) => {
    if (n <= 9) {
        return "0" + n
    }
    return n
}
exports.appendLeadingZeroes = appendLeadingZeroes

const range = (page, perPage, count) => {
    start = (page - 1) * perPage
    end = page * perPage
        // console.log("Page", page, "- per page:", perPage)
    let range = []

    var from = 0;
    var to = Math.ceil(count / perPage)
        // console.log("From", from, " - to:", to)
    if (to < 8) {
        for (let i = from; i < to; i++) {
            range.push(i + 1)
        }
        return range
    }
    const currentPage = page + 1;
    // console.log("Curent Page", currentPage)
    if (currentPage < 5) {
        range = [1, 2, 3, 4, 5, "...", to]
        return range
    }

    let middle = currentPage < to - 3 ? [currentPage - 1, currentPage, currentPage + 1, "..."] : [to - 4, to - 3, to - 2, to - 1]
    range = [
            ...[1, "..."],
            ...middle,
            ...[to]
        ]
        // console.log("Range", range)
    return range

}
exports.range = range

const formatMoney = (n, type) => {
    let result = 0
    switch (type) {
        case 'en':
            result = (n / 22765.00)
            return result.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        default:
            result = n
            return result.toLocaleString('it-IT') + " VNĐ"
    }

}
exports.formatMoney = formatMoney

exports.formatDate = (date) => {
    let result = ""
    result = date.getFullYear() + "-" +
        appendLeadingZeroes(date.getMonth() + 1) + "-" +
        appendLeadingZeroes(date.getDate()) + " " +
        appendLeadingZeroes(date.getHours()) + ":" +
        appendLeadingZeroes(date.getMinutes()) + ":" +
        appendLeadingZeroes(date.getSeconds());
    return result
}

exports.AlertMessage = function() {

}
exports.titleCase = (str) => {
    let sentence = str.toLowerCase().split(" ");
    for (var i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(" ");
}
exports.order = function(oldCart) {
    this.items = oldCart.items || [];
    this.total = oldCart.total || 0;
    this.numItems = oldCart.numItems || this.items.length || 0;
    this.user = oldCart.user || {}
    this.coupon = oldCart.coupon || 0
}

// exports.Cart = function(oldCart) {
//     this.items = oldCart.items || [];
//     this.storeItem = oldCart.storeItem || []
//     this.userId = oldCart.userId || {};
//     this.totalQty = oldCart.totalQty || 0;
//     this.totalPrice = oldCart.totalPrice || 0;
//     this.add = (product, userId) => {
//         this.userId = userId
//         var listItem = this.items
//         var itemMatch = listItem.find(item => {
//             return item.idProduct.indexOf(product._id) !== -1
//         })
//         if (itemMatch) {
//             for (var item of listItem) {
//                 if (item.idProduct === itemMatch.idProduct) {
//                     item.qty += 1
//                     break
//                 }
//             }
//         } else {
//             listItem.push({ idProduct: product._id, qty: 1 })
//             var newPrice = CartModel.newPrice(product.price, product.sale_off)
//             this.storeItem.push({
//                 _id: product._id,
//                 url: product.url,
//                 proName: product.proName,
//                 newPrice
//             })
//         }
//         return this
//     };
//     this.minus = () => {
//         var itemMatch = this.items.find(item => {
//             return item.idProduct.indexOf(idProduct) !== -1
//         })

//         if (itemMatch) {
//             for (var item of this.items) {
//                 if (item.idProduct === itemMatch.idProduct) {
//                     item.qty = (item.qty > 1) ? item.qty - 1 : item.qty
//                     break
//                 }
//             }
//         }
//         return this
//     }
//     this.array = function() {
//         return this.storeItem
//     }
// };