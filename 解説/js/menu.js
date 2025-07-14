// メニュー開閉
function toggleMenu() {
  const menu = document.getElementById("menuPanel");
  menu.style.display = (menu.style.display === "flex") ? "none" : "flex";
}

// 単元ごとのリンクとタイトル
const quizLinks = {
  graph: "../問題/graph_quiz.html",
  exp: "../問題/exp_quiz.html",
  number: "../問題/number_quiz.html",
  diff: "../問題/diff_quiz.html",
  int: "../問題/int_quiz.html",
  calculus: "../問題/calculus_quiz.html",
  vector: "../問題/vector_quiz.html",
  matrix: "../問題/matrix_quiz.html"
};

const sectionTitles = {
  graph: "グラフと三角関数",
  exp: "指数と対数",
  number: "数の定義",
  diff: "微分法の基礎",
  int: "積分法の基礎",
  calculus: "微分積分",
  vector: "ベクトルの基礎",
  matrix: "行列"
};

// 問題リンク更新
function updateQuizLink(currentUnit) {
  const toQuiz = document.getElementById("toQuiz");
  if (toQuiz) {
    toQuiz.href = quizLinks[currentUnit] || "#";
  }
}

// セクション表示切替とタイトル変更
function showSection(sectionName) {
  const sections = document.querySelectorAll(".section");
  sections.forEach(sec => sec.style.display = "none");

  const target = document.getElementById(`section-${sectionName}`);
  const sorry = document.getElementById("section-sorry");
  const title = document.getElementById("unitTitle");

  if (target) {
    target.style.display = "block";
  } else {
    sorry.style.display = "block";
  }

  if (title) {
    title.textContent = sectionTitles[sectionName] || "未実装の単元";
  }

  updateQuizLink(sectionName);
  toggleMenu();
}

// ページ初期表示：グラフ単元を見せる
document.addEventListener("DOMContentLoaded", () => {
  showSection("graph");
});
