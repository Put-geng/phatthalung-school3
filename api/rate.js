import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// 🔧 ตั้งค่า
app.use(cors());
app.use(express.json());

// 🔹 กำหนดพาธของไฟล์ที่เก็บคะแนน
const ratingsFile = path.resolve("ratings.json");

// 🧩 ฟังก์ชันช่วยโหลด/บันทึกข้อมูล
function loadRatings() {
  try {
    const data = fs.readFileSync(ratingsFile, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return {}; // ถ้าไฟล์ไม่มี ให้เริ่มใหม่
  }
}

function saveRatings(ratings) {
  fs.writeFileSync(ratingsFile, JSON.stringify(ratings, null, 2));
}

// 🟢 [POST] รับคะแนนจากผู้ใช้
app.post("/api/rate", (req, res) => {
  const { menuId, rating } = req.body;
  if (!menuId || !rating) {
    return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
  }

  const ratings = loadRatings();

  if (!ratings[menuId]) ratings[menuId] = [];
  ratings[menuId].push(rating);

  saveRatings(ratings);

  res.json({
    message: "บันทึกคะแนนเรียบร้อย",
    ratings
  });
});

// 🟣 [GET] ดึงค่าเฉลี่ยของแต่ละเมนู
app.get("/api/average/:menuId", (req, res) => {
  const { menuId } = req.params;
  const ratings = loadRatings();

  const list = ratings[menuId] || [];
  const count = list.length;
  const average = count > 0 ? list.reduce((a, b) => a + b, 0) / count : 0;

  res.json({ average, count });
});

// 🟢 เริ่มเซิร์ฟเวอร์ (ใช้ตอนรันใน localhost)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
