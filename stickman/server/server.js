const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Temporary in-memory storage
let drawings = [];

// Save drawing
app.post("/save", (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).send("No image provided");

  drawings.push({
    image,
    createdAt: new Date()
  });

  res.sendStatus(200);
});

// Get all drawings
app.get("/drawings", (req, res) => {
  res.json(drawings);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
