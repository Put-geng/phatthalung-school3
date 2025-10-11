import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// เก็บคะแนนไว้ใน memory
const ratings = {};

// 🟢 POST รับคะแนน
app.post("/api/rate", (req, res) => {
  const { menuId, rating } = req.body;
  if (!menuId || !rating) {
    return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
  }

  if (!ratings[menuId]) ratings[menuId] = [];
  ratings[menuId].push(rating);

  res.json({
    message: "บันทึกคะแนนเรียบร้อย",
    ratings
  });
});

// 🟣 GET ค่าเฉลี่ย
app.get("/api/average/:menuId", (req, res) => {
  const { menuId } = req.params;
  const list = ratings[menuId] || [];
  const count = list.length;
  const average = count > 0 ? list.reduce((a,b)=>a+b,0)/count : 0;

  res.json({ average, count });
});

// สำหรับ localhost
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
