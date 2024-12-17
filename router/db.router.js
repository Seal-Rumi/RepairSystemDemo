var express = require("express");
var router = express.Router();
const pgControl = require("../util/pg.controller.js");

router.post("/", function (req, res) {
  res.send({ success: true, data: `this is monitor router` });
});
router.get("/", function (req, res) {
  res.send({ success: true, data: `this is monitor router` });
});
router.post("/character/list", async function (req, res) {
  let data = req.body;
  let result = await pgControl.Character.characterList(data);
  res.send(result);
});

// Image
router.post("/image/list", async function (req, res) {
  let data = req.body;
  let result = await pgControl.image.list(data);
  res.send(result);
});
router.post("/image/add", async function (req, res) {
  let data = req.body;
  let result = await pgControl.image.add(data);
  res.send(result);
});
router.post("/image/update", async function (req, res) {
  let data = req.body;
  let result = await pgControl.image.update(data);
  res.send(result);
});
router.post("/image/delete", async function (req, res) {
  let data = req.body;
  let result = await pgControl.image.delete(data);
  res.send(result);
});

// deviceType
router.post("/deviceType/list", async function (req, res) {
  let data = req.body;
  let result = await pgControl.deviceType.list(data);
  res.send(result);
});

// device
router.post("/device/list", async function (req, res) {
  let data = req.body;
  let result = await pgControl.device.list(data);
  res.send(result);
});
// Model
router.post("/model/list", async function (req, res) {
  let data = req.body;
  let result = await pgControl.model.list(data);
  res.send(result);
});
router.post("/model/add", async function (req, res) {
  let data = req.body;
  let result = await pgControl.model.add(data);
  res.send(result);
});
router.post("/model/update", async function (req, res) {
  let data = req.body;
  let result = await pgControl.model.update(data);
  res.send(result);
});
router.post("/model/delete", async function (req, res) {
  let data = req.body;
  let result = await pgControl.model.delete(data);
  res.send(result);
});

// WorkOrder
router.post("/workOrder/list", async function (req, res) {
  let data = req.body;
  let result = await pgControl.workOrder.list(data);
  res.send(result);
});
router.post("/workOrder/add", async function (req, res) {
  let data = req.body;
  let result = await pgControl.workOrder.add(data);
  res.send(result);
});
router.post("/workOrder/update", async function (req, res) {
  let data = req.body;
  let result = await pgControl.workOrder.update(data);
  res.send(result);
});
router.post("/workOrder/delete", async function (req, res) {
  let data = req.body;
  let result = await pgControl.workOrder.delete(data);
  res.send(result);
});

// issue
router.post("/issue/list", async function (req, res) {
  let data = req.body;
  let result = await pgControl.issue.list(data);
  res.send(result);
});

// staff
router.post("/staff/list", async function (req, res) {
  let data = req.body;
  let result = await pgControl.staff.list(data);
  res.send(result);
});

module.exports = router;
