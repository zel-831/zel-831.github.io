// 页面加载完成后再绑定事件，确保所有元素都已经存在。
document.addEventListener("DOMContentLoaded", function () {
  var scrollLinks = document.querySelectorAll(".js-scroll");
  var sectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  var backToTopButton = document.querySelector(".back-to-top");
  var menuToggle = document.querySelector(".menu-toggle");
  var navLinks = document.querySelector(".nav-links");
  var sections = Array.prototype.map.call(sectionLinks, function (link) {
    return document.querySelector(link.getAttribute("href"));
  });

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

  // 滚动时更新返回顶部按钮和当前导航高亮。
  function handleScroll() {
    if (backToTopButton) {
      if (window.scrollY > 420) {
        backToTopButton.classList.add("show");
      } else {
        backToTopButton.classList.remove("show");
      }
    }

    sections.forEach(function (section, index) {
      if (!section) {
        return;
      }

      var rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        sectionLinks.forEach(function (link) {
          link.classList.remove("is-active");
        });
        sectionLinks[index].classList.add("is-active");
      }
    });
  }

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  if (backToTopButton) {
    backToTopButton.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && navLinks && menuToggle) {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});
