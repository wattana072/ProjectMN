# 🚀 คู่มือการนำขึ้น GitHub, Deploy บน Vercel และเชื่อมต่อฐานข้อมูล (ทางเลือกที่ 2)

คู่มือนี้จัดทำขึ้นเป็นพิเศษเพื่อแนะนำ **ทางเลือกที่ 2: การใช้ระบบฐานข้อมูล Cloud ขนาดเล็กฟรี (Serverless Cloud Database)** ร่วมกับ **Vercel** และ **GitHub** ซึ่งเหมาะอย่างยิ่งสำหรับระบบที่มีเลขาหรือเจ้าหน้าที่ไม่กี่คนคอยปรับปรุงข้อมูล โดยที่ข้อมูลจะปลอดภัยและไม่สูญหายเมื่อรันบน Vercel

---

## 📌 ทำไมต้องเป็นทางเลือกที่ 2? (ข้อจำกัดของ SQLite ดั้งเดิมบน Vercel)
ปกติแล้ว **SQLite แบบไฟล์ธรรมดา (`.db` หรือ `.sqlite`) ไม่สามารถใช้เขียนข้อมูลบน Vercel ได้** เนื่องจาก:
1. **Serverless Environment เป็นแบบ Stateless (ไม่มีสถานะถาวร):** Vercel จะสร้างและทำลายคอนเทนเนอร์เซิร์ฟเวอร์แบบสุ่ม เมื่อไม่มีผู้ใช้งานไประยะหนึ่ง ข้อมูลที่ถูกบันทึกไว้ในไฟล์บนเซิร์ฟเวอร์จะถูกล้างทิ้งทันที
2. **Read-Only File System:** ไฟล์ระบบบน Vercel ถูกออกแบบมาให้อ่านได้อย่างเดียว ไม่สามารถเขียนไฟล์ทับลงไปตรงๆ ได้

### 💡 ทางออกที่ดีที่สุดสำหรับระบบขนาดเล็ก:
เราจึงใช้ระบบ **Cloud Database ขนาดเล็กที่มี Free Tier คุ้มค่า** ซึ่งเราขอแนะนำ 2 ตัวเลือกที่ง่ายและทรงพลังที่สุดครับ:

---

## 🛠️ ตัวเลือกฐานข้อมูลสำหรับทางเลือกที่ 2

### [ตัวเลือก A] Turso (SQLite บนระบบคลาวด์) - *แนะนำสำหรับผู้ที่รักใน SQLite*
**Turso** คือฐานข้อมูล SQLite ที่ถูกยกขึ้นไปอยู่บน Cloud (พัฒนาบน libSQL) 
* **จุดเด่น:** ใช้งานเหมือน SQLite ทุกประการ, มีความรวดเร็วสูงมาก, รันบน Vercel ได้สมบูรณ์แบบ
* **Free Tier:** ฟรีสูงสุดถึง 500 databases, พื้นที่ 9GB, และแบนด์วิดท์มหาศาล (เพียงพอสำหรับสำนักงานขนาดเล็กใช้งานได้ฟรีตลอดชีพ)
* **การจัดการข้อมูล:** มีหน้าเว็บ UI ให้เปิดดูตาราง และสามารถดาวน์โหลดโปรแกรมอย่าง TablePlus หรือ DBeaver มาต่อเพื่อแก้ไขข้อมูลได้โดยตรง

### [ตัวเลือก B] Supabase (PostgreSQL พร้อมหน้าเว็บจัดการแบบ Excel) - *แนะนำที่สุดสำหรับเจ้าหน้าที่/เลขา*
**Supabase** คือระบบฐานข้อมูลออนไลน์ที่ใช้ง่ายที่สุดในโลกสำหรับผู้ใช้งานทั่วไป
* **จุดเด่น:** มี **Table Editor (หน้าเว็บจัดการตารางข้อมูล)** ที่มีหน้าตาเหมือน **Excel / Google Sheets** อยู่บนเบราว์เซอร์เลขาและเจ้าหน้าที่สามารถเข้ามากดคลิกพิมพ์แก้ไขข้อมูล ลบแถว เพิ่มแถว ผ่านหน้าเว็บ Supabase ได้ทันทีโดยไม่ต้องมีความรู้ภาษา SQL!
* **Free Tier:** ฟรี 2 โปรเจกต์ฐานข้อมูลถาวร ซึ่งเพียงพอสำหรับระบบนี้
* **รันบน Vercel:** มีส่วนเชื่อมต่อ (Integration) กับ Vercel ได้ในคลิกเดียว

---

## 🏁 ขั้นตอนที่ 1: การนำโค้ดขึ้น GitHub

เตรียมโค้ดให้พร้อมใช้งานในเครื่องของคุณ จากนั้นเปิด Command Line / Terminal ในโฟลเดอร์โปรเจกต์ และรันคำสั่งดังนี้:

