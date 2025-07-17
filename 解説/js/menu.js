// メニュー開閉
function toggleMenu() {
  const menu = document.getElementById("menuPanel");
  // style.display には空文字 "" もありうるので、getComputedStyleで実際の表示状態を取る
  const currentDisplay = window.getComputedStyle(menu).display;
  if (currentDisplay === "flex") {
    menu.style.display = "none";
  } else {
    menu.style.display = "flex";
  }
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
function showSection(sectionName, isInitial = false) {
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

  // 初期表示の時はtoggleMenuしない
  if (!isInitial) {
    toggleMenu();
  }
}

// ページ初期表示：グラフ単元を見せる
document.addEventListener("DOMContentLoaded", () => {
  showSection("graph", true);  // 第二引数true＝初期表示
});

// ページ初期表示：グラフ単元を見せる
document.addEventListener("DOMContentLoaded", () => {
  showSection("graph");
});

function toggleMenu() {
  const menu = document.getElementById("menuPanel");
  if (menu.style.display === "flex") {
    menu.style.display = "none";
  } else {
    menu.style.display = "flex";
  }
}


// 初期表示時はメニュー閉じてハンバーガー表示
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menuPanel");
  const hamburger = document.getElementById("hamburger");

  menu.style.display = "none";
  hamburger.style.display = "block";

  // 必要に応じて初期表示単元をセット
  showSection("graph", true);
});