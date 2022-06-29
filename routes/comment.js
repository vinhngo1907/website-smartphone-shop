const express = require("express")
const router = express.Router();
const controller = require("../controllers/comment")

// router.get("/add/:id", controller.add)

router.post("/add/:id", controller.addPost)
module.exports = router