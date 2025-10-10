const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = "ratings.json";

// โหลดข้อมูลจากไฟล์
function loadRatings() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

// บันทึกข้อมูล
function saveRatings(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ดึงคะแนนเฉลี่ย
app.get("/api/average/:menuId", (req, res) => {
  const { menuId } = req.params;
  const ratings = loadRatings()[menuId] || [];
  const count = ratings.length;
  const average = count ? ratings.reduce((a,b)=>a+b,0)/count : 0;

  res.json({ average, count });
});


// บันทึกคะแนนใหม่
app.post("/api/rate", (req, res) => {
  const { menuId, rating } = req.body; 
  if (!menuId || !rating) return res.status(400).json({ error: "ข้อมูลไม่ครบ" });

  const ratings = loadRatings();
  if (!ratings[menuId]) ratings[menuId] = [];
  ratings[menuId].push(rating);

  saveRatings(ratings);
  res.json({ success: true, ratings }); // ส่ง ratings กลับ
});


app.listen(PORT, () => {
  console.log(`✅ Server ทำงานที่ http://localhost:${PORT}`);
});
