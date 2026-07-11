import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(express.json());

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint to generate speeches using Gemini 3.5 Flash
app.post("/api/speech/generate", async (req, res) => {
  try {
    const {
      speechType,
      projectName = "โครงการอบรมนักเรียนนายสิบตำรวจ",
      attendeeCount = "1,100 นาย",
      location = "World Peace Valley",
      duration = "23 - 27 กรกฎาคม 2569",
      reporterName = "ผู้แทนคณะกรรมการจัดงาน",
      presidentName = "ผู้บัญชาการโรงเรียนนายสิบตำรวจ",
      monkName = "พระเดชพระคุณพระอาจารย์เจ้าอาวาส",
      tone = "formal",
      customPrompt = "",
    } = req.body;

    const ai = getAiClient();

    let instruction = "";
    if (speechType === "report_opening") {
      instruction = `คุณคือผู้เขียนบทกล่าวมืออาชีพในไทย จงเขียน "คำกล่าวรายงานพิธีเปิด" ของ ${projectName} ณ ${location} จัดขึ้นระหว่างวันที่ ${duration} 
มีผู้เข้าร่วมจำนวน ${attendeeCount} คน (รวมครูฝึก) นำเสนอต่อประธานในพิธีคือ ${presidentName} โดยผู้กล่าวรายงานคือ ${reporterName} 
โทนเสียง: ${tone === "formal" ? "เป็นทางการและสุภาพอย่างยิ่ง" : tone === "inspiring" ? "สร้างแรงบันดาลใจและปลุกพลังบวก" : "อ่อนโยน มีเมตตา อบอุ่น"}. 
${customPrompt ? `รายละเอียดเพิ่มเติม: ${customPrompt}` : ""}
ข้อกำหนดพิเศษ:
- ใช้ภาษาไทยชั้นสูง สุภาพ และถูกต้องตามแบบแผนงานพิธีการราชการไทย
- เรียงลำดับเนื้อหา: นมัสการพระคุณเจ้า (หากมี), กราบเรียนท่านประธานในพิธี, กล่าวถึงวัตถุประสงค์โครงการ, กล่าวถึงกิจกรรมที่จะทำ (เช่น สมาธิ ตักบาตร กลุ่มสัมพันธ์), ยอดผู้เข้าร่วม, และกราบเรียนเชิญประธานกล่าวเปิด
- มีเครื่องหมายขึ้นบรรทัดใหม่ ย่อหน้า ให้อ่านง่าย`;
    } else if (speechType === "open") {
      instruction = `คุณคือผู้เขียนบทกล่าวมืออาชีพในไทย จงเขียน "คำกล่าวเปิดงานโดยประธานในพิธี" สำหรับ ${projectName} ณ ${location} จัดขึ้นระหว่างวันที่ ${duration}
ประธานกล่าวต่อผู้เข้าร่วมอบรมจำนวน ${attendeeCount} คน ประธานในพิธีคือ ${presidentName} 
โทนเสียง: ${tone === "formal" ? "ภูมิฐาน เป็นทางการ มีหลักการและระเบียบวินัย" : tone === "inspiring" ? "ปลุกพลังใจ สร้างความมุ่งมั่น คึกคักและมีเป้าหมายชีวิต" : "อบอุ่น เป็นกันเอง ดุจผู้ใหญ่ชี้แนะบุตรหลาน"}. 
${customPrompt ? `รายละเอียดเพิ่มเติม: ${customPrompt}` : ""}
ข้อกำหนดพิเศษ:
- ใช้ภาษาไทยทางการ สุภาพ งดงาม และสะท้อนความเป็นผู้นำของท่านประธาน
- เรียงลำดับเนื้อหา: นมัสการพระภิกษุสงฆ์, กล่าวขอบคุณผู้จัดงานและคณะวิทยากร, กล่าวชื่นชมยินดีผู้เข้าอบรม, เน้นย้ำความสำคัญของการทำสมาธิ ศีลธรรม การมีระเบียบวินัย ความร่วมมือร่วมใจ, อวยพรให้โครงการสำเร็จลุล่วง และกล่าวเปิดงานอย่างเป็นทางการ
- มีการแบ่งส่วน ย่อหน้าชัดเจน อ่านง่ายสำหรับประธาน`;
    } else if (speechType === "monk_opening") {
      instruction = `คุณคือผู้เขียนบทกล่าวมืออาชีพในไทยและเชี่ยวชาญภาษาธรรมะ จงเขียน "คำกล่าวให้โอวาทธรรม/ต้อนรับในพิธีเปิด" โดยพระอาจารย์ผู้ใหญ่คือ ${monkName} 
ให้แก่ผู้เข้าอบรม ${projectName} จำนวน ${attendeeCount} คน ณ ${location} 
โทนเสียง: ${tone === "formal" ? "สุขุม ลุ่มลึก อุดมด้วยหลักธรรม" : tone === "inspiring" ? "สร้างแสงสว่างทางปัญญาและกำลังใจในการทำความดี" : "เปี่ยมล้นด้วยความเมตตาปรานี อบอุ่น สงบร่มเย็น"}. 
${customPrompt ? `รายละเอียดเพิ่มเติม: ${customPrompt}` : ""}
ข้อกำหนดพิเศษ:
- ใช้คำราชาศัพท์/สรรพนามและสำนวนภาษาธรรมที่ถูกต้องสำหรับพระคุณเจ้า (เช่น เจริญพร ท่านประธานในพิธี และยอดกัลยาณมิตร/ผู้เข้าอบรมทุกท่าน)
- เน้นหลักธรรม เช่น สัมมาทิฏฐิ ความสงบแห่งจิต (สมาธิ) ประโยชน์ของการเรียนรู้ธรรมะเพื่อประยุกต์ใช้ในหน้าที่การงาน (ผู้รักษาความสงบสุขของประชาชน)
- อวยพรให้ทุกคนมีจิตใจที่ผ่องใส มีพลังใจเต็มเปี่ยมในการฝึกฝนตนเอง`;
    } else if (speechType === "report_closing") {
      instruction = `คุณคือผู้เขียนบทกล่าวมืออาชีพในไทย จงเขียน "คำกล่าวรายงานผลการอบรมในพิธีปิด" สำหรับ ${projectName} ณ ${location} 
รายงานต่อประธานในพิธี/พระเดชพระคุณพระอาจารย์ผู้ใหญ่ เพื่อให้ทราบถึงผลสำเร็จของการจัดงานตลอด ${duration} วันที่ผ่านมา 
ผู้กล่าวคือ ${reporterName} 
โทนเสียง: ${tone === "formal" ? "รายงานสรุปอย่างเป็นระบบ เป็นทางการ สุภาพถ่อมตน" : tone === "inspiring" ? "เน้นย้ำความสำเร็จและความเปลี่ยนแปลงเชิงบวกของผู้เข้าอบรม" : "เปี่ยมด้วยความชื่นชมปิติยินดีในความดีงามที่เกิดขึ้น"}. 
${customPrompt ? `รายละเอียดเพิ่มเติม: ${customPrompt}` : ""}
ข้อกำหนดพิเศษ:
- ใช้ภาษาทางการ ถูกต้องตามระเบียบงานราชการและงานศาสนา
- รายงานสถิติสำคัญ: ผู้เข้าอบรม ${attendeeCount} คน และคณะทีมงานผ่านการอบรมอย่างสมบูรณ์, พฤติกรรมที่ก้าวหน้า เช่น ความสามัคคี ความตั้งใจปฏิบัติสมาธิ การสวดมนต์ การตักบาตร, กิจกรรม Walk Rally
- จบด้วยการกราบเรียนเชิญประธานกล่าวปิด มอบใบประกาศเกียรติคุณ และกล่าวคำให้โอวาทธรรมส่งท้าย`;
    } else if (speechType === "close_monk") {
      instruction = `คุณคือผู้เขียนบทกล่าวมืออาชีพในไทยและเชี่ยวชาญภาษาธรรมะ จงเขียน "คำกล่าวปิดการอบรมและให้โอวาทธรรมส่งท้าย" โดยประธาน/พระอาจารย์ผู้ใหญ่คือ ${monkName} 
กล่าวปิดงานและให้ศีลให้พรส่งผู้เข้าอบรม ${projectName} จำนวน ${attendeeCount} นาย ณ ${location} 
โทนเสียง: ${tone === "formal" ? "ศักดิ์สิทธิ์ สุขุม เป็นระบบ ระเบียบเรียบร้อย" : tone === "inspiring" ? "ปลุกพลังใจในการออกไปรับใช้สังคมด้วยความซื่อสัตย์สุจริตและธรรมะ" : "เปี่ยมด้วยความเมตตาอันล้นพ้น อวยพรให้ประสบความสุขความเจริญ"}. 
${customPrompt ? `รายละเอียดเพิ่มเติม: ${customPrompt}` : ""}
ข้อกำหนดพิเศษ:
- ใช้ภาษาธรรมะที่งดงาม สรรพนามเจริญพรแก่ผู้เข้าอบรมทุกคน
- ย้ำให้นำความสงบและสติที่ได้รับจากสมาธิ (ความสุขที่แท้จริงภายใน) ไปใช้ในชีวิตประจำวันและการเป็นตำรวจที่ดีของประชาชน
- ประกาศปิดโครงการอย่างเป็นทางการ และอวยพรให้เดินทางกลับโดยสวัสดิภาพ`;
    } else {
      instruction = `จงเขียนคำกล่าวหรือสุนทรพจน์สำหรับงานอบรมทั่วไปในห้วข้อเกี่ยวกับความดีงามและคุณธรรม ความสงบจากสมาธิ`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: instruction,
    });

    res.json({
      success: true,
      speechText: response.text || "ไม่สามารถเจเนอเรตคำกล่าวได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
    });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});

// Serve frontend assets and Vite middleware
const isProduction = process.env.NODE_ENV === "production";

async function setupServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${isProduction ? "production" : "development"} mode`);
  });
}

setupServer();
