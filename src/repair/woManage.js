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
    ("0" + date.getDate()).slice(-2);
  // " " +
  // ("0" + date.getHours()).slice(-2) +
  // ":" +
  // ("0" + date.getMinutes()).slice(-2);
  return formattedDate;
}
function convertToUnixTimestamp(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format. Please use YY-MM-DD format.");
  }
  return date.getTime();
}
let workOrderData = [];
let lastIndex = null;

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
let mt_staffList = [];
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
    "維護原因",
    "工單進度",
    "報修人員",
    "維修人員",
    "指派時間",
    "截止時間",
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
        data[i].issue != null ? data[i].issue : "-",
        data[i].work_state ? data[i].work_state : "-",
        data[i].report_staff_name ? data[i].report_staff_name : "-",
        data[i].maintenance_staff_name ? data[i].maintenance_staff_name : "-",
        data[i].assign_ts ? to_time_method(data[i].assign_ts) : "-",
        data[i].deadline ? to_time_method(data[i].deadline) : "-",
      ];
      var uuidCell = row.insertCell();
      uuidCell.innerHTML = infoArr[0].split("-")[0];
      uuidCell.id = infoArr[0];

      var typeCell = row.insertCell();
      typeCell.innerHTML = infoArr[1];

      var deviceCell = row.insertCell();
      deviceCell.innerHTML = infoArr[2];

      var issueCell = row.insertCell();
      issueCell.innerHTML = infoArr[3];

      var stateCell = row.insertCell();
      stateCell.innerHTML = infoArr[4];

      var reportStaffCell = row.insertCell();
      reportStaffCell.innerHTML = infoArr[5];

      var repairStaffCell = row.insertCell();
      repairStaffCell.innerHTML = infoArr[6];

      var assignTimeCell = row.insertCell();
      assignTimeCell.innerHTML = infoArr[7];

      var deadlineCell = row.insertCell();
      deadlineCell.innerHTML = infoArr[8];

      var funcCell = row.insertCell(); // 功能列
      var btnContainer = document.createElement("span");
      btnContainer.style.display = "inline-flex"; // 使按鈕橫向排列
      btnContainer.style.width = "100%"; // 使按鈕橫向排列
      btnContainer.style.gap = "2px"; // 設定按鈕之間的間距

      // 查看按鈕
      var assignBtn = document.createElement("div");
      if (data[i].state == 0) {
        assignBtn.classList.add("funcBtn", "assignBtn");
        assignBtn.innerHTML = `<i class="fas fa-briefcase"></i>指派`;
      } else {
        assignBtn.classList.add("funcBtn");
        assignBtn.innerHTML = `<i class="fas fa-briefcase"></i>已指派`;
      }

      // 將按鈕加入 span 容器
      btnContainer.appendChild(assignBtn);

      // 將 span 容器加入功能列
      funcCell.appendChild(btnContainer);
    }
  }

  document.body.appendChild(table);

  return table;
}

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
function UpdateMtStaff() {
  $("#form-issue").empty();
  $("#form-issue").append(`<option value="-">請選擇維護人員</option>`);
  if (mt_staffList) {
    mt_staffList.forEach((item) => {
      $("#form-assign-staff").append(
        `<option value="${item.uuid}">${item.name}</option>`
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
  json_post("../../api/staff/list", { authority_id: 5 }).then((res) => {
    if (res.success && res.data) {
      mt_staffList = res.data;
      UpdateMtStaff();
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

  $(document).on("click", ".assignBtn", function () {
    lastIndex = parseInt($(this).closest("tr").index());
    let workorder_uuid = workOrderData[lastIndex].workorder_uuid;
    let device_type = workOrderData[lastIndex].device_type;
    let device_name = workOrderData[lastIndex].device_name;
    let issue = workOrderData[lastIndex].issue;

    $("#form-wo-id").text(workorder_uuid);
    $("#form-device-type").text(device_type);
    $("#form-device").text(device_name);
    $("#form-issue").text(issue);
    $("#form-assign").css("display", "block");
    $("#overlay").css("display", "block");
  });

  $(document).on("click", "#add_workorder", function () {
    $("#overlay").css("display", "block");
    $("#form-report").css("display", "block");
  });
  $(document).on("click", "#form-assign .confirmBtn", function () {
    if ($("#form-assign-staff").val() == "-") {
      showTooltip("#assign-tooltip", "請選擇維護人員");
      return;
    }
    if ($("#form-deadline").val() == "") {
      showTooltip("#deadline-tooltip", "請選擇截止日期");
      return;
    }
    let obj = {
      uuid: $("#form-wo-id").text(),
      maintenance_staff: $("#form-assign-staff").val(),
      state: 2,
      deadline: convertToUnixTimestamp($("#form-deadline").val()),
      assign_ts: new Date().getTime(),
    };
    console.log(obj);

    json_post("../../api/workorder/update", obj).then((res) => {
      console.log(res);
      if (res.success) {
        systemMsg("指派成功!");
        table_update();
        $("#overlay").css("display", "none");
        $("#form-assign").css("display", "none");
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
