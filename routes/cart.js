const express = require("express")
const router = express.Router()
const controller = require("../controllers/cart")
router.get("/list", controller.list)

// router.get("/add/:id", controller.add)

// router.get("/minus/:id", controller.minus)

router.get("/check-out", controller.checkOut)
router.get("/delete-cart", controller.deleteCart)

router.get("/delete/:id", controller.delete)
    // router.post("/delete", controller.postDelete)

router.get("/orders", controller.orders)

router.get("/detail-order/:id", controller.getDetailOrder)

router.post("/delete-order", controller.cancleOrder)

router.get("/thank-you", controller.getThankYou)

router.get("/orders/edit-addr/:id", controller.getAddress)

router.post("/orders", controller.orders)

router.post("/check-out", controller.postCheckOut)
router.post("/orders/edit-addr/:id", controller.postAddress)

// router.get("/coupon", controller.coupon)
// router.get("/coupon", controller.postCoupon)

// router.get("/coupon/:code", controller.deleteCoupon)

module.exports = router