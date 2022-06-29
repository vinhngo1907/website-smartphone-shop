const Comment = require("../models/comment")
    // module.exports.add = async(res, req) => {
    //     console.log("User", req.user)
    //     res.render("products/info", { user: req.user })
    // }
const Components = require("../src/constants/components")
module.exports.addPost = async(req, res) => {
    var idProduct = req.params['id']

    var currentDate = new Date();

    const dateTime = Components.appendLeadingZeroes(currentDate.getDate()) + "/" +
        Components.appendLeadingZeroes((currentDate.getMonth() + 1)) + "/" +
        currentDate.getFullYear() + " @ " +
        Components.appendLeadingZeroes(currentDate.getHours()) + ":" +
        Components.appendLeadingZeroes(currentDate.getMinutes()) + ":" +
        Components.appendLeadingZeroes(currentDate.getSeconds());

    var USER = req.user
        // EMAIL = "";
        // USERNAME = req.body.username

    // console.log("Rating: ", req.body.rating)
    var COMMENT = new Object()

    COMMENT = {
        idProduct: req.params.id,
        // email: EMAIL,
        username: USER ? USER.username : req.body.username,
        comment: req.body.comment,
        rating: req.body.rating,
        dateTime: dateTime
    }
    if (USER) {
        COMMENT.email = USER.email;
        // COMMENT.username = USER.username
    }
    await Comment.add(COMMENT)
        // console.log(COMMENT)
    res.redirect("/products/info/" + idProduct)
}