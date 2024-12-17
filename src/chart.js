$(async function () {
  // global variable
  let donutChartCanvas, donutData, donutOptions; // 圖表1
  var donutChart = null;
  let lineChartCanvas, lineChartData, lineChartOptions; // 圖表2
  var lineChart = null;
  let stackedBarChartCanvas, stackedBarChartData, stackedBarChartOptions; // 圖表3
  var stackedBarChart = null;
  let barChartCanvas, barChartData, barChartOptions; // 圖表4
  var barChart = null;
  let currentYear = new Date().getFullYear(); // 今年
  let currentMonth = new Date().getMonth() + 1; // 本月
  let currentDate = new Date().getDate(); // 今日
  let currentDay = new Date().getDay(); // 星期幾
  console.log({ currentYear, currentMonth, currentDate, currentDay });
  // 初始化
  let categoryList = [];
  let categoryObj = {};
  let faultList = {};
  let chartData = {};
  let locationList = [];
  let locationObj = {};
  dom_listen_init();
  await json_post("../api/ams/category/list", {}).then((res) => {
    if (res.success && res.data) {
      for (let i in res.data) {
        // categoryList[res.data[i].id] = res.data[i].name;
        categoryList.push(res.data[i].name);
        categoryObj[res.data[i].id] = res.data[i].name;
      }
    }
  });
  await json_post("../api/ams/fault/list", {}).then((res) => {
    if (res.success && res.data) {
      for (let i in res.data) {
        let obj = {};
        faultList[res.data[i].type] = res.data[i].fault_name;
      }
    }
  });
  await json_post("../api/ams/device/location/list", {}).then((res) => {
    if (res.success && res.data) {
      for (let i in res.data) {
        locationList.push(res.data[i].location);
        locationObj[res.data[i]] = i;
      }
    }
  });

  let monthsOfYear = [];
  for (let i = 1; i <= 12; i++) monthsOfYear.push(`${i}月`);

  // 資料處理
  function obj2Arr(data) {
    let res = [];
    for (let i = 1; i <= 12; i++) res.push(data[i] ? data[i] : 0);
    return res;
  }
  function chartDataDealer1(init = false) {
    let res = [];

    let obj = {
      data: init ? Array(categoryList.length).fill(0) : chartData[1].value,
      backgroundColor: [
        "#f56954", // 紅色
        "#00a65a", // 綠色
        "#f39c12", // 橙色
        "#00c0ef", // 淺藍色
        "#3c8dbc", // 藍色
        "#d2d6de", // 淺灰色
        "#605ca8", // 紫色
        "#ff851b", // 深橙色
        "#39cccc", // 青色
        "#001f3f", // 深藍色
        "#85144b", // 酒紅色
        "#b10dc9", // 深紫色
        "#2ecc40", // 明亮綠色
        "#ffdc00", // 黃色
        "#ff4136", // 番茄紅
      ],
    };
    res.push(obj);
    return res;
  }
  function chartDataDealer2(type = 0) {
    let res = [];
    let color = [
      {
        backgroundColor: "rgba(60,141,188,0.9)", // 藍色
        borderColor: "rgba(60,141,188,0.8)",
        pointColor: "#3b8bba",
        pointStrokeColor: "rgba(60,141,188,1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(60,141,188,1)",
      },
      {
        backgroundColor: "rgba(210, 214, 222, 1)", // 淺灰色
        borderColor: "rgba(210, 214, 222, 1)",
        pointColor: "rgba(210, 214, 222, 1)",
        pointStrokeColor: "#c1c7d1",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
      },
      {
        backgroundColor: "rgba(245, 105, 84, 0.9)", // 紅色
        borderColor: "rgba(245, 105, 84, 0.8)",
        pointColor: "#f56954",
        pointStrokeColor: "rgba(245, 105, 84, 1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(245, 105, 84, 1)",
      },
      {
        backgroundColor: "rgba(0, 166, 90, 0.9)", // 綠色
        borderColor: "rgba(0, 166, 90, 0.8)",
        pointColor: "#00a65a",
        pointStrokeColor: "rgba(0, 166, 90, 1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(0, 166, 90, 1)",
      },
      {
        backgroundColor: "rgba(243, 156, 18, 0.9)", // 橙色
        borderColor: "rgba(243, 156, 18, 0.8)",
        pointColor: "#f39c12",
        pointStrokeColor: "rgba(243, 156, 18, 1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(243, 156, 18, 1)",
      },
      {
        backgroundColor: "rgba(0, 192, 239, 0.9)", // 天藍色
        borderColor: "rgba(0, 192, 239, 0.8)",
        pointColor: "#00c0ef",
        pointStrokeColor: "rgba(0, 192, 239, 1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(0, 192, 239, 1)",
      },
      {
        backgroundColor: "rgba(96, 92, 168, 0.9)", // 紫色
        borderColor: "rgba(96, 92, 168, 0.8)",
        pointColor: "#605ca8",
        pointStrokeColor: "rgba(96, 92, 168, 1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(96, 92, 168, 1)",
      },
      {
        backgroundColor: "rgba(255, 193, 7, 0.9)", // 黃色
        borderColor: "rgba(255, 193, 7, 0.8)",
        pointColor: "#ffc107",
        pointStrokeColor: "rgba(255, 193, 7, 1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(255, 193, 7, 1)",
      },
    ];
    let label;
    switch (type) {
      case 0:
        label = categoryList;
        break;
      case 1:
        label = chartData[2].category;
        break;
      case 2:
        label = chartData[2].location;
        break;
    }
    let colorLength = color.length;

    for (let i = 0; i < label.length; i++) {
      let category = label[i];
      let location = label[i];
      let data;

      switch (type) {
        case 0:
          data = Array(12).fill(0);
          break;
        case 1:
          data = obj2Arr(chartData[2][category]);
          break;
        case 2:
          data = obj2Arr(chartData[2][location]);
          break;
      }
      let obj = {
        label: category,
        backgroundColor: color[i % colorLength].backgroundColor,
        borderColor: color[i % colorLength].borderColor,
        pointRadius: false,
        pointColor: color[i % colorLength].pointColor,
        pointStrokeColor: color[i % colorLength].pointStrokeColor,
        pointHighlightFill: color[i % colorLength].pointHighlightFill,
        pointHighlightStroke: color[i % colorLength].pointHighlightStroke,
        data: data,
      };
      res.push(obj);
    }
    return res;
  }
  function chartDataDealer3(init = false) {
    let res = [];
    let color = [
      {
        backgroundColor: "rgba(255, 99, 132, 0.9)", // 粉紅色
        borderColor: "rgba(255, 99, 132, 0.8)", // 粉紅色
      },
      {
        backgroundColor: "rgba(54, 162, 235, 0.9)", // 藍色
        borderColor: "rgba(54, 162, 235, 0.8)", // 藍色
      },
      {
        backgroundColor: "rgba(255, 206, 86, 0.9)", // 黃色
        borderColor: "rgba(255, 206, 86, 0.8)", // 黃色
      },
      {
        backgroundColor: "rgba(75, 192, 192, 0.9)", // 青綠色
        borderColor: "rgba(75, 192, 192, 0.8)", // 青綠色
      },
      {
        backgroundColor: "rgba(153, 102, 255, 0.9)", // 紫色
        borderColor: "rgba(153, 102, 255, 0.8)", // 紫色
      },
      {
        backgroundColor: "rgba(255, 159, 64, 0.9)", // 橙色
        borderColor: "rgba(255, 159, 64, 0.8)", // 橙色
      },
    ];
    let colorLength = color.length;
    let fal = init ? faultList : chartData[3].fault;
    for (let i = 0; i < fal.length; i++) {
      let obj = {
        label: fal[i],
        backgroundColor: color[i % colorLength].backgroundColor,
        borderColor: color[i % colorLength].borderColor,
        // data: [chartData[3].data[chartData[3].category[0]], null, null, null], // 只在第一個 X 軸位置顯示數據
      };
      let data = [];
      let fault = fal[i];
      let cat = init ? categoryList : chartData[3].category;
      for (let j = 0; j < cat.length; j++) {
        let category = cat[j];
        let value = init
          ? 0
          : chartData[3].data[category][fault]
          ? chartData[3].data[category][fault]
          : 0;
        data.push(value);
      }
      obj.data = data;
      res.push(obj);
    }
    return res;
  }
  function chartDataDealer4(init = false, type = 0) {
    let res = [];
    let color = [
      {
        backgroundColor: "rgba(210, 214, 222, 1)",
        borderColor: "rgba(210, 214, 222, 1)",
        pointColor: "rgba(210, 214, 222, 1)",
        pointStrokeColor: "#c1c7d1",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
      },
      {
        backgroundColor: "rgba(60,141,188,0.9)",
        borderColor: "rgba(60,141,188,0.8)",
        pointColor: "#3b8bba",
        pointStrokeColor: "rgba(60,141,188,1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(60,141,188,1)",
      },
    ];
    let colorLength = color.length;
    let cat;
    switch (type) {
      case 0:
        cat = categoryList;
        break;
      case 1:
        cat = chartData[4].category;
        break;
      case 2:
        cat = chartData[4].location;
        break;
    }

    for (let i = 0; i < cat.length; i++) {
      let category = cat[i];
      let data;
      switch (type) {
        case 0:
          data = Array(12).fill(0);
          break;
        case 1:
          data = chartData[4][category]
            ? obj2Arr(chartData[4][category])
            : Array(12).fill(0);
          break;
        case 2:
          data = chartData[4][category]
            ? obj2Arr(chartData[4][category])
            : Array(12).fill(0);
          break;
      }
      let obj = {
        label: category,
        backgroundColor: color[i % colorLength].backgroundColor,
        borderColor: color[i % colorLength].borderColor,
        pointRadius: false,
        pointColor: color[i % colorLength].pointColor,
        pointStrokeColor: color[i % colorLength].pointStrokeColor,
        pointHighlightFill: color[i % colorLength].pointHighlightFill,
        pointHighlightStroke: color[i % colorLength].pointHighlightStroke,
        data: data,
      };
      res.push(obj);
    }
    return res;
  }

  hideChart();
  showChart({ init: true, type: 0 });
  function showChart({ init = false, type = 0 }) {
    const yAxisTicks = init
      ? {
          beginAtZero: true,
          max: 5,
          stepSize: 1,
          callback: (value) => (Number.isInteger(value) ? value : null),
        } // init 為 true 時設置範圍 0-5
      : {
          beginAtZero: true,
          callback: (value) => (Number.isInteger(value) ? value : null),
        }; // init 為 false 時不設置範圍上限

    let label;
    /* 設備維修比例(圖表1) */
    switch (type) {
      case 0:
        label = categoryList;
        break;
      case 1:
        label = chartData[1].category;
        break;
      case 2:
        label = chartData[1].location;
        break;
    }
    donutChartCanvas = $("#donutChart").get(0).getContext("2d");
    donutData = {
      labels: label,
      datasets: chartDataDealer1(type == 0),
    };
    donutOptions = {
      maintainAspectRatio: false,
      responsive: true,
    };
    if (donutChart != null) {
      donutChart.destroy();
    }
    donutChart = new Chart(donutChartCanvas, {
      type: "doughnut",
      data: donutData,
      options: donutOptions,
    });

    /* 設備維修頻率(圖表2) */
    switch (type) {
      case 0:
        label = categoryList;
        break;
      case 1:
        label = chartData[2].category;
        break;
      case 2:
        label = chartData[2].location;
        break;
    }
    lineChartCanvas = $("#lineChart").get(0).getContext("2d");
    lineChartData = {
      labels: monthsOfYear,
      datasets: chartDataDealer2(type).map((dataset) => ({
        ...dataset,
        fill: false, // 禁用面積填充
      })),
    };
    lineChartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        yAxes: [
          {
            ticks: yAxisTicks, // 使用上方根據 init 設置的 y 軸刻度選項
          },
        ],
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
      },
    };
    lineChartOptions.datasetFill = false;
    if (lineChart != null) {
      lineChart.destroy();
    }
    lineChart = new Chart(lineChartCanvas, {
      type: "line",
      data: lineChartData,
      options: lineChartOptions,
    });

    /* 設備維修頻率(圖表3) */
    stackedBarChartCanvas = $("#stackedBarChart").get(0).getContext("2d");

    stackedBarChartData = {
      labels: init ? categoryList : chartData[3].category,
      datasets: chartDataDealer3(init),
    };

    stackedBarChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            stacked: true,
          },
        ],
        yAxes: [
          {
            stacked: true,
            ticks: yAxisTicks, // 使用相同的 y 軸刻度選項
          },
        ],
      },
      legend: {
        display: true,
      },
    };
    if (stackedBarChart != null) {
      stackedBarChart.destroy();
    }
    stackedBarChart = new Chart(stackedBarChartCanvas, {
      type: "bar",
      data: stackedBarChartData,
      options: stackedBarChartOptions,
    });

    /* 設備維修頻率(圖表4) */
    barChartCanvas = $("#barChart").get(0).getContext("2d");
    barChartData = {
      labels: monthsOfYear,
      datasets: chartDataDealer4(init, type),
    };
    barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      datasetFill: false,
      scales: {
        yAxes: [
          {
            ticks: yAxisTicks, // 使用相同的 y 軸刻度選項
          },
        ],
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
      },
    };
    if (barChart != null) {
      barChart.destroy();
    }
    barChart = new Chart(barChartCanvas, {
      type: "bar",
      data: barChartData,
      options: barChartOptions,
    });
  }
  function hideChart() {
    $("#chart-container1 .fa-minus")
      .removeClass("fa-minus")
      .addClass("fa-plus");
    $("#chart-container1 .card-body").hide();
    $("#chart-container2 .fa-minus")
      .removeClass("fa-minus")
      .addClass("fa-plus");
    $("#chart-container2 .card-body").hide();
    $("#chart-container3 .fa-minus")
      .removeClass("fa-minus")
      .addClass("fa-plus");
    $("#chart-container3 .card-body").hide();
    $("#chart-container4 .fa-minus")
      .removeClass("fa-minus")
      .addClass("fa-plus");
    $("#chart-container4 .card-body").hide();
  }
  function expandChart() {
    $("#chart-container1 .fa-plus").removeClass("fa-plus").addClass("fa-minus");
    $("#chart-container1 .card-body").show();
    $("#chart-container2 .fa-plus").removeClass("fa-plus").addClass("fa-minus");
    $("#chart-container2 .card-body").show();
    $("#chart-container3 .fa-plus").removeClass("fa-plus").addClass("fa-minus");
    $("#chart-container3 .card-body").show();
    $("#chart-container4 .fa-plus").removeClass("fa-plus").addClass("fa-minus");
    $("#chart-container4 .card-body").show();
  }

  $(document).on("click", "#search_button", async function () {
    // 查詢資料庫統計
    hideChart();
    expandChart();
    let endts = new Date($("#time_end").val());
    let mouth_end = new Date(
      endts.getFullYear(),
      endts.getMonth() + 1,
      0
    ).getDate();
    let time_end = $("#time_end").val()
      ? `${$("#time_end").val()}-${mouth_end}`
      : `${new Date().getFullYear()}/12/31`;
    let time_start =
      `${$("#time_start").val()}-01` || `${new Date().getFullYear()}/1/1`;
    if (time_start > time_end) {
      system_msg("請填入合理的起迄時間", false);
      return;
    }
    let type = parseInt($("#services_unit1_select").val());
    udpate_Chart_title({
      tsRange: [time_start, time_end],
      class: $("#services_unit1_select").val() * 1,
    });
    await json_post("../api/ams/statistics/chart", {
      type,
      time_start,
      time_end,
    }).then((res) => {
      console.log(res);

      let data = res.data[0]["json_build_object"];
      // 設備維修比例
      chartData[1] = { category: [], value: [], location: [] };
      chartData[2] = { category: [], location: [] };
      chartData[3] = {
        category: [],
        location: [],
        fault: [],
        value: [],
        data: {},
      };
      chartData[4] = { category: [], location: [] };
      // 圖表1
      for (let i in data.workorder_device_info) {
        let category, location;
        if (type == 1)
          category = categoryObj[data.workorder_device_info[i].category_id];
        else if (type == 2) location = data.workorder_device_info[i].location;

        let value = data.workorder_device_info[i].workorder_count;
        //   chartData[1][category] = value;
        chartData[1].category.push(category);
        chartData[1].location.push(location);
        chartData[1].value.push(value);
      }
      // 圖表2
      for (let i in data.mouth_count) {
        let category, location;
        let month = data.mouth_count[i].report_month.split("-")[1];
        let value = data.mouth_count[i].count;
        switch (type) {
          case 1:
            category = categoryObj[data.mouth_count[i].category_id];
            if (!chartData[2][category]) {
              chartData[2][category] = {};
              chartData[2].category.push(category);
            }
            chartData[2][category][month] = value;
            break;
          case 2:
            location = data.mouth_count[i].location;
            if (!chartData[2][location]) {
              chartData[2][location] = {};
              chartData[2].location.push(location);
            }
            chartData[2][location][month] = value;
            break;
        }
      }
      // 圖表3
      for (let i in data.fault_static) {
        let category, location;
        let fault = faultList[data.fault_static[i].report_issue];
        let value = data.fault_static[i].count;
        switch (type) {
          case 1:
            category = categoryObj[data.fault_static[i].category_id];
            chartData[3].data[category] ||= {};
            chartData[3].data[category][fault] ||= 0;
            chartData[3].data[category][fault] += value;

            if (!chartData[3].category.includes(category))
              chartData[3].category.push(category);
            if (!chartData[3].fault.includes(fault))
              chartData[3].fault.push(fault);
            chartData[3].value.push(value);
            break;
          case 2:
            location = data.fault_static[i].location;
            chartData[3].data[location] ||= {};
            chartData[3].data[location][fault] ||= 0;
            chartData[3].data[location][fault] += value;

            if (!chartData[3].category.includes(location))
              chartData[3].category.push(location);
            if (!chartData[3].fault.includes(fault))
              chartData[3].fault.push(fault);
            chartData[3].value.push(value);
            break;
        }
      }
      // 圖表4
      console.log(data.avg_repair_time);

      for (let i in data.avg_repair_time) {
        let category, location;
        let day = Math.ceil(
          data.avg_repair_time[i].repair_duration / (1000 * 60 * 60 * 24)
        );
        let month = data.avg_repair_time[i].report_month.split("-")[1];
        let value = data.avg_repair_time[i].repair_duration;
        switch (type) {
          case 1:
            category = categoryObj[data.avg_repair_time[i].category_id];
            if (!chartData[4][category]) {
              chartData[4][category] = {};
              chartData[4].category.push(category);
            }
            chartData[4][category][month] = day;
            break;
          case 2:
            location = data.avg_repair_time[i].location;
            if (!chartData[4][location]) {
              chartData[4][location] = {};
              chartData[4].location.push(location);
            }
            chartData[4][location][month] = day;
            break;
        }
      }
    });
    showChart({ init: false, type });
  });

  $(document).on("click", "#clear_button", function () {
    hideChart();
    showChart({ init: true, type: 0 });
  });
});

