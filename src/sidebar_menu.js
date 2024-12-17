// 帳戶管理系統
$(document).on("click", "#sys-ann", function () {
  window.location.href = "../system/sysAnnc";
});
$(document).on("click", "#staff-manage", function () {
  window.location.href = "../system/staffManage";
});
$(document).on("click", "#acc-manage", function () {
  window.location.href = "../system/accManage";
});
$(document).on("click", "#version-control", function () {
  window.location.href = "../system/verCtrl";
});

// 資產管理系統
$(document).on("click", "#media-repo", function () {
  window.location.href = "../asset/mediaRepo";
});
$(document).on("click", "#logistics-dist", function () {
  window.location.href = "../asset/logisticsDist";
});
$(document).on("click", "#device-manage", function () {
  window.location.href = "../asset/deviceManage";
});

// 維護管理系統
$(document).on("click", "#repair-manage", function () {
  window.location.href = "../repair/repairManage";
});
$(document).on("click", "#report-manage", function () {
  window.location.href = "../repair/reportManage";
});
$(document).on("click", "#repair-analysis", function () {
  window.location.href = "../repair/rmAnalysis";
});
$(document).on("click", "#work-manage", function () {
  window.location.href = "../repair/woManage";
});
$(document).on("click", "#work-summary", function () {
  window.location.href = "../repair/woSummary";
});
