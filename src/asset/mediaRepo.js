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
async function uploadImage(url, formData, additionalData) {
  for (let key in additionalData) {
    if (additionalData.hasOwnProperty(key)) {
      formData.append(key, additionalData[key]);
    }
  }

  $.ajax({
    url: url,
    type: "POST",
    data: formData,
    contentType: false,
    processData: false,
    success: function (response) {
      imageTable_update();
      systemMsg("上傳成功！");
    },
    error: function (xhr, status, error) {
      systemMsg("上傳失敗，請重試！");
    },
  });
}
// 修改 uploadGLB 函數
async function uploadGLB(url, formData) {
  return $.ajax({
    url: url,
    type: "POST",
    data: formData,
    contentType: false,
    processData: false,
    success: function (response) {
      modelTable_update(); // 更新表格或其他視圖
      systemMsg("GLB 上傳成功！");
    },
    error: function (xhr, status, error) {
      throw new Error("上傳失敗");
    },
  });
}
function generateModelTable(data) {
  var table = document.createElement("table");
  table.classList.add("table-all");

  // 創建表頭
  var header = table.createTHead();
  var row = header.insertRow();
  row.classList.add("table-header");
  var headers = ["#", "模型", "名字", "功能"];
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
      const infoArr = [i + 1, "model", data[i].name];
      row.insertCell().innerHTML = infoArr[0];

      var imageCell = row.insertCell(); // 圖片
      imageCell.id = data[i].model_uuid;
      row.insertCell().innerHTML = infoArr[2];

      var funcCell = row.insertCell(); // 功能列

      // 查看按鈕
      var viewBtn = document.createElement("div");
      viewBtn.classList.add("funcBtn", "viewBtn");
      viewBtn.innerHTML = `<i class="fas fa-eye"></i>查看`;

      // 編輯按鈕
      var editBtn = document.createElement("div");
      editBtn.classList.add("funcBtn", "editBtn");
      editBtn.innerHTML = `<i class="fas fa-edit"></i>編輯`;

      // 刪除按鈕
      var delBtn = document.createElement("div");
      delBtn.classList.add("funcBtn", "delBtn");
      delBtn.innerHTML = `<i class="fas fa-trash"></i>刪除`;

      funcCell.appendChild(viewBtn);
      funcCell.appendChild(editBtn);
      funcCell.appendChild(delBtn);
    }
  }

  // 創建表尾
  var footer = table.createTFoot();
  var footerRow = footer.insertRow();
  var footerCell = footerRow.insertCell();
  footerCell.colSpan = headers.length; // 跨越所有列
  footerCell.classList.add("table-footer");

  document.body.appendChild(table);

  // 顯示圖片
  if (data) {
    data.forEach((item) => {
      if (item.image_uuid) imageShow(item.image_uuid, item.image_url);
    });
  }

  return table;
}
function generateImageTable(data) {
  var table = document.createElement("table");
  table.classList.add("table-all");

  // 創建表頭
  var header = table.createTHead();
  var row = header.insertRow();
  row.classList.add("table-header");
  var headers = ["#", "圖片", "名字", "功能"];
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
      const infoArr = [i + 1, "img", data[i].name];
      row.insertCell().innerHTML = infoArr[0];

      var imageCell = row.insertCell(); // 圖片
      imageCell.id = data[i].image_uuid;
      row.insertCell().innerHTML = infoArr[2];

      var funcCell = row.insertCell(); // 功能列

      // 查看按鈕
      var viewBtn = document.createElement("div");
      viewBtn.classList.add("funcBtn", "viewBtn");
      viewBtn.innerHTML = `<i class="fas fa-eye"></i>查看`;

      // 編輯按鈕
      var editBtn = document.createElement("div");
      editBtn.classList.add("funcBtn", "editBtn");
      editBtn.innerHTML = `<i class="fas fa-edit"></i>編輯`;

      // 刪除按鈕
      var delBtn = document.createElement("div");
      delBtn.classList.add("funcBtn", "delBtn");
      delBtn.innerHTML = `<i class="fas fa-trash"></i>刪除`;

      funcCell.appendChild(viewBtn);
      funcCell.appendChild(editBtn);
      funcCell.appendChild(delBtn);
    }
  }

  // 創建表尾
  var footer = table.createTFoot();
  var footerRow = footer.insertRow();
  var footerCell = footerRow.insertCell();
  footerCell.colSpan = headers.length; // 跨越所有列
  footerCell.classList.add("table-footer");

  // Footer 內容
  // var footerControls = document.createElement("div");
  // footerControls.classList.add("footer-controls");

  // var prevBtn = document.createElement("button");
  // prevBtn.classList.add("funcBtn");
  // prevBtn.innerText = "上一頁";

  // var nextBtn = document.createElement("button");
  // nextBtn.classList.add("funcBtn");
  // nextBtn.innerText = "下一頁";

  // footerControls.appendChild(prevBtn);
  // footerControls.appendChild(nextBtn);
  // footerCell.appendChild(footerControls);

  document.body.appendChild(table);

  // 顯示圖片
  if (data) {
    data.forEach((item) => {
      if (item.image_uuid) imageShow(item.image_uuid, item.image_url);
    });
  }

  return table;
}
function imageShow(containerId, url, fit = false) {
  const imagePaths = `/media/mediaRepo/${url}`;
  const gallery = document.getElementById(containerId);
  if (!gallery) {
    console.error(`Container with ID "${containerId}" not found.`);
    return;
  }

  // 清空容器內的內容（避免多次添加圖片）
  gallery.innerHTML = "";

  const img = document.createElement("img");
  img.src = imagePaths;
  img.alt = "Image";

  // 設置圖片樣式
  img.style.width = fit ? "100%" : "auto"; /* 寬度填滿容器或自適應 */
  img.style.height = fit ? "auto" : "100px"; /* 高度保持比例或固定值 */
  img.style.maxWidth = "100%"; /* 圖片不超過容器寬度 */
  img.style.maxHeight = "100%"; /* 圖片不超過容器高度 */
  img.style.objectFit = fit
    ? "contain"
    : "initial"; /* 確保圖片完全顯示且不變形 */
  img.style.margin = "5px 0"; /* 上下邊距 */

  gallery.appendChild(img);
}
function systemMsg(text) {
  $("#overlay").css("display", "block");
  $("#form-sysMsg").css("display", "block");
  $("#sys-msg-text").text(text);
}