```bash
# 1. เริ่มต้นใช้งาน Git ในโปรเจกต์
git init

# 2. เพิ่มไฟล์ทั้งหมดเข้าไปในระบบเตรียม Commit (Git จะข้าม node_modules อัตโนมัติจาก .gitignore)
git add .

# 3. Commit ไฟล์ทั้งหมดไว้ในเครื่อง
git commit -m "feat: ระบบ TCMS จัดการตารางอบรมอัจฉริยะ"

# 4. เปลี่ยนชื่อสาขาหลักเป็น main
git branch -M main

# 5. เชื่อมต่อกับ GitHub Repository ของคุณ (นำ URL จากที่คุณสร้างบนเว็บ GitHub มาใส่แทนที่)
git remote add origin https://github.com/ชื่อผู้ใช้ของคุณ/ชื่อโปรเจกต์ของคุณ.git

# 6. อัปโหลดโค้ดขึ้น GitHub
git push -u origin main
```

---

## 🏁 ขั้นตอนที่ 2: การเอาขึ้นและรันบน Vercel (Deploy)

เนื่องจากระบบนี้เป็นแบบ **Full-Stack (React Vite + Express Server)** เพื่อให้ Vercel สามารถรันเซิร์ฟเวอร์ Express ร่วมกับหน้าเว็บ React ได้อย่างราบรื่น ให้สร้างไฟล์ชื่อ `vercel.json` ไว้ที่โฟลเดอร์หลัก (Root) ของโปรเจกต์ ดังนี้:

