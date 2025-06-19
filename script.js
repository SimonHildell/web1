const canvas = document.getElementById('spinner');
const ctx = canvas.getContext('2d');

let width, height, cx, cy;
function resize() {
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(devicePixelRatio, devicePixelRatio);
  cx = width / 2;
  cy = height / 2;
}
resize();
window.addEventListener('resize', resize);

// Spinner state
let rotation = 0;
let rotationSpeed = 0.01; // base rotation speed
let isDragging = false;
let lastX = 0;
let dragVelocity = 0;

const models = {
  lissajous(t) {
    // Example Lissajous curve points on 2D canvas
    const A = 100;
    const B = 80;
    const a = 3;
    const b = 2;
    const delta = Math.PI / 2;
    return {
      x: cx + A * Math.sin(a * t + delta),
      y: cy + B * Math.sin(b * t),
    };
  },
  torus(t) {
    // Simplified circle for demo
    const R = 90;
    return {
      x: cx + R * Math.cos(t),
      y: cy + R * Math.sin(t),
    };
  },
  sphere(t) {
    // Circle with vertical oscillation
    const R = 90;
    return {
      x: cx + R * Math.cos(t),
      y: cy + R * Math.sin(2 * t) / 2 + cy / 4,
    };
  },
};

let currentModel = 'lissajous';

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#333';
  ctx.beginPath();

  const points = [];
  const steps = 200;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    points.push(models[currentModel](t));
  }

  points.forEach(({ x, y }, i) => {
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();
}

function animate() {
  if (!isDragging) {
    rotation += rotationSpeed;
  } else {
    rotation += dragVelocity;
    dragVelocity *= 0.95; // friction slow down after drag
  }

  ctx.save();
  ctx.clearRect(0, 0, width, height);
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.translate(-cx, -cy);

  draw();

  ctx.restore();

  requestAnimationFrame(animate);
}
animate();

// Drag/spin logic
canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  lastX = e.clientX;
  canvas.style.cursor = 'grabbing';
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  canvas.style.cursor = 'grab';
});

window.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const deltaX = e.clientX - lastX;
    dragVelocity = deltaX * 0.005;
    rotation += dragVelocity;
    lastX = e.clientX;
  }
});

// Model toggle buttons
const buttons = document.querySelectorAll('#model-toggle button');
buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    buttons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentModel = btn.dataset.model;
  });
});
