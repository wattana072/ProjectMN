import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  initialProject,
  initialSchedule,
  initialStaff,
  initialSpeeches,
  initialBudget,
  initialEvaluation,
} from "./initialData";
import { TrainingProject, ScheduleItem, StaffRow, SpeechPreset, BudgetItem, EvaluationResult } from "./types";
import ProjectOverview from "./components/ProjectOverview";
import SchedulePlanner from "./components/SchedulePlanner";
import CeremonySpeeches from "./components/CeremonySpeeches";
import StaffCoordinator from "./components/StaffCoordinator";
import BudgetManager from "./components/BudgetManager";
import PostEvaluation from "./components/PostEvaluation";
import { LayoutDashboard, Calendar, Speech, Users, Coins, ThumbsUp, Landmark, Flame } from "lucide-react";

export default function App() {
  // State definitions
  const [project, setProject] = useState<TrainingProject>(initialProject);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [staffRows, setStaffRows] = useState<StaffRow[]>(initialStaff);
  const [speeches, setSpeeches] = useState<SpeechPreset[]>(initialSpeeches);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudget);
  const [evaluation, setEvaluation] = useState<EvaluationResult>(initialEvaluation);

  // Active Tab navigation
  const [activeTab, setActiveTab] = useState<
    "overview" | "schedule" | "ceremonies" | "staff" | "budget" | "evaluation"
  >("overview");

  // State handlers
  const handleUpdateProject = (updated: TrainingProject) => {
    setProject(updated);
  };

  const handleAddSchedule = (newItem: Omit<ScheduleItem, "id">) => {
    const randomId = `sch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSchedule([...schedule, { ...newItem, id: randomId }]);
  };

  const handleUpdateSchedule = (updatedItem: ScheduleItem) => {
    setSchedule(schedule.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedule(schedule.filter((item) => item.id !== id));
  };

  const handleUpdateStaff = (updatedRow: StaffRow) => {
    setStaffRows(staffRows.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
  };

  const handleUpdateSpeech = (updatedSpeech: SpeechPreset) => {
    setSpeeches(speeches.map((s) => (s.id === updatedSpeech.id ? updatedSpeech : s)));
  };

  const handleAddBudgetItem = (newItem: Omit<BudgetItem, "id" | "amount">) => {
    const randomId = `b-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const calculatedAmount = newItem.quantity * newItem.unitPrice;
    setBudgetItems([...budgetItems, { ...newItem, id: randomId, amount: calculatedAmount }]);
  };

  const handleDeleteBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter((item) => item.id !== id));
  };

  const handleUpdateEvaluation = (updatedEval: EvaluationResult) => {
    setEvaluation(updatedEval);
  };

  const totalAttendees = project.attendeeCount + project.instructorCount;

  // Tabs metadata
  const tabs = [
    { id: "overview", label: "ภาพรวมโครงการ", icon: LayoutDashboard },
    { id: "schedule", label: "กำหนดการตารางกิจกรรม", icon: Calendar },
    { id: "ceremonies", label: "วาระพิธีเปิด-ปิด & คำกล่าว AI", icon: Speech },
    { id: "staff", label: "ทีมงานและการเดินทาง", icon: Users },
    { id: "budget", label: "งบประมาณการเงิน", icon: Coins },
    { id: "evaluation", label: "สรุปประเมินผลโครงการ", icon: ThumbsUp },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col" id="app-root">
      {/* Top Main Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-xs sticky top-0 z-40" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm">
              <Landmark size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">
                Google AI Studio • Build System
              </span>
              <h1 className="text-sm font-extrabold tracking-tight text-slate-900 leading-none">
                TCMS: ระบบบริหารจัดโครงการและหลักสูตรอบรมอัจฉริยะ
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200/50">
              <Flame size={12} className="text-amber-500 animate-pulse" />
              ธรรมะบำรุงจิตและเสริมวินัย
            </span>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold block">
                ปีพุทธศักราช {new Date().getFullYear() + 543}
              </span>
              <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50/80 px-2.5 py-1 rounded-full border border-indigo-100">
                สถานะโครงการ: อยู่ระหว่างดำเนินงาน
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" id="main-content">
        {/* Navigation Tab Rails */}
        <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/40 shadow-2xs flex flex-wrap gap-1.5" id="navigation-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4.5 py-3 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs scale-[1.02]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content space with animations */}
        <div className="relative min-h-[500px]" id="tab-content-container">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <ProjectOverview project={project} onUpdateProject={handleUpdateProject} />
              </motion.div>
            )}

            {activeTab === "schedule" && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <SchedulePlanner
                  schedule={schedule}
                  onAddSchedule={handleAddSchedule}
                  onUpdateSchedule={handleUpdateSchedule}
                  onDeleteSchedule={handleDeleteSchedule}
                />
              </motion.div>
            )}

            {activeTab === "ceremonies" && (
              <motion.div
                key="ceremonies"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <CeremonySpeeches
                  project={project}
                  speeches={speeches}
                  onUpdateSpeech={handleUpdateSpeech}
                />
              </motion.div>
            )}

            {activeTab === "staff" && (
              <motion.div
                key="staff"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <StaffCoordinator staffRows={staffRows} onUpdateStaff={handleUpdateStaff} />
              </motion.div>
            )}

            {activeTab === "budget" && (
              <motion.div
                key="budget"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <BudgetManager
                  budgetItems={budgetItems}
                  totalAttendees={totalAttendees}
                  onAddBudgetItem={handleAddBudgetItem}
                  onDeleteBudgetItem={handleDeleteBudgetItem}
                />
              </motion.div>
            )}

            {activeTab === "evaluation" && (
              <motion.div
                key="evaluation"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <PostEvaluation
                  project={project}
                  staffRows={staffRows}
                  schedule={schedule}
                  budgetItems={budgetItems}
                  speeches={speeches}
                  evaluation={evaluation}
                  onUpdateEvaluation={handleUpdateEvaluation}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer information section */}
      <footer className="bg-white border-t border-gray-100 py-6 mt-12 text-center text-[11px] text-gray-400 font-medium">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear() + 543} TCMS: โครงการอบรมศีลธรรมตำรวจและวินัยสัมบูรณ์ • คณะวิทยากร World Peace Valley</p>
          <p className="mt-1 text-gray-300">ประมวลผลอัจฉริยะร่วมกับ API Google Gemini 3.5 Flash เพื่อการเขียนสุนทรพจน์ระดับงานราชการสมบูรณ์แบบ</p>
        </div>
      </footer>
    </div>
  );
}
