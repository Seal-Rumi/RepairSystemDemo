async function json_post(url, data) {
  var jxhr = $.ajax({
    url: url,
    type: "POST",
    dataType: "json",
    contentType: "application/json;charset=utf-8",
    data: JSON.stringify(data),
    timeout: 30 * 1000,
    xhrFields: {
      withCredentials: true,
    },
    crossDomaina: true,
  });
  return jxhr;
}

function generateTable(data) {
  var table = document.createElement("table");
  table.classList.add("table-all");

  // 創建表頭
  var header = table.createTHead();
  var row = header.insertRow();
  row.classList.add("table-header");
  var headers = [
    "工單編號",
    "設備類型",
    "設備",
    "工單進度",
    "報修時間",
    "功能",
  ];
  for (var i = 0; i < headers.length; i++) {
    var cell = document.createElement("th");
    cell.innerHTML = headers[i];
    row.appendChild(cell);
  }

  // 創建表身
  var tbody = table.createTBody();
  if (data) {
    for (var i = 0; i < data.length; i++) {
      var row = tbody.insertRow();
      const infoArr = [
        data[i].workorder_uuid ? data[i].workorder_uuid : "-",
        data[i].device_type ? data[i].device_type : "-",
        data[i].device_name ? data[i].device_name : "-",
        data[i].work_state ? data[i].work_state : "-",
        data[i].report_ts ? to_time_method(data[i].report_ts) : "-",
      ];
      var uuidCell = row.insertCell();
      uuidCell.innerHTML = infoArr[0].split("-")[0];
      uuidCell.id = infoArr[0];

      var typeCell = row.insertCell();
      typeCell.innerHTML = infoArr[1];

      var deviceCell = row.insertCell();
      deviceCell.innerHTML = infoArr[2];

      var stateCell = row.insertCell();
      stateCell.innerHTML = infoArr[3];

      var reportTimeCell = row.insertCell();
      reportTimeCell.innerHTML = infoArr[4];

      var funcCell = row.insertCell(); // 功能列
      var btnContainer = document.createElement("span");
      btnContainer.style.display = "inline-flex"; // 使按鈕橫向排列
      btnContainer.style.width = "100%"; // 使按鈕橫向排列
      btnContainer.style.gap = "2px"; // 設定按鈕之間的間距

      // 查看按鈕
      var viewBtn = document.createElement("div");
      viewBtn.classList.add("funcBtn", "viewBtn");
      viewBtn.innerHTML = `<i class="fas fa-eye"></i>查看`;

      // 編輯按鈕
      var editBtn = document.createElement("div");
      editBtn.classList.add("funcBtn", "editBtn");
      editBtn.innerHTML = `<i class="fas fa-edit"></i>編輯`;

      // 將按鈕加入 span 容器
      btnContainer.appendChild(viewBtn);
      btnContainer.appendChild(editBtn);

      // 將 span 容器加入功能列
      funcCell.appendChild(btnContainer);
    }
  }

  document.body.appendChild(table);

  return table;
}

function systemMsg(text) {
  $("#overlay").css("display", "block");
  $("#form-sysMsg").css("display", "block");
  $("#sys-msg-text").text(text);
}
function to_time_method(time) {
  let date = new Date(time * 1);
  let formattedDate =
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2) +
    " " +
    ("0" + date.getHours()).slice(-2) +
    ":" +
    ("0" + date.getMinutes()).slice(-2);
  return formattedDate;
}
let workOrderData = [];
let lastIndex_image = null;
let lastIndex_model = null;
function table_update() {
  json_post("../../api/workOrder/list", {}).then((res) => {
    console.log(res);
    if (res.success) {
      workOrderData = res.data;
      $("#table_1").empty();
      $("#table_1").append(generateTable(workOrderData));
    }
  });
}

let deviceTypeList = [];
let deviceList = [];
let issueList = [];
function UpdateDeviceType() {
  $("#form-deviceType").empty();
  $("#form-deviceType").append(`<option value="-">請選擇設備類型</option>`);

  deviceTypeList.forEach((item) => {
    $("#form-deviceType").append(
      `<option value="${item.type}">${item.type}</option>`
    );
  });
}
function UpdateDevice() {
  $("#form-device").empty();
  $("#form-device").append(`<option value="-">請選擇設備</option>`);
  if (deviceList) {
    deviceList.forEach((item) => {
      $("#form-device").append(
        `<option value="${item.uuid}">${item.device_name}</option>`
      );
    });
  }
}
function UpdateIssue() {
  $("#form-issue").empty();
  $("#form-issue").append(`<option value="-">請選擇維護原因</option>`);
  if (issueList) {
    issueList.forEach((item) => {
      $("#form-issue").append(
        `<option value="${item.id}">${item.statement}</option>`
      );
    });
  }
}
function showTooltip(tooltipSelector, message) {
  const tooltip = $(tooltipSelector);
  tooltip.text(message);
  tooltip.fadeIn();
  setTimeout(() => {
    tooltip.fadeOut();
  }, 2000);
}
$(document).ready(function () {
  // 初始化
  json_post("../../api/deviceType/list", {}).then((res) => {
    if (res.success && res.data) {
      deviceTypeList = res.data;
      UpdateDeviceType();
    }
  });
  json_post("../../api/issue/list", {}).then((res) => {
    if (res.success && res.data) {
      issueList = res.data;
      UpdateIssue();
    }
  });
  table_update();

  $(document).on("change", "#form-deviceType", function () {
    let type = $("#form-deviceType").val();
    json_post("../../api/device/list", { type }).then((res) => {
      console.log(res);
      if (res.success && res.data) {
        deviceList = res.data;
      } else {
        deviceList = [];
      }
      UpdateDevice();
    });
  });

  $(document).on("click", "#add_workorder", function () {
    $("#overlay").css("display", "block");
    $("#form-report").css("display", "block");
  });
  $(document).on("click", "#form-report .confirmBtn", function () {
    if ($("#form-deviceType").val() == "-") {
      showTooltip("#deviceType-tooltip", "請選擇設備類型");
      return;
    }
    if ($("#form-device").val() == "-") {
      showTooltip("#device-tooltip", "請選擇設備");
      return;
    }
    if ($("#form-issue").val() == "-") {
      showTooltip("#issue-tooltip", "請選擇維護原因");
      return;
    }
    let obj = {
      device_uuid: $("#form-device").val(),
      issue: $("#form-issue").val(),
      report_staff: "40200332-d097-41ef-aff8-65877b92f8ce",
    };
    json_post("../../api/workorder/add", obj).then((res) => {
      console.log(res);
      if (res.success) {
        systemMsg("報修成功!");
        table_update();
        $("#overlay").css("display", "none");
        $("#form-report").css("display", "none");
      } else {
        systemMsg("報修失敗, 系統異常!");
      }
    });
  });

  $("#table_1").append(generateTable([]));

  $(".closeBtn").on("click", function () {
    $("#overlay").css("display", "none");
    $(this).closest(".form-container").css("display", "none");
  });
});
