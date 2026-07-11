import React, { useState } from "react";
import { EvaluationResult, TrainingProject, StaffRow, ScheduleItem, BudgetItem, SpeechPreset } from "../types";
import { Award, CheckCircle, Star, ThumbsUp, ChevronRight, FileText, Printer, Check, X, Sparkles, HelpCircle } from "lucide-react";

interface PostEvaluationProps {
  project: TrainingProject;
  staffRows: StaffRow[];
  schedule: ScheduleItem[];
  budgetItems: BudgetItem[];
  speeches: SpeechPreset[];
  evaluation: EvaluationResult;
  onUpdateEvaluation: (updated: EvaluationResult) => void;
}

export default function PostEvaluation({
  project,
  staffRows,
  schedule,
  budgetItems,
  speeches,
  evaluation,
  onUpdateEvaluation,
}: PostEvaluationProps) {
  const [edited, setEdited] = useState<EvaluationResult>({ ...evaluation });
  const [showReportModal, setShowReportModal] = useState(false);
  const [saved, setSaved] = useState(false);

  // Computations for report
  const totalWP1 = staffRows.reduce((sum, r) => sum + (r.monkWP1 || 0), 0);
  const totalWP2 = staffRows.reduce((sum, r) => sum + (r.monkWP2 || 0), 0);
  const totalWP3 = staffRows.reduce((sum, r) => sum + (r.monkWP3 || 0), 0);
  const totalMonks = totalWP1 + totalWP2 + totalWP3;
  const totalStaff = staffRows.reduce((sum, r) => sum + (r.maleStaff || 0) + (r.femaleStaff || 0), 0);
  const totalIncome = budgetItems.filter(i => i.category === "income").reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalExpense = budgetItems.filter(i => i.category === "expense").reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const handleSave = () => {
    onUpdateEvaluation(edited);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderStars = (rating: number, field: keyof EvaluationResult) => {
    return (
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setEdited({ ...edited, [field]: star })}
            className="focus:outline-none transition-transform active:scale-125 cursor-pointer"
          >
            <Star
              size={18}
              className={`${
                star <= rating ? "text-amber-500 fill-amber-400" : "text-gray-200 hover:text-amber-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden" id="post-evaluation">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <ThumbsUp className="text-indigo-600" size={22} />
            ระบบสรุปประเมินผลโครงการ (Project Evaluation & SWOT)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            บันทึกคะแนนตัวชี้วัดความพึงพอใจ วิเคราะห์ปัจจัยแวดล้อม และจัดทำรายงานสรุปเสนอผู้บังคับบัญชาและวัด
          </p>
        </div>
        
        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Printer size={14} /> ออกเอกสารรายงานฉบับสมบูรณ์
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core KPIs rating */}
        <div className="lg:col-span-5 space-y-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">ดัชนีชี้วัดหลักประสิทธิภาพงานอบรม (KPIs)</h3>

          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-xl space-y-4">
            {/* Objective met */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <span className="text-xs font-bold text-gray-700">ผลสัมฤทธิ์บรรลุวัตถุประสงค์หรือไม่?</span>
              <button
                type="button"
                onClick={() => setEdited({ ...edited, objectivesMet: !edited.objectivesMet })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                  edited.objectivesMet
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-rose-50 text-rose-700 border-rose-300"
                }`}
              >
                {edited.objectivesMet ? (
                  <>
                    <CheckCircle size={14} /> บรรลุวัตถุประสงค์
                  </>
                ) : (
                  <>
                    <X size={14} /> ไม่บรรลุเป้าหมาย
                  </>
                )}
              </button>
            </div>

            {/* Score 1 */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-700">ระเบียบวินัยตำรวจและความตรงต่อเวลา</h4>
                <p className="text-[10px] text-gray-400">การเข้าจัดแถว ล้างจาน จัดที่พัก</p>
              </div>
              {renderStars(edited.scoreProductivity, "scoreProductivity")}
            </div>

            {/* Score 2 */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-700">ความสงบภายในและการพัฒนาสมาธิ</h4>
                <p className="text-[10px] text-gray-400">การเจริญภาวนา นิ่งสงบสวดมนต์</p>
              </div>
              {renderStars(edited.scoreMindfulness, "scoreMindfulness")}
            </div>

            {/* Score 3 */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-700">การลื่นไหลของการประสานงานและทีมอุปัฏฐาก</h4>
                <p className="text-[10px] text-gray-400">การจราจร คอยดูแลไลน์อาหาร ตักบาตร</p>
              </div>
              {renderStars(edited.scoreDiscipline, "scoreDiscipline")}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">สรุปคำชี้แจงประเมินโครงการโดยรวม</label>
            <textarea
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg h-24 focus:outline-indigo-500 text-gray-700 font-medium"
              value={edited.summaryComments}
              onChange={(e) => setEdited({ ...edited, summaryComments: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
            >
              <Check size={14} /> บันทึกผลการประเมิน
            </button>
            {saved && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 animate-pulse">
                <CheckCircle size={14} /> บันทึกเรียบร้อย
              </span>
            )}
          </div>
        </div>

        {/* SWOT Analysis Inputs */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">บทวิเคราะห์ปัจจัยแวดล้อมเชิงกลยุทธ์ (SWOT Analysis)</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* S */}
            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1.5">
              <span className="font-extrabold text-emerald-800 tracking-wider">Strengths (จุดแข็ง)</span>
              <textarea
                className="w-full text-xs p-2 border border-emerald-200 bg-white rounded-lg h-24 focus:outline-emerald-500 text-gray-700 leading-normal"
                value={edited.swotStrengths}
                onChange={(e) => setEdited({ ...edited, swotStrengths: e.target.value })}
              />
            </div>

            {/* W */}
            <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl space-y-1.5">
              <span className="font-extrabold text-rose-800 tracking-wider">Weaknesses (จุดอ่อน)</span>
              <textarea
                className="w-full text-xs p-2 border border-rose-200 bg-white rounded-lg h-24 focus:outline-rose-500 text-gray-700 leading-normal"
                value={edited.swotWeaknesses}
                onChange={(e) => setEdited({ ...edited, swotWeaknesses: e.target.value })}
              />
            </div>

            {/* O */}
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1.5">
              <span className="font-extrabold text-indigo-800 tracking-wider">Opportunities (โอกาสพัฒนา)</span>
              <textarea
                className="w-full text-xs p-2 border border-indigo-200 bg-white rounded-lg h-24 focus:outline-indigo-500 text-gray-700 leading-normal"
                value={edited.swotOpportunities}
                onChange={(e) => setEdited({ ...edited, swotOpportunities: e.target.value })}
              />
            </div>

            {/* T */}
            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl space-y-1.5">
              <span className="font-extrabold text-amber-800 tracking-wider">Threats (อุปสรรค)</span>
              <textarea
                className="w-full text-xs p-2 border border-amber-200 bg-white rounded-lg h-24 focus:outline-amber-500 text-gray-700 leading-normal"
                value={edited.swotThreats}
                onChange={(e) => setEdited({ ...edited, swotThreats: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* REPORT MODAL (OFFICIAL MONASTIC-POLICE FORMATTED SUMMARY DOSSIER) */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn" id="report-modal">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-900">
              <div className="flex items-center gap-2">
                <FileText className="text-indigo-400" size={18} />
                <span className="text-xs font-bold tracking-wider">เอกสารราชการและธรรมะสรุปผลโครงการ</span>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Content - Formal Document */}
            <div className="p-8 md:p-12 overflow-y-auto bg-stone-50 speech-paper flex-1 font-sans text-gray-900">
              {/* Garuda Emblem or Thai Monastic Stylized Emblem */}
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-indigo-900 text-amber-400 rounded-full flex items-center justify-center font-extrabold text-xl mx-auto border-2 border-amber-400 shadow-md mb-2">
                  คุณ
                </div>
                <h1 className="text-base font-extrabold tracking-wide uppercase">รายงานผลการดําเนินงานฉบับสมบูรณ์</h1>
                <p className="text-[11px] text-gray-500 font-bold tracking-wider mt-1">{project.name}</p>
                <p className="text-[10px] text-gray-400">ศูนย์ปฏิบัติธรรม World Peace Valley • 23 - 27 กรกฎาคม 2569</p>
              </div>

              {/* Document details */}
              <div className="space-y-6 text-xs md:text-sm leading-relaxed">
                <div className="border-t border-b border-gray-200 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white px-4 rounded-lg">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold">สถานที่ตั้งหลัก</span>
                    <span className="font-semibold text-gray-800">{project.location}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold">ยอดผู้เข้ารับการอบรม</span>
                    <span className="font-semibold text-gray-800">{project.attendeeCount + project.instructorCount} นาย</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold">ภิกษุสงฆ์ผู้จัดวิปัสสนา</span>
                    <span className="font-semibold text-gray-800">{totalMonks} รูป (แยกกุฏิ WP1-3)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold">ดุลยภาพงบประมาณจัดงาน</span>
                    <span className="font-semibold text-emerald-700">คงเหลือ ฿{(totalIncome - totalExpense).toLocaleString()}</span>
                  </div>
                </div>

                {/* Section 1: Introduction */}
                <div>
                  <h3 className="text-xs font-bold text-indigo-900 border-l-2 border-indigo-600 pl-2 mb-2">๑. บทสรุปโครงการและสาระสำคัญ</h3>
                  <p className="text-gray-700 text-xs indent-8 leading-relaxed font-medium">
                    ด้วยโรงเรียนนายสิบตำรวจและฝ่ายอบรมกองภาวนา ได้ดำเนินโครงการการฝึกอบรมคุณธรรม สมาธิ และระเบียบวินัยระหว่างวันที่ {project.startDate} ถึง {project.endDate} ณ สถานปฏิบัติธรรม {project.location} โดยมีกำลังพลเข้าร่วมทั้งสิ้น {project.attendeeCount + project.instructorCount} นาย (แยกเป็นผู้เข้าร่วมอบรม {project.attendeeCount} นาย และครูฝึกผู้คุมแถวดูแลวินัยอย่างเข้มงวดอีก {project.instructorCount} นาย) วัตถุประสงค์เพื่อชำระล้างจิตใจให้ผุดผ่อง ปลูกฝังค่านิยมสัมมาทิฏฐิ และการปฏิบัติตามหลักธรรมทางพระพุทธศาสนาในการเป็นตำรวจน้ำดีของประชาชน
                  </p>
                </div>

                {/* Section 2: Speeches Record */}
                <div>
                  <h3 className="text-xs font-bold text-indigo-900 border-l-2 border-indigo-600 pl-2 mb-2">๒. บันทึกคำกล่าวพิธีเปิด-ปิดอัจฉริยะ (Selected Speeches)</h3>
                  <div className="space-y-3">
                    {speeches.slice(0, 3).map((speech) => (
                      <div key={speech.id} className="p-3 bg-white border border-gray-200 rounded-lg text-xs font-medium space-y-1">
                        <span className="font-extrabold text-orange-800">{speech.title}</span>
                        <p className="text-[11px] text-gray-400">บทกล่าวบทบาท: {speech.reporter || speech.recipientOrSpeaker}</p>
                        <p className="text-gray-600 italic text-[11px] line-clamp-3 mt-1">"{speech.content}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Staffing Breakdown */}
                <div>
                  <h3 className="text-xs font-bold text-indigo-900 border-l-2 border-indigo-600 pl-2 mb-2">๓. สถิติกำลังพลและระบบพี่เลี้ยงผู้ประสานงาน</h3>
                  <p className="text-gray-700 text-xs leading-relaxed font-medium mb-2">
                    สรุปการแบ่งสรรกำลังพลพระภิกษุสงฆ์วิทยากร พี่เลี้ยง อุปัฏฐากแก้ว ทีมงานจราจร และโฆษกผู้สร้างบรรยากาศเชิงบวกรวมทั้งสิ้น {staffRows.length} ฝ่ายงาน ยอดรวมอัตรากำลังเป็น <strong>{totalMonks} รูป</strong> (จำแนกที่พัก WP1: {totalWP1} รูป, WP2: {totalWP2} รูป, WP3: {totalWP3} รูป) และเจ้าหน้าที่ฆราวาสอาสาสมัครรวม <strong>{totalStaff} คน</strong>
                  </p>
                </div>

                {/* Section 4: Budget Details */}
                <div>
                  <h3 className="text-xs font-bold text-indigo-900 border-l-2 border-indigo-600 pl-2 mb-2">๔. สรุปบัญชีงบประมาณโครงการ</h3>
                  <p className="text-gray-700 text-xs leading-relaxed font-medium mb-1">
                    รายรับโครงการรวมทั้งสิ้น <strong>฿{totalIncome.toLocaleString()}</strong> ค่าเบิกใช้สอยอย่างมีระบบรวม <strong>฿{totalExpense.toLocaleString()}</strong> ส่งผลให้มีงบประมาณกัลยาณมิตรคงค้างนำไปบำรุงพระพุทธศาสนาสนับสนุนสถานที่ World Peace Valley สุทธิ <strong>฿{(totalIncome - totalExpense).toLocaleString()}</strong> อัตราเฉลี่ยค่าใช้จ่ายรายหัวเป็น <strong>฿{Math.round(totalExpense / (project.attendeeCount + project.instructorCount)).toLocaleString()} / นาย</strong>
                  </p>
                </div>

                {/* Section 5: SWOT & KPIs */}
                <div>
                  <h3 className="text-xs font-bold text-indigo-900 border-l-2 border-indigo-600 pl-2 mb-2">๕. ผลการประเมินวิเคราะห์ประสิทธิภาพหลังงาน (SWOT)</h3>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-gray-700">ผลสรุปเป้าหมาย:</span>
                      <span className="font-semibold text-emerald-700">บรรลุวัตถุประสงค์ของตำรวจเป็นเลิศด้วยคุณธรรมสมาธิ</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong className="text-emerald-700 block mb-1">✓ จุดแข็งโครงการ:</strong>
                        <p className="text-[11px] text-gray-500 whitespace-pre-wrap">{edited.swotStrengths}</p>
                      </div>
                      <div>
                        <strong className="text-rose-700 block mb-1">✗ ปัจจัยที่ต้องปรับปรุง:</strong>
                        <p className="text-[11px] text-gray-500 whitespace-pre-wrap">{edited.swotWeaknesses}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sign-offs */}
                <div className="pt-8 flex justify-around text-center text-xs font-bold text-gray-800">
                  <div className="space-y-12">
                    <span>ลงชื่อ..............................................................<br />( พระอาจารย์ผู้กำกับดูแลวิปัสสนาการอบรม )</span>
                  </div>
                  <div className="space-y-12">
                    <span>ลงชื่อ..............................................................<br />( ผู้บัญชาการตำรวจ ประธานสรุปผลโครงการ )</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-between">
              <span className="text-[11px] text-gray-400 self-center font-semibold">พิมพ์เมื่อ: {new Date().toLocaleDateString("th-TH")}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold bg-white hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer flex items-center gap-1"
                >
                  <Printer size={13} /> ปริ้นท์รายงานเอกสารนี้
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
