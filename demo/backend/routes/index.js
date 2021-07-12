var express = require("express");
const { getLoaders } = require("../loaders");
const { getResults } = require("../containers/result_controller");
const { generateSignedUrl } = require("../utils/getPictureURL");

var router = express.Router();
const mockLoaders = require("../config/loader.json");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/loaders", function (req, res) {
  res.json(mockLoaders);
});

router.get("/result", getResults());
router.get("/transform_url/", generateSignedUrl());

module.exports = router;
