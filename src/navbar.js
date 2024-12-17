document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar-nav");
  const horiSelector = document.querySelector(".hori-selector");
  const navItems = navbar.querySelectorAll(".nav-item");

  function setActiveNav(item) {
    // 移除所有項目的 active 類名
    navItems.forEach((nav) => nav.classList.remove("active"));
    item.classList.add("active");

    // 計算 hori-selector 的位置和寬度
    const itemRect = item.getBoundingClientRect();
    const navbarRect = navbar.getBoundingClientRect();

    horiSelector.style.top = `${itemRect.top - navbarRect.top}px`;
    horiSelector.style.left = `${itemRect.left - navbarRect.left}px`;
    horiSelector.style.width = `${itemRect.width}px`;
    horiSelector.style.height = `${itemRect.height}px`;
  }

  // 設置初始狀態
  setActiveNav(navItems[0]);

  // 為每個 nav-item 添加點擊事件
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      setActiveNav(item);
    });
  });

  // 在視窗大小變化時重新計算位置
  window.addEventListener("resize", () => {
    const activeItem = document.querySelector(".nav-item.active");
    if (activeItem) {
      setActiveNav(activeItem);
    }
  });
});