async function json_post(url, data) {
  var jxhr = $.ajax({
    url: url,
    type: "POST",
    dataType: "json",
    contentType: "application/json;charset=utf-8",
    data: JSON.stringify(data),
    timeout: 25 * 1000,
    xhrFields: {
      withCredentials: true,
    },
    crossDomaina: true,
  });
  return jxhr;
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

function system_msg(text, reload = false, confirmBtn = false) {
  $("#warn_text").text(text);

  let btnObj = {
    確定: function () {
      $(this).dialog("close");
      $(".blank").css("display", "none");
      if (reload) window.location.reload();
    },
    關閉: function () {
      $(this).dialog("close");
      $(".blank").css("display", "none");
      if (reload) window.location.reload();
    },
  };
  if (!confirmBtn) delete btnObj["確定"];

  $("#warn_dialog").dialog({
    closeOnEscape: false,
    dialogClass: "dlg-no-close",
    show: "fade",
    draggable: false,
    modal: true,
    resizable: false,
    buttons: btnObj,
  });
}

function udpate_Chart_title(data) {
  let text = "";
  text = `${data.tsRange[0]}-${data.tsRange[1]} `;
  switch (data.class) {
    case 1:
      text += `設備類型`;
      break;
    case 2:
      text += `設備位置`;
      break;
  }
  $("#chart-container1 .card-title").text(`${text}維修比例`);
  $("#chart-container2 .card-title").text(`${text}維修頻率`);
  $("#chart-container3 .card-title").text(`${text}故障類型`);
  $("#chart-container4 .card-title").text(`${text}平均修復時間`);
}

function dom_listen_init() {
  date_init();
  function date_init() {
    $("#time_start").val(`${new Date().getFullYear()}-01`);
    $("#time_end").val(`${new Date().getFullYear()}-12`);
    $("#time_start").attr("max", $("#time_end").val());
    $("#time_start").attr("min", $("#time_start").val());
    $("#time_end").attr("max", $("#time_end").val());
    $("#time_end").attr("min", $("#time_start").val());
    $("#time_start").on("change", function () {
      cal_date_max_min();
    });
    $("#time_end").on("change", function () {
      cal_date_max_min();
    });

    function cal_date_max_min() {
      let max_ts = new Date($("#time_start").val()).getMonth() + 1 + 12;
      max_ts =
        max_ts > 12
          ? `${new Date($("#time_start").val()).getFullYear() + 1}-${
              max_ts - 12
            }`
          : `${new Date($("#time_start").val()).getFullYear()}-${max_ts}`;
      max_ts =
        max_ts.split("-")[1] < 10
          ? `${max_ts.split("-")[0]}-0${max_ts.split("-")[1]}`
          : max_ts;
      let min_ts = new Date($("#time_end").val()).getMonth() - 11;
      min_ts =
        min_ts < 1
          ? `${new Date($("#time_end").val()).getFullYear() - 1}-${12 + min_ts}`
          : `${new Date($("#time_end").val()).getFullYear()}-${min_ts}`;
      min_ts =
        min_ts.split("-")[1] < 10
          ? `${min_ts.split("-")[0]}-0${min_ts.split("-")[1]}`
          : min_ts;
      $("#time_start").attr("max", max_ts);
      $("#time_start").attr("min", min_ts);
      $("#time_end").attr("max", max_ts);
      $("#time_end").attr("min", min_ts);

      let endts = new Date($("#time_end").val());
      let mouth_end = new Date(
        endts.getFullYear(),
        endts.getMonth() + 1,
        0
      ).getDate();
      let time_end = $("#time_end").val()
        ? `${$("#time_end").val()}-${mouth_end}`
        : `${new Date().getFullYear()}-12-31`;
      let time_start =
        `${$("#time_start").val()}-01` || `${new Date().getFullYear()}-01-01`;
      udpate_Chart_title({
        tsRange: [time_start, time_end],
        class: $("#services_unit1_select").val() * 1,
      });
    }
  }
}
