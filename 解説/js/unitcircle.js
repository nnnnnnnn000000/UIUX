const canvas = document.getElementById("unitCircle");
const ctx = canvas.getContext("2d");
const centerX = 200;
const centerY = 200;
const radius = 140;
let mode = 'deg';

const trigMap = {
  0:   { sin: "0",     cos: "1",     tan: "0"     },
  30:  { sin: "1/2",   cos: "\u221a3/2",  tan: "1/\u221a3"  },
  45:  { sin: "\u221a2/2",  cos: "\u221a2/2",  tan: "1"     },
  60:  { sin: "\u221a3/2",  cos: "1/2",   tan: "\u221a3"    },
  90:  { sin: "1",     cos: "0",     tan: "\u221e"     },
  120: { sin: "\u221a3/2",  cos: "-1/2",  tan: "-\u221a3"   },
  135: { sin: "\u221a2/2",  cos: "-\u221a2/2", tan: "-1"    },
  150: { sin: "1/2",   cos: "-\u221a3/2", tan: "-1/\u221a3" },
  180: { sin: "0",     cos: "-1",    tan: "0"     },
  210: { sin: "-1/2",  cos: "-\u221a3/2", tan: "1/\u221a3"  },
  225: { sin: "-\u221a2/2", cos: "-\u221a2/2", tan: "1"     },
  240: { sin: "-\u221a3/2", cos: "-1/2",  tan: "\u221a3"    },
  270: { sin: "-1",    cos: "0",     tan: "\u221e"     },
  300: { sin: "-\u221a3/2", cos: "1/2",   tan: "-\u221a3"   },
  315: { sin: "-\u221a2/2", cos: "\u221a2/2",  tan: "-1"    },
  330: { sin: "-1/2",  cos: "\u221a3/2",  tan: "-1/\u221a3" },
};

const angles = [
  0, 30, 45, 60, 90, 120, 135, 150,
  180, 210, 225, 240, 270, 300, 315, 330
];

function setMode(m) {
  mode = m;
  createButtons();
  drawCircle();
  hideTooltip();

  const buttons = document.querySelectorAll(".mode-buttons button");
  buttons.forEach(btn => {
    if ((m === "deg" && btn.innerText.includes("度数")) ||
        (m === "rad" && btn.innerText.includes("弧度"))) {
      btn.classList.add("active-mode");
    } else {
      btn.classList.remove("active-mode");
    }
  });
}

function toRad(deg) {
  return deg * Math.PI / 180;
}

function formatFraction(text) {
  if (!text.includes("/")) return text;
  const [num, denom] = text.split("/");
  return `<span class="fraction"><span class="numerator">${num}</span><span class="denominator">${denom}</span></span>`;
}

function formatAngle(angle) {
  const raw = (mode === 'deg') ? `${angle}°` : {
    0: "0", 30: "π/6", 45: "π/4", 60: "π/3", 90: "π/2",
    120: "2π/3", 135: "3π/4", 150: "5π/6", 180: "π",
    210: "7π/6", 225: "5π/4", 240: "4π/3", 270: "3π/2",
    300: "5π/3", 315: "7π/4", 330: "11π/6"
  }[angle] || angle;

  return `<span class="angle-label">${formatFraction(raw)}</span>`;
}

function drawCircle(selectedAngle = null) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#aaa";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX - radius - 10, centerY);
  ctx.lineTo(centerX + radius + 10, centerY);
  ctx.moveTo(centerX, centerY - radius - 10);
  ctx.lineTo(centerX, centerY + radius + 10);
  ctx.strokeStyle = "#ccc";
  ctx.stroke();

  if (selectedAngle !== null) {
    const rad = toRad(selectedAngle);
    const x = centerX + radius * Math.cos(rad);
    const y = centerY - radius * Math.sin(rad);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "blue";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
  }
}

let selectedAngle = null;
let activeButton = null;

function createButtons() {
  const container = document.getElementById("angleButtons");
  container.innerHTML = "";
  angles.forEach(angle => {
    const rad = toRad(angle);
    const x = centerX + radius * Math.cos(rad);
    const y = centerY - radius * Math.sin(rad);

    const btn = document.createElement("button");
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
    btn.innerHTML = formatAngle(angle);
    btn.onclick = () => toggleTooltip(angle, x, y, btn);
    container.appendChild(btn);
  });
}

function toggleTooltip(angle, x, y, btn) {
  if (selectedAngle === angle) {
    hideTooltip();
    selectedAngle = null;
    if (activeButton) {
      activeButton.classList.remove("active-angle");
      activeButton = null;
    }
    drawCircle();
    return;
  }

  if (activeButton) activeButton.classList.remove("active-angle");

  selectedAngle = angle;
  activeButton = btn;
  activeButton.classList.add("active-angle");

  drawCircle(angle);
  const tooltip = document.getElementById("tooltip");

  const { sin, cos, tan } = trigMap[angle] || {
    sin: Math.round(Math.sin(toRad(angle)) * 100) / 100,
    cos: Math.round(Math.cos(toRad(angle)) * 100) / 100,
    tan: (Math.abs(Math.cos(toRad(angle))) < 0.01) ? '∞' :
         Math.round(Math.tan(toRad(angle)) * 100) / 100
  };

tooltip.innerHTML = `
  <div class="angle-label">${formatAngle(angle)}</div>
  <div class="tooltip-line"><strong>sin:</strong> ${formatFraction(sin)}</div>
  <div class="tooltip-line"><strong>cos:</strong> ${formatFraction(cos)}</div>
  <div class="tooltip-line"><strong>tan:</strong> ${formatFraction(tan)}</div>
`;
  tooltip.style.left = `${x + 10}px`;
  tooltip.style.top = `${y - 30}px`;
  tooltip.style.display = 'block';
}

function hideTooltip() {
  document.getElementById("tooltip").style.display = 'none';
}

setMode('deg');