### 📄 โครงสร้างไฟล์ `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 🚀 ขั้นตอนการ Deploy บนหน้าเว็บ Vercel:
1. เข้าสู่เว็บไซต์ [Vercel.com](https://vercel.com) และเข้าสู่ระบบด้วยบัญชี **GitHub**
2. คลิกปุ่ม **"Add New"** > **"Project"**
3. เลือก Repository ที่คุณเพิ่งอัปโหลดขึ้น GitHub แล้วกด **"Import"**
4. ในส่วนของ **Environment Variables (ตัวแปรสภาพแวดล้อม)** ให้เพิ่มค่าดังนี้:
   * `GEMINI_API_KEY` = *ใส่คีย์ของคุณที่ได้จาก Google AI Studio*
   * `DATABASE_URL` = *ใส่ URL เชื่อมต่อของ Turso หรือ Supabase (ดูหัวข้อถัดไป)*
   * `DATABASE_AUTH_TOKEN` = *โทเค็นความปลอดภัย (ถ้าเลือกใช้ Turso)*
5. คลิกปุ่ม **"Deploy"** รอระบบประมวลผลประมาณ 1 นาที เว็บไซต์ของคุณก็พร้อมใช้งานออนไลน์ทันที!

---

## 🏁 ขั้นตอนที่ 3: การปรับโค้ดใน Express (`server.ts`) เพื่อเชื่อมต่อฐานข้อมูลจริง

นี่คือตัวอย่างโค้ดที่คุณสามารถนำไปปรับปรุงใน `server.ts` เพื่อเปลี่ยนจากการใช้ไฟล์ `initialData.ts` ในหน่วยความจำ (ที่รีเฟรชแล้วข้อมูลจะหาย) ให้กลายเป็นการดึงและบันทึกข้อมูลลงฐานข้อมูลออนไลน์ถาวร:

### 💻 ติดตั้ง Package ที่จำเป็น
ให้รันคำสั่งนี้เพื่อติดตั้งไดรเวอร์เชื่อมต่อฐานข้อมูล (เลือกตามตัวเลือกที่คุณเลือก):

```bash
# หากเลือกใช้ Turso (SQLite บนคลาวด์)
npm install @libsql/client

# หรือหากเลือกใช้ Supabase / PostgreSQL ทั่วไป
npm install pg @types/pg
```

### 🛠️ ตัวอย่างโครงสร้างการเชื่อมต่อฐานข้อมูลใน `server.ts`

```typescript
// server.ts (ตัวอย่างการปรับปรุงเพื่อเชื่อมต่อฐานข้อมูลออนไลน์)
import express from "express";
import { createClient } from "@libsql/client"; // สำหรับ Turso (SQLite Cloud)
// import { Pool } from "pg"; // สำหรับ Supabase (ถ้าต้องการใช้ Postgres)

const app = express();
app.use(express.json());

// 1. เชื่อมต่อฐานข้อมูล Turso (SQLite บนคลาวด์)
const db = createClient({
  url: process.env.DATABASE_URL || "file:local.db", // ใช้ไฟล์ในเครื่องช่วงเทส และใช้ URL จริงตอนรันบน Vercel
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

// ==========================================
// ตัวอย่าง API ดึงข้อมูลตารางกิจกรรม (Schedule)
// ==========================================
app.get("/api/schedule", async (req, res) => {
  try {
    const result = await db.execute("SELECT * FROM schedule ORDER BY day ASC, id DESC");
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// ตัวอย่าง API เพิ่มกิจกรรมลงในตารางกิจกรรม
// ==========================================
app.post("/api/schedule", async (req, res) => {
  try {
    const { id, day, timeSlot, timeSlotLabel, timeRange, activity, coordinator, monkInCharge } = req.body;
    
    await db.execute({
      sql: `INSERT INTO schedule (id, day, timeSlot, timeSlotLabel, timeRange, activity, coordinator, monkInCharge) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, day, timeSlot, timeSlotLabel, timeRange, activity, coordinator, monkInCharge]
    });

    res.json({ success: true, message: "บันทึกกิจกรรมเรียบร้อยแล้ว" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// ตัวอย่าง API ลบกิจกรรม
// ==========================================
app.delete("/api/schedule/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute({
      sql: "DELETE FROM schedule WHERE id = ?",
      args: [id]
    });
    res.json({ success: true, message: "ลบกิจกรรมเรียบร้อยแล้ว" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## 🗄️ โครงสร้างตาราง SQL (Database Schema)

เพื่อสร้างตารางทั้งหมดในฐานข้อมูลคลาวด์ของคุณ คุณสามารถนำคำสั่ง SQL เหล่านี้ไปรันในหน้าต่าง SQL ของ **Turso Console** หรือ **Supabase SQL Editor** ได้ทันทีเพื่อสร้างตารางข้อมูลทั้ง 6 ตารางให้พร้อมทำงาน:

```sql
-- 1. ตารางข้อมูลรายละเอียดโครงการ
CREATE TABLE IF NOT EXISTS project (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  startDate TEXT,
  endDate TEXT,
  attendeeCount INTEGER,
  instructorCount INTEGER,
  attendeesDescription TEXT,
  notes TEXT
);

-- 2. ตารางตารางกิจกรรมรายวัน
CREATE TABLE IF NOT EXISTS schedule (
  id TEXT PRIMARY KEY,
  day INTEGER,
  timeSlot TEXT,
  timeSlotLabel TEXT,
  timeRange TEXT,
  activity TEXT,
  coordinator TEXT,
  monkInCharge TEXT
);

-- 3. ตารางรายชื่อทีมงานและการเดินทาง
CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  "order" INTEGER,
  division TEXT,
  monkWP1 INTEGER,
  monkWP2 INTEGER,
  monkWP3 INTEGER,
  maleStaff INTEGER,
  femaleStaff INTEGER,
  vipStaff INTEGER,
  attendeeStaff INTEGER,
  instructorStaff INTEGER,
  travelDetail TEXT,
  responsibility TEXT
);

-- 4. ตารางคลังคำกล่าวสุนทรพจน์
CREATE TABLE IF NOT EXISTS speeches (
  id TEXT PRIMARY KEY,
  speechType TEXT,
  title TEXT,
  reporter TEXT,
  recipientOrSpeaker TEXT,
  tone TEXT,
  content TEXT
);

-- 5. ตารางงบประมาณการเงิน
CREATE TABLE IF NOT EXISTS budget (
  id TEXT PRIMARY KEY,
  category TEXT, -- 'income' หรือ 'expense'
  title TEXT,
  amount REAL,
  quantity INTEGER,
  unitPrice REAL,
  note TEXT
);

-- 6. ตารางบันทึกการประเมินโครงการหลังเสร็จสิ้น
CREATE TABLE IF NOT EXISTS evaluation (
  id TEXT PRIMARY KEY,
  objectivesMet INTEGER, -- 1 = True, 0 = False
  scoreProductivity INTEGER,
  scoreDiscipline INTEGER,
  scoreMindfulness INTEGER,
  swotStrengths TEXT,
  swotWeaknesses TEXT,
  swotOpportunities TEXT,
  swotThreats TEXT,
  summaryComments TEXT
);
```

---

## 💡 สรุปขั้นตอนการทำระบบจริง:
1. **เจ้าหน้าที่/เลขา:** หากใช้ **Supabase** พวกเขาไม่ต้องใช้ SQL เลย เพียงล็อกอินเข้าเว็บ Supabase จะเห็นหน้าตารางข้อมูล 6 ตารางนี้เหมือน Google Sheets สามารถเข้าไปแก้ไขรายชื่อ ตัวเลข หรือลบแถวได้โดยตรง ข้อมูลจะสะท้อนบนเว็บไซต์ทันที
2. **ระบบการดึงข้อมูล:** หน้าเว็บบราวเซอร์ (React) จะทำการ `fetch("/api/schedule")` มาแสดงผล แทนที่จะดึงมาจากไฟล์ `initialData.ts` ทำให้ข้อมูลอัปเดตแบบ Real-time และบันทึกอยู่อย่างปลอดภัยถาวรครับ!
