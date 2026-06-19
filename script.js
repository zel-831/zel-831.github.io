// 页面加载完成后再绑定事件，确保所有元素都已经存在。
document.addEventListener("DOMContentLoaded", function () {
  var scrollLinks = document.querySelectorAll(".js-scroll");
  var backToTopButton = document.querySelector(".back-to-top");
  var menuToggle = document.querySelector(".menu-toggle");
  var navLinks = document.querySelector(".nav-links");

  // 点击导航或按钮时，平滑滚动到对应区域。
  scrollLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var targetId = link.getAttribute("href");
      var targetElement = document.querySelector(targetId);

      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

        if (navLinks) {
          navLinks.classList.remove("is-open");
        }

        if (menuToggle) {
          menuToggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  });

  // 手机端导航菜单开关。
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // 页面向下滚动一段距离后显示返回顶部按钮。
  if (backToTopButton) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 420) {
        backToTopButton.classList.add("show");
      } else {
        backToTopButton.classList.remove("show");
      }
    });

    backToTopButton.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});
