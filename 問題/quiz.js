let questions = questionsData.map((q, i) => ({
  ...q,
  explanation: explanationsData[i]
}));

let current = 0;
let correct = 0;
let total = 0;
let incorrectQuestions = [];
let retryIncorrectQuestions = [];
let isRetryMode = false;

const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const resultEl = document.getElementById('result');
const nextBtn = document.getElementById('next-btn');
const explanationEl = document.getElementById('explanation');

nextBtn.addEventListener('click', next);

function saveProgress(subject, unit, correct, total, isRetryMode) {
  const key = `progress_${subject}_${unit}`;
  const stored = JSON.parse(localStorage.getItem(key) || '{}');
  const rate = total > 0 ? ((correct / total) * 100).toFixed(1) : '0.0';

  if (!stored.firstAttempt && !isRetryMode) {
    stored.firstAttempt = { correct, total, rate };
  }

  stored.finalAttempt = { correct, total, rate };

  localStorage.setItem(key, JSON.stringify(stored));
}

function render() {
  const q = questions[current];
  questionEl.textContent = `問題${current + 1}：${q.text}`;
  resultEl.textContent = '';
  resultEl.className = '';
  explanationEl.style.display = 'none';
  explanationEl.textContent = '';
  nextBtn.style.display = 'none';
  choicesEl.innerHTML = '';

  q.choices.forEach((choice, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = choice;
    btn.onclick = () => check(i === q.correctIndex);
    li.appendChild(btn);
    choicesEl.appendChild(li);
  });
}

function check(isCorrect) {
  total++;
  const q = questions[current];

  if (!isCorrect) {
    const target = isRetryMode ? retryIncorrectQuestions : incorrectQuestions;
    if (!target.includes(q)) target.push(q);
  }

  if (isCorrect) {
    correct++;
    resultEl.textContent = '正解！';
    resultEl.className = 'correct';
  } else {
    resultEl.textContent = '不正解…';
    resultEl.className = 'incorrect';
  }

  // 選択肢を全て無効化
  document.querySelectorAll('#choices button').forEach(btn => btn.disabled = true);

  // 解説を表示
  explanationEl.textContent = q.explanation;
  explanationEl.style.display = 'block';

  nextBtn.style.display = 'block';
}

function next() {
  current++;
  if (current < questions.length) {
    render();
  } else {
    finish();
  }
}

function finish() {
  const rate = ((correct / total) * 100).toFixed(1);
  const container = document.querySelector('.quiz-container');
  container.innerHTML = `
    <p style="text-align:center; font-weight:bold; font-size:20px; color:#2a6ebb">
      全ての問題が終了しました！
    </p>
    <div style="text-align:center; font-size:18px;">
      <p>正解数：${correct} / ${total}</p>
      <p>正答率：${rate}%</p>
    </div>
    <div style="text-align:center; margin-top:20px;">
      <button id="retry">間違えた問題だけ再チャレンジ</button>
      <button id="go-explanation" style="margin-left: 10px;">この単元の解説を見る</button>
      <button id="go-progress" style="margin-left: 10px;">進捗状況を見る</button>
    </div>
  `;

  saveProgress("基礎数学", "グラフと三角関数", correct, total, isRetryMode);

  document.getElementById('retry').addEventListener('click', () => {
    const retrySource = isRetryMode ? retryIncorrectQuestions : incorrectQuestions;
    if (retrySource.length === 0) {
      alert('再チャレンジする問題はありません！');
      return;
    }

    questions = [...retrySource];
    if (isRetryMode) {
      retryIncorrectQuestions = [];
    } else {
      incorrectQuestions = [];
    }

    isRetryMode = true;
    current = 0;
    correct = 0;
    total = 0;

    // HTMLを元に戻す
    container.innerHTML = `
      <p id="question"></p>
      <ul id="choices"></ul>
      <p id="result"></p>
      <div id="explanation" style="display:none;"></div>
      <button id="next-btn">次へ ▶</button>
    `;

    // 要素を再取得
    questionEl = document.getElementById('question');
    choicesEl = document.getElementById('choices');
    resultEl = document.getElementById('result');
    nextBtn = document.getElementById('next-btn');
    explanationEl = document.getElementById('explanation');

    nextBtn.addEventListener('click', next);

    render();
  });

  document.getElementById('go-explanation').addEventListener('click', () => {
    window.location.href = '../解説/graph.html';
  });

  document.getElementById('go-progress').addEventListener('click', () => {
    window.location.href = '../progress.html';
  });
}

render();