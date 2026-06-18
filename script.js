// 等待页面结构加载完成后再绑定事件，避免找不到元素。
document.addEventListener("DOMContentLoaded", function () {
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"], .hero-actions a[href^="#"], .logo');
  var backToTopButton = document.querySelector(".back-to-top");

  // 点击导航链接时，平滑滚动到对应区域。
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var targetId = link.getAttribute("href");
      var targetElement = document.querySelector(targetId);

      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // 页面向下滚动一段距离后显示“返回顶部”按钮。
  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  });

  // 点击按钮返回页面顶部。
  backToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});
