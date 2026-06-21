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

  function initialize1024Game() {
    var boardElement = document.querySelector("#game-board");
    if (!boardElement) {
      return;
    }

    var scoreElement = document.querySelector("#game-score");
    var bestElement = document.querySelector("#game-best");
    var statusElement = document.querySelector("#game-status");
    var restartButton = document.querySelector("#game-restart");
    var controlButtons = document.querySelectorAll("[data-move]");
    var boardSize = 4;
    var targetValue = 1024;
    var storageKey = "homepage-1024-best";
    var board = [];
    var score = 0;
    var bestScore = readBestScore();
    var reachedTarget = false;
    var touchStartX = 0;
    var touchStartY = 0;

    function readBestScore() {
      try {
        return Number(window.localStorage.getItem(storageKey)) || 0;
      } catch (error) {
        return 0;
      }
    }

    function saveBestScore() {
      try {
        window.localStorage.setItem(storageKey, String(bestScore));
      } catch (error) {
        return;
      }
    }

    function createEmptyBoard() {
      var nextBoard = [];
      for (var row = 0; row < boardSize; row += 1) {
        var nextRow = [];
        for (var column = 0; column < boardSize; column += 1) {
          nextRow.push(0);
        }
        nextBoard.push(nextRow);
      }
      return nextBoard;
    }

    function serializeBoard(boardData) {
      return boardData.map(function (row) {
        return row.join(",");
      }).join(";");
    }

    function getEmptyCells() {
      var cells = [];
      for (var row = 0; row < boardSize; row += 1) {
        for (var column = 0; column < boardSize; column += 1) {
          if (board[row][column] === 0) {
            cells.push({
              row: row,
              column: column
            });
          }
        }
      }
      return cells;
    }

    function addRandomTile() {
      var emptyCells = getEmptyCells();
      if (emptyCells.length === 0) {
        return;
      }

      var cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[cell.row][cell.column] = Math.random() < 0.9 ? 2 : 4;
    }

    function mergeLine(line) {
      var values = line.filter(function (value) {
        return value > 0;
      });
      var merged = [];
      var gained = 0;

      for (var index = 0; index < values.length; index += 1) {
        if (values[index] === values[index + 1]) {
          var nextValue = values[index] * 2;
          merged.push(nextValue);
          gained += nextValue;
          index += 1;
        } else {
          merged.push(values[index]);
        }
      }

      while (merged.length < boardSize) {
        merged.push(0);
      }

      return {
        line: merged,
        score: gained
      };
    }

    function getColumn(boardData, column) {
      var values = [];
      for (var row = 0; row < boardSize; row += 1) {
        values.push(boardData[row][column]);
      }
      return values;
    }

    function setColumn(boardData, column, values) {
      for (var row = 0; row < boardSize; row += 1) {
        boardData[row][column] = values[row];
      }
    }

    function slideBoard(direction) {
      var nextBoard = board.map(function (row) {
        return row.slice();
      });
      var gained = 0;

      if (direction === "left" || direction === "right") {
        for (var row = 0; row < boardSize; row += 1) {
          var sourceRow = nextBoard[row].slice();
          if (direction === "right") {
            sourceRow.reverse();
          }

          var rowResult = mergeLine(sourceRow);
          var nextRow = rowResult.line;
          if (direction === "right") {
            nextRow.reverse();
          }

          nextBoard[row] = nextRow;
          gained += rowResult.score;
        }
      }

      if (direction === "up" || direction === "down") {
        for (var column = 0; column < boardSize; column += 1) {
          var sourceColumn = getColumn(nextBoard, column);
          if (direction === "down") {
            sourceColumn.reverse();
          }

          var columnResult = mergeLine(sourceColumn);
          var nextColumn = columnResult.line;
          if (direction === "down") {
            nextColumn.reverse();
          }

          setColumn(nextBoard, column, nextColumn);
          gained += columnResult.score;
        }
      }

      return {
        board: nextBoard,
        score: gained,
        changed: serializeBoard(nextBoard) !== serializeBoard(board)
      };
    }

    function hasTargetTile() {
      for (var row = 0; row < boardSize; row += 1) {
        for (var column = 0; column < boardSize; column += 1) {
          if (board[row][column] >= targetValue) {
            return true;
          }
        }
      }
      return false;
    }

    function hasAvailableMove() {
      if (getEmptyCells().length > 0) {
        return true;
      }

      for (var row = 0; row < boardSize; row += 1) {
        for (var column = 0; column < boardSize; column += 1) {
          var currentValue = board[row][column];
          if (column + 1 < boardSize && currentValue === board[row][column + 1]) {
            return true;
          }
          if (row + 1 < boardSize && currentValue === board[row + 1][column]) {
            return true;
          }
        }
      }

      return false;
    }

    function updateStatus() {
      if (!statusElement) {
        return;
      }

      if (reachedTarget && hasAvailableMove()) {
        statusElement.textContent = "已合成 1024，继续挑战";
      } else if (reachedTarget) {
        statusElement.textContent = "已合成 1024";
      } else if (!hasAvailableMove()) {
        statusElement.textContent = "没有可移动方块";
      } else {
        statusElement.textContent = "合成 1024";
      }
    }

    function renderBoard() {
      boardElement.innerHTML = "";

      for (var row = 0; row < boardSize; row += 1) {
        for (var column = 0; column < boardSize; column += 1) {
          var value = board[row][column];
          var tile = document.createElement("div");
          tile.className = "game-tile" + (value === 0 ? " tile-empty" : "") + (value >= targetValue ? " tile-large" : "");
          tile.setAttribute("role", "gridcell");
          tile.setAttribute("data-value", String(value));
          tile.setAttribute("aria-label", value === 0 ? "空格" : String(value));
          tile.textContent = value === 0 ? "" : String(value);
          boardElement.appendChild(tile);
        }
      }

      if (scoreElement) {
        scoreElement.textContent = String(score);
      }

      if (bestElement) {
        bestElement.textContent = String(bestScore);
      }

      updateStatus();
    }

    function move(direction) {
      if (!hasAvailableMove()) {
        updateStatus();
        return;
      }

      var result = slideBoard(direction);
      if (!result.changed) {
        return;
      }

      board = result.board;
      score += result.score;
      if (score > bestScore) {
        bestScore = score;
        saveBestScore();
      }

      addRandomTile();

      if (!reachedTarget && hasTargetTile()) {
        reachedTarget = true;
      }

      renderBoard();
    }

    function restartGame() {
      board = createEmptyBoard();
      score = 0;
      reachedTarget = false;
      addRandomTile();
      addRandomTile();
      renderBoard();
    }

    controlButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        move(button.getAttribute("data-move"));
        boardElement.focus({
          preventScroll: true
        });
      });
    });

    if (restartButton) {
      restartButton.addEventListener("click", function () {
        restartGame();
        boardElement.focus({
          preventScroll: true
        });
      });
    }

    document.addEventListener("keydown", function (event) {
      var key = event.key.toLowerCase();
      var directionMap = {
        arrowup: "up",
        w: "up",
        arrowdown: "down",
        s: "down",
        arrowleft: "left",
        a: "left",
        arrowright: "right",
        d: "right"
      };
      var direction = directionMap[key];

      if (!direction) {
        return;
      }

      event.preventDefault();
      move(direction);
    });

    boardElement.addEventListener("touchstart", function (event) {
      if (event.changedTouches.length === 0) {
        return;
      }

      touchStartX = event.changedTouches[0].clientX;
      touchStartY = event.changedTouches[0].clientY;
    }, {
      passive: true
    });

    boardElement.addEventListener("touchend", function (event) {
      if (event.changedTouches.length === 0) {
        return;
      }

      var touchEndX = event.changedTouches[0].clientX;
      var touchEndY = event.changedTouches[0].clientY;
      var distanceX = touchEndX - touchStartX;
      var distanceY = touchEndY - touchStartY;

      if (Math.max(Math.abs(distanceX), Math.abs(distanceY)) < 28) {
        return;
      }

      event.preventDefault();
      if (Math.abs(distanceX) > Math.abs(distanceY)) {
        move(distanceX > 0 ? "right" : "left");
      } else {
        move(distanceY > 0 ? "down" : "up");
      }
    });

    restartGame();
  }

  initialize1024Game();
});
