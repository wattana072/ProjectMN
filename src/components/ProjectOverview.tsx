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
      <div className="p-8 md:p-10 bg-gradient-to-br from-slate-50 via-slate-100/90 to-slate-150/70 text-slate-800 border-b border-slate-200/40 relative">
        <div className="absolute right-6 top-6 text-slate-400 opacity-[0.12] pointer-events-none">
          <Sparkles size={120} />
        </div>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-[11px] text-indigo-700 font-bold mb-4 shadow-3xs">
            <Award size={14} /> โครงการฝึกอบรมระดับพรีเมียม
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">ชื่อโครงการอบรม</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-white border border-slate-250 rounded-xl text-slate-800 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                  value={edited.name}
                  onChange={(e) => setEdited({ ...edited, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">สถานที่จัดงาน</label>
                  <input
                     type="text"
                     className="w-full px-3 py-2 bg-white border border-slate-250 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                     value={edited.location}
                     onChange={(e) => setEdited({ ...edited, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">กลุ่มเป้าหมาย / คำอธิบายผู้ร่วมงาน</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-white border border-slate-250 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                    value={edited.attendeesDescription}
                    onChange={(e) => setEdited({ ...edited, attendeesDescription: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">วันที่เริ่มต้น</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-white border border-slate-250 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    value={edited.startDate}
                    onChange={(e) => setEdited({ ...edited, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">วันที่สิ้นสุด</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-white border border-slate-250 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    value={edited.endDate}
                    onChange={(e) => setEdited({ ...edited, endDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">ยอดผู้เข้าร่วม (นาย)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-white border border-slate-250 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                    value={edited.attendeeCount}
                    onChange={(e) => setEdited({ ...edited, attendeeCount: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">ยอดครูฝึก (นาย)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-white border border-slate-250 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                    value={edited.instructorCount}
                    onChange={(e) => setEdited({ ...edited, instructorCount: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">วัตถุประสงค์และหมายเหตุเพิ่มเติม</label>
                <textarea
                  className="w-full px-3 py-2 bg-white border border-slate-250 rounded-xl text-slate-800 h-20 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  value={edited.notes}
                  onChange={(e) => setEdited({ ...edited, notes: e.target.value })}
                />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-snug text-slate-900 mb-3">
                {project.name}
              </h1>
              <p className="text-slate-600 text-xs md:text-sm font-medium max-w-3xl mb-6 leading-relaxed">
                {project.notes}
              </p>
            </>
          )}

          <div className="flex flex-wrap gap-y-3 gap-x-6 text-xs text-slate-500 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-indigo-600" />
              <span>วันที่: <span className="font-bold text-slate-800">{project.startDate} ถึง {project.endDate}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-emerald-600" />
              <span>สถานที่: <span className="font-bold text-slate-800">{project.location}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={15} className="text-amber-600" />
              <span>กลุ่มเป้าหมาย: <span className="font-bold text-slate-800">{project.attendeesDescription}</span></span>
            </div>
          </div>
        </div>

        <div className="absolute right-6 bottom-6 flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl transition-all border border-slate-200 cursor-pointer shadow-3xs"
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
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80 transition-all shadow-3xs cursor-pointer"
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
