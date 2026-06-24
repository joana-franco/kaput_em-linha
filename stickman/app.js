import { db, collection, addDoc, getDocs, query, orderBy } from "./firebase.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let drawing = false;

// Drawing
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

// Clear
window.clearCanvas = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// Save to Firebase
window.saveDrawing = async function () {
  const image = canvas.toDataURL();

  await addDoc(collection(db, "stickmans"), {
    image,
    createdAt: Date.now()
  });

  loadGallery();

  clearCanvas();
};

// Load drawings
async function loadGallery() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  const q = query(collection(db, "stickmans"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const data = doc.data();
    const img = document.createElement("img");
    img.src = data.image;
    gallery.appendChild(img);
  });
}

// Load on start
loadGallery();
