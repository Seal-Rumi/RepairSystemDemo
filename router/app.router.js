var express = require("express");
var router = express.Router();
router.get("/menu", function (req, res) {
  res.render("menu.html", {});
});
router.get("/", function (req, res) {
  res.send({ content: "This is app router" });
});

// 維護管理系統
router.get("/repair/repairManage", function (req, res) {
  res.render("repair/repairManage.html", {});
});
router.get("/repair/reportManage", function (req, res) {
  res.render("repair/reportManage.html", {});
});
router.get("/repair/rmAnalysis", function (req, res) {
  res.render("repair/rmAnalysis.html", {});
});
router.get("/repair/woManage", function (req, res) {
  res.render("repair/woManage.html", {});
});
router.get("/repair/woSummary", function (req, res) {
  res.render("repair/woSummary.html", {});
});



module.exports = router;
