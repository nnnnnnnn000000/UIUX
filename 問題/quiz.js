let questions = questionsData.map((q, i) => ({
  ...q,
  explanation: explanationsData[i]
}));

let current = 0;
let correct = 0;
let total = 0;
let incorrectQuestions = [];
let mistakeTags = {};
let retryIncorrectQuestions = [];
let isRetryMode = false;

// グローバル参照
window.questionEl = document.getElementById('question');
window.choicesEl = document.getElementById('choices');
window.resultEl = document.getElementById('result');
window.nextBtn = document.getElementById('next-btn');
window.explanationEl = document.getElementById('explanation');

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

function saveMistakes() {
  const mistakes = incorrectQuestions.map(q => q.text);
  localStorage.setItem('quiz_mistakes', JSON.stringify(mistakes));
}

function loadMistakes() {
  const mistakeTexts = JSON.parse(localStorage.getItem('quiz_mistakes') || '[]');
  return questionsData.filter(q => mistakeTexts.includes(q.text)).map(q => ({
    ...q,
    explanation: explanationsData[questionsData.indexOf(q)] || ''
  }));
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
    saveMistakes();
  }

  const tag = q.tag || "未分類";
  mistakeTags[tag] = (mistakeTags[tag] || 0) + 1;
  localStorage.setItem("mistakeTags", JSON.stringify(mistakeTags));

  if (isCorrect) {
    correct++;
    resultEl.textContent = '正解！';
    resultEl.className = 'correct';
    showJudgeMark('〇', true);
  } else {
    resultEl.textContent = '不正解…';
    resultEl.className = 'incorrect';
    showJudgeMark('×', false);
  }

  document.querySelectorAll('#choices button').forEach(btn => btn.disabled = true);

  explanationEl.textContent = q.explanation;
  explanationEl.style.display = 'block';
  nextBtn.style.display = 'block';
}

function showJudgeMark(symbol, isCorrect) {
  const mark = document.getElementById('judge-mark');
  mark.textContent = symbol;
  mark.className = `show ${isCorrect ? 'correct' : 'incorrect'}`;
  setTimeout(() => {
    mark.className = '';
    mark.textContent = '';
  }, 800);
}

function next() {
  const container = document.querySelector('.quiz-container');
  container.classList.add('flip-out');  // ページをめくる（表を折り曲げる）

  setTimeout(() => {
    container.classList.remove('flip-out');

    current++;
    if (current < questions.length) {
      render();
    } else {
      finish();
    }

    container.classList.add('flip-in');  // 新しいページをめくる（裏から表に出す）

    setTimeout(() => {
      container.classList.remove('flip-in');
    }, 600);
  }, 600);
  
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
    </div>
    <div style="text-align:center; margin-top:40px;">
      <button id="go-progress">進捗状況を見る</button>
    </div>
  `;

  saveProgress("基礎数学", "グラフと三角関数", correct, total, isRetryMode);

  document.getElementById('retry').addEventListener('click', () => {
    let retrySource = isRetryMode ? retryIncorrectQuestions : loadMistakes();

    if (retrySource.length === 0) {
      alert('再チャレンジする問題はありません！');
      return;
    }

    questions = retrySource.map(q => {
      const index = questionsData.findIndex(orig => orig.text === q.text);
      return {
        ...questionsData[index],
        explanation: explanationsData[index] || ''
      };
    });

    if (isRetryMode) {
      retryIncorrectQuestions = [];
    } else {
      incorrectQuestions = [];
      saveMistakes();
    }

    isRetryMode = true;
    current = 0;
    correct = 0;
    total = 0;

    container.innerHTML = `
      <p id="question"></p>
      <ul id="choices"></ul>
      <p id="result"></p>
      <div id="explanation" style="display:none;"></div>
      <button id="next-btn">次へ ▶</button>
    `;

    // DOM 要素の再取得
    window.questionEl = document.getElementById('question');
    window.choicesEl = document.getElementById('choices');
    window.resultEl = document.getElementById('result');
    window.nextBtn = document.getElementById('next-btn');
    window.explanationEl = document.getElementById('explanation');

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
function toggleMenu() {
  const overlay = document.getElementById('menu-overlay');
  overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
}

function selectUnit(unitKey) {
  // 今回はグラフと三角関数のみ
  if (unitKey === 'graph') {
    location.reload(); // 現在の問題に戻る
  }
}

function showComingSoon() {
  // メニューを閉じる
  document.getElementById('menu-overlay').style.display = 'none';

  // トースト表示処理
  const toast = document.getElementById('toast');
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

render();