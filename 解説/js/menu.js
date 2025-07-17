// メニューの開閉だけ（ボタンは常に表示）
function toggleMenu() {
  const menu = document.getElementById("menuPanel");
  const isOpen = window.getComputedStyle(menu).display !== "none";
  menu.style.display = isOpen ? "none" : "flex";  
}

// メニューの単元ボタンから呼ばれる
function selectUnit(unit, skipMenuClose = false) {
  const graphSection = document.getElementById("section-graph");
  const sorrySection = document.getElementById("section-sorry");
  const titleElem = document.getElementById("unitTitle");
  const toQuiz = document.getElementById("toQuiz");

  if (unit === "graph") {
    graphSection.style.display = "block";
    sorrySection.style.display = "none";
    titleElem.textContent = "グラフと三角関数";
    if (toQuiz) toQuiz.href = "../問題/graph_quiz.html";
  } else {
    graphSection.style.display = "none";
    sorrySection.style.display = "block";
    titleElem.textContent = "未実装の単元";
    if (toQuiz) toQuiz.href = "#";
  }

  // ✅ 初回読み込み時にはメニューを閉じない（開かない）
  if (!skipMenuClose) {
    toggleMenu(); // 通常時のみ
  }
}

// ✅ ページ読み込み時に初期表示設定（メニューを開かないように）
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("menuPanel").style.display = "none"; // 念のため
  selectUnit("graph", true); // ← 初回のみ true を渡す
});