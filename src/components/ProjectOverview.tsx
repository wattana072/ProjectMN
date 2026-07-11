import React, { useState } from "react";
import { TrainingProject } from "../types";
import { Calendar, MapPin, Users, Award, BookOpen, Edit2, Save, Sparkles } from "lucide-react";

interface ProjectOverviewProps {
  project: TrainingProject;
  onUpdateProject: (updated: TrainingProject) => void;
}

export default function ProjectOverview({ project, onUpdateProject }: ProjectOverviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState<TrainingProject>({ ...project });

  const handleSave = () => {
    onUpdateProject(edited);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-md shadow-slate-100/50 overflow-hidden" id="project-overview-card">
      <div className="p-8 md:p-10 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white relative">
        <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
          <Sparkles size={120} />
        </div>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs text-indigo-300 font-semibold mb-4 shadow-sm">
            <Award size={14} /> โครงการฝึกอบรมระดับพรีเมียม
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">ชื่อโครงการอบรม</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  value={edited.name}
                  onChange={(e) => setEdited({ ...edited, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">สถานที่จัดงาน</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    value={edited.location}
                    onChange={(e) => setEdited({ ...edited, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">กลุ่มเป้าหมาย / คำอธิบายผู้ร่วมงาน</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    value={edited.attendeesDescription}
                    onChange={(e) => setEdited({ ...edited, attendeesDescription: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">วันที่เริ่มต้น</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    value={edited.startDate}
                    onChange={(e) => setEdited({ ...edited, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">วันที่สิ้นสุด</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    value={edited.endDate}
                    onChange={(e) => setEdited({ ...edited, endDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ยอดผู้เข้าร่วม (นาย)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    value={edited.attendeeCount}
                    onChange={(e) => setEdited({ ...edited, attendeeCount: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ยอดครูฝึก (นาย)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    value={edited.instructorCount}
                    onChange={(e) => setEdited({ ...edited, instructorCount: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">วัตถุประสงค์และหมายเหตุเพิ่มเติม</label>
                <textarea
                  className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-white h-20 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  value={edited.notes}
                  onChange={(e) => setEdited({ ...edited, notes: e.target.value })}
                />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-snug text-white mb-3">
                {project.name}
              </h1>
              <p className="text-slate-300 text-sm md:text-base font-medium max-w-3xl mb-6 leading-relaxed">
                {project.notes}
              </p>
            </>
          )}

          <div className="flex flex-wrap gap-y-3 gap-x-6 text-xs text-slate-300 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-indigo-400" />
              <span>วันที่: <span className="font-bold text-white">{project.startDate} ถึง {project.endDate}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-emerald-400" />
              <span>สถานที่: <span className="font-bold text-white">{project.location}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={15} className="text-amber-400" />
              <span>กลุ่มเป้าหมาย: <span className="font-bold text-white">{project.attendeesDescription}</span></span>
            </div>
          </div>
        </div>

        <div className="absolute right-6 bottom-6 flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-all border border-slate-700 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <Save size={13} /> บันทึก
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setEdited({ ...project });
                setIsEditing(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-xs transition-all border border-white/10 cursor-pointer"
            >
              <Edit2 size={13} /> แก้ไขข้อมูลโครงการ
            </button>
          )}
        </div>
      </div>

      {/* Overview Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/40" id="overview-stats-grid">
        <div className="p-6 flex items-center gap-4.5 hover:bg-white/55 transition-colors">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-2xs">
            <Users size={24} />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">ยอดผู้รับการอบรมจริง</div>
            <div className="text-2xl font-black text-slate-800">
              {project.attendeeCount.toLocaleString()} <span className="text-xs font-medium text-slate-500">นาย</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">โรงเรียนนายสิบตำรวจ</div>
          </div>
        </div>
        
        <div className="p-6 flex items-center gap-4.5 hover:bg-white/55 transition-colors">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-2xs">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">ครูฝึกผู้คุมแถว</div>
            <div className="text-2xl font-black text-slate-800">
              {project.instructorCount.toLocaleString()} <span className="text-xs font-medium text-slate-500">นาย</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">ควบคุมระเบียบวินัยใกล้ชิด</div>
          </div>
        </div>

        <div className="p-6 flex items-center gap-4.5 hover:bg-white/55 transition-colors">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shadow-2xs">
            <Award size={24} />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">ยอดรวมผู้เข้าร่วมหลัก</div>
            <div className="text-2xl font-black text-slate-800">
              {(project.attendeeCount + project.instructorCount).toLocaleString()} <span className="text-xs font-medium text-slate-500">นาย</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">จัดกิจกรรม ณ World Peace Valley</div>
          </div>
        </div>
      </div>
    </div>
  );
}
