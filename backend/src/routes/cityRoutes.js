const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");

router.get("/", cityController.getCities);
router.get("/:cityId", cityController.getCityById);

module.exports = router;
