const express = require("express")
const router = express.Router()
const controller = require("../controllers/product")

router.get("/", controller.list)
router.get("/:cate", controller.category)

// router.get('/:orderby', controller.orderby)

router.get("/info/:id", controller.info)

router.post('/search/All', controller.searchPost)
router.get('/search/:key', controller.search)

router.post('/sort/All', controller.orderbyPost)
router.get('/sort/:orderby', controller.orderby)

module.exports = router;