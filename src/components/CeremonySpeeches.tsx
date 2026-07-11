import React, { useState } from "react";
import { SpeechPreset, TrainingProject } from "../types";
import { Speech, Sparkles, Copy, Check, RotateCcw, User, FileText } from "lucide-react";

interface CeremonySpeechesProps {
  project: TrainingProject;
  speeches: SpeechPreset[];
  onUpdateSpeech: (updated: SpeechPreset) => void;
}

export default function CeremonySpeeches({ project, speeches, onUpdateSpeech }: CeremonySpeechesProps) {
  const [activeSpeechType, setActiveSpeechType] = useState<SpeechPreset["speechType"]>("report_opening");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // AI custom states
  const [customPrompt, setCustomPrompt] = useState("");
  const [tone, setTone] = useState<SpeechPreset["tone"]>("formal");
  const [reporterName, setReporterName] = useState("พอจ.หาญชัย (ในนามผู้แทนผู้จัดงาน)");
  const [presidentName, setPresidentName] = useState("ผู้แทนผู้บัญชาการตำรวจ");
  const [monkName, setMonkName] = useState("พระเดชพระคุณพระอาจารย์เจ้าอาวาส");

  const currentSpeech = speeches.find((s) => s.speechType === activeSpeechType) || speeches[0];

  const handleCopy = () => {
    if (currentSpeech && currentSpeech.content) {
      navigator.clipboard.writeText(currentSpeech.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateSpeechWithAI = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/speech/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          speechType: activeSpeechType,
          projectName: project.name,
          attendeeCount: `${project.attendeeCount + project.instructorCount} นาย (ผู้รับการอบรม ${project.attendeeCount} นาย และครูฝึก ${project.instructorCount} นาย)`,
          location: project.location,
          duration: `${project.startDate} ถึง ${project.endDate}`,
          reporterName,
          presidentName,
          monkName,
          tone,
          customPrompt,
        }),
      });

      const data = await res.json();
      if (data.success && data.speechText) {
        onUpdateSpeech({
          ...currentSpeech,
          content: data.speechText,
          reporter: reporterName,
          recipientOrSpeaker: activeSpeechType === "report_opening" || activeSpeechType === "report_closing" ? presidentName : monkName,
          tone,
        });
      } else {
        throw new Error(data.error || "ไม่ได้รับการตอบกลับจากระบบ AI");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "เกิดข้อผิดพลาดในการติดต่อระบบ AI กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill parameters on speech selection change
  const handleSpeechTabChange = (type: SpeechPreset["speechType"]) => {
    setActiveSpeechType(type);
    const found = speeches.find((s) => s.speechType === type);
    if (found) {
      setTone(found.tone);
      if (type === "report_opening" || type === "report_closing") {
        setReporterName(found.reporter || "พอจ.หาญชัย (ในนามผู้แทนผู้จัดงาน)");
        setPresidentName(found.recipientOrSpeaker || "ผู้แทนผู้บัญชาการตำรวจ");
      } else {
        setMonkName(found.recipientOrSpeaker || "พระเดชพระคุณพระอาจารย์เจ้าอาวาส");
      }
    }
  };

  // Agenda list
  const openingAgenda = [
    { time: "13.00 น.", title: "คณะนักเรียนนายสิบตำรวจเข้าประจำจุด", desc: "จัดแถวตามระเบียบวินัย ณ หอปฏิบัติธรรมกิตติมศักดิ์ นั่งสมาธิปรับคลื่นสมองซีกบวก" },
    { time: "13.15 น.", title: "ประธานฝ่ายตำรวจและพระวิทยากรเข้าสู่พื้นที่", desc: "ต้อนรับผู้มีเกียรติและนำเข้าสู่ระเบียบพิธีอย่างสงบ" },
    { time: "13.30 น.", title: "พิธีกรดำเนินรายการ นำบูชาพระรัตนตรัย", desc: "พิธีกรวิทยุกล้าตะวัน แนะนำหลักสูตร ความร่วมมือ และนำสวดมนต์เริ่มต้น" },
    { time: "13.40 น.", title: "กล่าวรายงานวัตถุประสงค์โครงการ", desc: "พอจ.หาญชัย ในนามผู้แทนผู้จัดงาน กล่าวสรุปเป้าหมายและความสำคัญ" },
    { time: "13.50 น.", title: "ประธานฝ่ายตำรวจกล่าวเปิดงานอย่างเป็นทางการ", desc: "ให้โอวาทแก่นักเรียนนายสิบตำรวจ เพื่อเป็นแนวทางในการเรียนรู้ธรรมะ" },
    { time: "14.15 น.", title: "พระอาจารย์ผู้ดูแลให้โอวาทธรรมและมอบนโยบายการอบรม", desc: "พระธรรมเทศนาต้อนรับ ชี้แนวทางปฏิบัติจิตตภาวนาเบื้องต้น" },
    { time: "15.00 น.", title: "เสร็จสิ้นพิธีเปิด นำเข้าสู่ชั่วโมงธรรมปฏิบัติ", desc: "จัดกำลังพลแยกย้ายฝึกหัดระเบียบและการเดินจงกรม" }
  ];

  const closingAgenda = [
    { time: "09.00 น.", title: "ผู้เข้าอบรมพร้อมกัน ณ ห้องปฏิบัติธรรม", desc: "นั่งสมาธิรวมใจ สรุปอุดมการณ์คุณธรรมผู้พิทักษ์สันติราษฎร์" },
    { time: "09.30 น.", title: "พระอาจารย์สรุปผลสัมฤทธิ์และข้อแนะนำ", desc: "แนะแนวทางนำสมาธิและคุณธรรมไปประยุกต์ใช้ในการปฏิบัติหน้าที่จริง" },
    { time: "10.00 น.", title: "พิธีมอบใบประกาศนียบัตรคุณธรรม", desc: "ประธานมอบใบประกาศนียบัตรแก่ผู้แทนนักเรียนนายสิบ และครูฝึกผู้ควบคุมแถว" },
    { time: "10.30 น.", title: "ประธานฝ่ายตำรวจกล่าวปิดการอบรม", desc: "ขอบคุณผู้จัดงานและอวยพรคณะนายสิบเดินทางกลับสู่ที่ตั้งโดยสวัสดิภาพ" },
    { time: "11.00 น.", title: "พิธีลาและสามีจิกรรมขอขมาคณะพระพี่เลี้ยง", desc: "น้อมใจแสดงความกตัญญูกตเวทิตาแด่คณะพระวิทยากรผู้ให้ธรรมส่องทาง" },
    { time: "11.30 น.", title: "รับประทานอาหารกลางวันประสานใจและเดินทางกลับ", desc: "จัดเก็บพื้นที่และสัมภาระเรียบร้อยพร้อมขึ้นรถบัส" }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-md shadow-slate-100/50 overflow-hidden" id="ceremony-speeches">
      <div className="p-6 border-b border-slate-150 bg-slate-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Speech className="text-indigo-600" size={22} />
            วาระพิธีการและคลังคำกล่าวอัจฉริยะ (Opening/Closing Agenda & AI Speeches)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            กำหนดลำดับวาระของพิธีเปิดและปิด พร้อมคำกล่าวให้โอวาทที่ปรับแต่งได้ด้วยพลังของ AI Gemini 3.5 Flash
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-150/60">
        {/* Left Side: Agenda Timeline & Selection */}
        <div className="lg:col-span-5 p-6 space-y-6 bg-slate-50/30">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-3">
              เลือกพิธีการอบรม
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSpeechTabChange("report_opening")}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                  activeSpeechType === "report_opening" || activeSpeechType === "open" || activeSpeechType === "monk_opening"
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50/80 hover:text-slate-900"
                }`}
              >
                พิธีเปิดโครงการ (Opening)
              </button>
              <button
                onClick={() => handleSpeechTabChange("report_closing")}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                  activeSpeechType === "report_closing" || activeSpeechType === "close_monk"
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50/80 hover:text-slate-900"
                }`}
              >
                พิธีปิดโครงการ (Closing)
              </button>
            </div>
          </div>

          {/* Agenda list rendering based on mode */}
          <div className="space-y-4">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              กำหนดวาระอย่างละเอียด (Detailed Agenda Run Sheet)
            </span>
            <div className="space-y-3 relative border-l-2 border-indigo-100 pl-4 ml-2">
              {(activeSpeechType === "report_opening" || activeSpeechType === "open" || activeSpeechType === "monk_opening"
                ? openingAgenda
                : closingAgenda
              ).map((item, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -left-[23px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white ring-4 ring-indigo-50 group-hover:scale-125 transition-transform" />
                  <div className="bg-white/95 hover:bg-slate-50/50 p-3 rounded-xl border border-slate-200/50 shadow-3xs transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {item.time}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Speech Display & AI Refinement Form */}
        <div className="lg:col-span-7 p-6 flex flex-col space-y-6">
          {/* Sub-tabs for specific speech roles */}
          <div className="border-b border-slate-150 pb-3 flex flex-wrap gap-2">
            {activeSpeechType === "report_opening" || activeSpeechType === "open" || activeSpeechType === "monk_opening" ? (
              <>
                <button
                  onClick={() => handleSpeechTabChange("report_opening")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSpeechType === "report_opening"
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  1. คำกล่าวรายงานเปิด
                </button>
                <button
                  onClick={() => handleSpeechTabChange("open")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSpeechType === "open"
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  2. คำกล่าวเปิดโดยประธาน
                </button>
                <button
                  onClick={() => handleSpeechTabChange("monk_opening")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSpeechType === "monk_opening"
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  3. โอวาทธรรมจากพระอาจารย์
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleSpeechTabChange("report_closing")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSpeechType === "report_closing"
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  1. สรุปผลสัมฤทธิ์ในพิธีปิด
                </button>
                <button
                  onClick={() => handleSpeechTabChange("close_monk")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSpeechType === "close_monk"
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  2. กล่าวปิดและให้โอวาทส่งท้าย
                </button>
              </>
            )}
          </div>

          {/* AI Refinement Inputs Form */}
          <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                <Sparkles size={14} className="text-amber-500" />
                ปรับแต่งบทกล่าวนี้ด้วย AI อัจฉริยะ (Gemini 3.5 Flash)
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Server-side Generation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {(activeSpeechType === "report_opening" || activeSpeechType === "report_closing") ? (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">ผู้กล่าวรายงาน</label>
                    <input
                      type="text"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">ประธานผู้รับรายงาน</label>
                    <input
                      type="text"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={presidentName}
                      onChange={(e) => setPresidentName(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">พระวิทยากรผู้ให้โอวาท / ประธานปิดงาน</label>
                  <input
                    type="text"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    value={activeSpeechType === "open" ? presidentName : monkName}
                    onChange={(e) => {
                      if (activeSpeechType === "open") setPresidentName(e.target.value);
                      else setMonkName(e.target.value);
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">โทนเสียงของบทกล่าว (Tone)</label>
                <select
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  value={tone}
                  onChange={(e) => setTone(e.target.value as SpeechPreset["tone"])}
                >
                  <option value="formal">เป็นทางการและสง่างาม (Formal)</option>
                  <option value="inspiring">สร้างแรงบันดาลใจและปลุกพลังใจ (Inspiring)</option>
                  <option value="compassionate">เปี่ยมล้นความเมตตาและอบอุ่น (Compassionate)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">แนวทางการปรับแต่งเพิ่มเติม (คีย์เวิร์ดพิเศษ)</label>
                <input
                  type="text"
                  placeholder="เช่น เน้นระเบียบวินัยตำรวจ, พายุฝน, การล้างชาม, ตักบาตรเช้า"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder-slate-400"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={generateSpeechWithAI}
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 disabled:from-indigo-400 disabled:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} className="animate-pulse text-amber-300" />
              {loading ? "กำลังแต่งบทกล่าวด้วย AI... (ใช้เวลาประมาณ 3-5 วินาที)" : "ปรับแต่งและเขียนใหม่ด้วย AI อัจฉริยะ (Gemini)"}
            </button>
          </div>

          {/* Speech Paper Sheet */}
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm bg-stone-50/50 speech-paper relative flex-1 min-h-[400px] flex flex-col">
            {/* Paper Header */}
            <div className="bg-white px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-800">
                  {currentSpeech?.title || "บทกล่าวต้อนรับ"}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold border ${
                  currentSpeech?.tone === "formal" ? "bg-slate-50 border-slate-200 text-slate-700" :
                  currentSpeech?.tone === "inspiring" ? "bg-indigo-50 border-indigo-200 text-indigo-700" :
                  "bg-orange-50 border-orange-200 text-orange-700"
                }`}>
                  {currentSpeech?.tone === "formal" ? "เป็นทางการ" :
                   currentSpeech?.tone === "inspiring" ? "สร้างพลังบวก" : "เมตตาอบอุ่น"}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-600" /> คัดลอกสำเร็จ!
                  </>
                ) : (
                  <>
                    <Copy size={13} /> คัดลอกบทกล่าว
                  </>
                )}
              </button>
            </div>

            {/* Speech Content text area / display */}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              {loading ? (
                <div className="my-auto py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                  <div className="text-center space-y-1">
                    <p className="text-xs font-semibold text-indigo-950">กำลังเรียบเรียงธรรมะและบทกล่าว...</p>
                    <p className="text-[10px] text-slate-400 italic">"ความเงียบสงบก่อเกิดปัญญา มธุรสวาจาก็ก่อเกิดแรงใจ"</p>
                  </div>
                </div>
              ) : errorMsg ? (
                <div className="my-auto py-8 text-center space-y-3">
                  <p className="text-xs font-medium text-rose-600">{errorMsg}</p>
                  <button
                    onClick={generateSpeechWithAI}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors"
                  >
                    <RotateCcw size={12} /> ลองใหม่อีกครั้ง
                  </button>
                </div>
              ) : (
                <div className="text-slate-800 font-sans text-[13px] md:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {currentSpeech?.content || ""}
                </div>
              )}

              {/* Speech Footer Info */}
              {!loading && !errorMsg && currentSpeech && (
                <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center text-[11px] text-slate-400 font-medium">
                  <div className="flex items-center gap-1">
                    <User size={13} />
                    <span>ผู้กล่าว: {activeSpeechType === "report_opening" || activeSpeechType === "report_closing" ? currentSpeech.reporter : currentSpeech.recipientOrSpeaker}</span>
                  </div>
                  <div>
                    <span>ปรับปรุงล่าสุด: ระบบอัตโนมัติคัดกรองโดย AI</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
