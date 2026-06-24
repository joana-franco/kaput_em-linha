const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let drawing = false;

// Drawing logic
canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => {
  drawing = false;
  ctx.beginPath();
});

canvas.addEventListener("mousemove", draw);

function draw(e) {
  if (!drawing) return;

  ctx.lineWidth = 3;
  ctx.lineCap = "round";

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

// Clear canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Save drawing
function saveDrawing() {
  const image = canvas.toDataURL();

  fetch("http://localhost:3000/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ image })
  })
  .then(() => loadGallery());
}

// Load gallery
function loadGallery() {
  fetch("http://localhost:3000/drawings")
    .then(res => res.json())
    .then(data => {
      const gallery = document.getElementById("gallery");
      gallery.innerHTML = "";

      data.forEach(item => {
        const img = document.createElement("img");
        img.src = item.image;
        gallery.appendChild(img);
      });
    });
}

// Load existing drawings on page load
window.onload = loadGallery;
