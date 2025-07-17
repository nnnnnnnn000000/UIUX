// メニューの開閉だけ（ボタンは常に表示）
function toggleMenu() {
  const menu = document.getElementById("menuPanel");
  const isOpen = window.getComputedStyle(menu).display !== "none";
  menu.style.display = isOpen ? "none" : "flex";  // CSSに合わせてflexやblockにして
}

// メニューの単元ボタンから呼ばれる
function selectUnit(unit) {
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
    sorrySection.style.display = "block";  // ← これで表示されるはず
    titleElem.textContent = "未実装の単元";
    if (toQuiz) toQuiz.href = "#";
  }

  toggleMenu(); // メニュー閉じる
}

// ページ読み込み時に初期表示設定
document.addEventListener("DOMContentLoaded", () => {
  // メニュー閉じる
  document.getElementById("menuPanel").style.display = "none";
  // 初期表示はグラフ単元を表示
  selectUnit("graph");
});