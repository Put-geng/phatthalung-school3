import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 3000;

// อนุญาตทุก origin (ทดสอบได้ทั้ง localhost และมือถือ)
app.use(cors({ origin: "*" }));
app.use(express.json());

// 🔗 เชื่อมต่อ MongoDB
const MONGODB_URI = "mongodb+srv://Put-geng:1234pppp@cluster0.dhenncz.mongodb.net/schoolVotes?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// 🧩 สร้าง Schema เก็บข้อมูลคะแนน
const ratingSchema = new mongoose.Schema({
  menuId: String,
  rating: Number,
});

const Rating = mongoose.model("Rating", ratingSchema);

// 🟢 POST - รับคะแนนจากผู้ใช้
app.post("/api/rate", async (req, res) => {
  const { menuId, rating } = req.body;
  if (!menuId || !rating) {
    return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
  }

  try {
    await Rating.create({ menuId, rating });
    res.json({ message: "บันทึกคะแนนเรียบร้อย" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึก" });
  }
});

// 🟣 GET - ค่าเฉลี่ยของแต่ละเมนู
app.get("/api/average/:menuId", async (req, res) => {
  const { menuId } = req.params;

  try {
    const ratings = await Rating.find({ menuId });
    const count = ratings.length;
    const average =
      count > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / count : 0;

    res.json({ average, count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

// 🟢 เริ่มเซิร์ฟเวอร์ (เฉพาะตอน run localhost)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export default app;
