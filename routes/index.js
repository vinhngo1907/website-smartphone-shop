const express = require("express")
const controller = require("../controllers/index")
const router = express.Router()

router.get("/", controller.index)
router.get("/about", controller.about)
router.get("/contact", controller.contact)

router.post("/contact", controller.postContact)
module.exports = router