var express = require("express");
var router = express.Router();
router.get("/menu", function (req, res) {
  res.render("menu.html", {});
});
router.get("/", function (req, res) {
  res.send({ content: "This is app router" });
});
router.get("/menu_old", function (req, res) {
  res.render("menu_old.html", {});
});
router.get("/menu", function (req, res) {
  res.render("menu.html", {});
});
router.get("/menu2", function (req, res) {
  res.render("menu2.html", {});
});
router.get("/manage_model", function (req, res) {
  res.render("manage_model.html", {});
});
router.get("/manage_model_v2", function (req, res) {
  res.render("manage_model_v2.html", {});
});
router.get("/model_show_view", function (req, res) {
  res.render("model_show_view.html", {});
});

// 帳戶管理系統
router.get("/system/accManage", function (req, res) {
  res.render("system/accManage.html", {});
});
router.get("/system/sysAnnc", function (req, res) {
  res.render("system/sysAnnc.html", {});
});
router.get("/system/staffManage", function (req, res) {
  res.render("system/staffManage.html", {});
});
router.get("/system/verCtrl", function (req, res) {
  res.render("system/verCtrl.html", {});
});

// 資產管理系統
router.get("/asset/mediaRepo", function (req, res) {
  res.render("asset/mediaRepo.html", {});
});
router.get("/asset/logisticsDist", function (req, res) {
  res.render("asset/logisticsDist.html", {});
});
router.get("/asset/deviceManage", function (req, res) {
  res.render("asset/deviceManage.html", {});
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