let imageData = [];
let modelData = [];
let lastIndex_image = null;
let lastIndex_model = null;
function imageTable_update() {
  json_post("../../api/image/list", {}).then((res) => {
    console.log(res);
    if (res.success) {
      imageData = res.data;
      $("#image_table").empty();
      $("#image_table").append(generateImageTable(imageData));
    }
  });
}
function modelTable_update() {
  json_post("../../api/model/list", {}).then((res) => {
    console.log(res);
    if (res.success) {
      modelData = res.data;
      $("#model_table").empty();
      $("#model_table").append(generateModelTable(modelData));
    }
  });
}
$(document).ready(function () {
  // 圖片初始化
  imageTable_update();

  $("#upload_image").on("click", function () {
    $("#image_input").click();
  });

  $("#image_input").on("change", function () {
    var file = this.files[0];
    if (file) {
      var formData = new FormData();
      formData.append("image", file);
      uploadImage("../../file/image/upload", formData).then((res) => {
        $("#image_input").val("");
      });
    }
  });

  // 模型初始話
  modelTable_update();

  $("#upload_model").on("click", function () {
    $("#model_input").click();
  });
  $("#model_input").on("change", function () {
    var file = this.files[0];
    if (file) {
      var formData = new FormData();
      formData.append("model", file); // 修改 key 為 "file" 以符合後端設定
      uploadGLB("../../file/model/upload", formData)
        .then((res) => {
          $("#model_input").val(""); // 清空輸入框
        })
        .catch((err) => {
          systemMsg("模型上傳失敗，請重試！");
          $("#model_input").val("");
        });
    }
  });
  $(".closeBtn").on("click", function () {
    $("#overlay").css("display", "none");
    $(this).closest(".form-container").css("display", "none");
    $("#edit-name").val("");
  });

  $(document).on("mouseenter", "#image_table .table-all tbody tr", function () {
    let index = parseInt($(this).children("td").eq(0).text()) - 1;
    $("#image-show").empty();
    let src = $(this).children("td").eq(1).find("img").attr("src");
    if (src) {
      imageShow("image-show", imageData[index].image_url, true);
    }
  });
  $(document).on("mouseleave", "#image_table .table-all tbody tr", function () {
    $("#image-show").empty();
  });

  // 圖片查看
  $(document).on("click", ".viewBtn", function () {
    lastIndex_image =
      parseInt($(this).closest("tr").find("td").eq(0).text()) - 1;
    let obj = imageData[lastIndex_image];

    $("#image-view-show").empty();
    if (lastIndex_image != null) {
      imageShow("image-view-show", obj.image_url, true);
    }
    $("#image-view-header").text(obj.name);
    $("#overlay").css("display", "block");
    $("#image-view").css("display", "block");
  });
  // 圖片編輯
  $(document).on("click", ".editBtn", function () {
    lastIndex_image =
      parseInt($(this).closest("tr").find("td").eq(0).text()) - 1;
    $("#overlay").css("display", "block");
    $("#form-edit").css("display", "block");
  });
  // 圖片刪除
  $(document).on("click", ".delBtn", function () {
    lastIndex_image =
      parseInt($(this).closest("tr").find("td").eq(0).text()) - 1;
    $("#overlay").css("display", "block");
    $("#form-delete").css("display", "block");
  });
  $(document).on("click", "#form-edit .confirmBtn", function () {
    if (lastIndex_image != null) {
      let obj = imageData[lastIndex_image];
      obj.name = $("#edit-name").val();

      if (!obj.name) {
        console.log("請輸入名字");
        $("#name-tooltip").fadeIn();
        setTimeout(() => {
          $("#name-tooltip").fadeOut();
        }, 2000);
        return;
      }
      json_post("../../api/image/update", obj).then((res) => {
        console.log(res);
        if (res.success) {
          systemMsg("名字更改成功!");
          imageData[lastIndex_image].name = $("#edit-name").val();
          imageTable_update();
          $("#overlay").css("display", "none");
          $("#form-edit").css("display", "none");
          $("#edit-name").val("");
        } else {
          systemMsg("更改失敗, 系統異常!");
        }
      });
    }
  });

  $(document).on("click", "#form-delete .confirmBtn", function () {
    if (lastIndex_image != null) {
      let obj = imageData[lastIndex_image];

      json_post("../../file/image/delete", obj).then((res) => {
        if (res.success) {
          systemMsg("已成功刪除圖片!");
        } else {
          systemMsg("更改失敗, 系統異常!");
        }
        imageTable_update();
      });
      $("#form-delete").css("display", "none");
    }
  });
});
