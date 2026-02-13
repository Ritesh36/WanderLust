const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController.js");
const { isLoggedIn } = require("../middleware.js");

router.get("/", isLoggedIn, aiController.renderAssistForm);
router.post("/", isLoggedIn, aiController.getRecommendations);

module.exports = router;
