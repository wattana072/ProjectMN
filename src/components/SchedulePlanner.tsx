import React, { useState } from "react";
import { ScheduleItem } from "../types";
import { Calendar, Plus, Trash2, Edit2, Check, Clock, User, ShieldCheck } from "lucide-react";

interface SchedulePlannerProps {
  schedule: ScheduleItem[];
  onAddSchedule: (item: Omit<ScheduleItem, "id">) => void;
  onUpdateSchedule: (item: ScheduleItem) => void;
  onDeleteSchedule: (id: string) => void;
}

export default function SchedulePlanner({
  schedule,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
}: SchedulePlannerProps) {
  // Day tabs: 23, 24, 25, 26, 27
  const uniqueDays = Array.from(new Set(schedule.map((item) => item.day))).sort();
  const [selectedDay, setSelectedDay] = useState<number>(uniqueDays[0] || 23);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ScheduleItem>>({});

  // Adding state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<Omit<ScheduleItem, "id">>({
    day: selectedDay,
    timeSlot: "morning",
    timeSlotLabel: "สาย 09.00 - 11.30 น.",
    timeRange: "09.00 - 11.30 น.",
    activity: "",
    coordinator: "",
    monkInCharge: "",
  });

  const filteredSchedule = schedule.filter((item) => item.day === selectedDay);

  const startEdit = (item: ScheduleItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const saveEdit = () => {
    if (editingId && editForm) {
      onUpdateSchedule(editForm as ScheduleItem);
      setEditingId(null);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSchedule({ ...addForm, day: selectedDay });
    setAddForm({
      day: selectedDay,
      timeSlot: "morning",
      timeSlotLabel: "สาย 09.00 - 11.30 น.",
      timeRange: "09.00 - 11.30 น.",
      activity: "",
      coordinator: "",
      monkInCharge: "",
    });
    setShowAddForm(false);
  };

  // Helper for slot labels
  const getSlotColor = (slot: string) => {
    switch (slot) {
      case "early_morning":
        return "bg-amber-50 text-amber-700 border-amber-200/50";
      case "breakfast":
        return "bg-orange-50 text-orange-700 border-orange-200/50";
      case "morning":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/50";
      case "lunch":
        return "bg-teal-50 text-teal-700 border-teal-200/50";
      case "afternoon":
        return "bg-blue-50 text-blue-700 border-blue-200/50";
      case "evening":
        return "bg-purple-50 text-purple-700 border-purple-200/50";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getSlotThai = (slot: string) => {
    switch (slot) {
      case "early_morning":
        return "ตื่นนอน/สวดมนต์เช้า";
      case "breakfast":
        return "รับประทานอาหารเช้า";
      case "morning":
        return "ช่วงสาย";
      case "lunch":
        return "รับประทานอาหารกลางวัน";
      case "afternoon":
        return "ช่วงบ่าย";
      case "evening":
        return "ช่วงค่ำ/แผ่เมตตา";
      default:
        return slot;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-md shadow-slate-100/50 overflow-hidden" id="schedule-planner">
      {/* Header section */}
      <div className="p-6 border-b border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="text-indigo-600" size={22} />
            กำหนดการจัดอบรมรายวัน (23 - 27 กรกฎาคม 2569)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ระบุรายละเอียดกิจกรรม วิทยากร และคณะพระพี่เลี้ยงในแต่ละช่วงเวลา
          </p>
        </div>

        {/* Day selection tabs */}
        <div className="flex gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl self-start sm:self-center border border-slate-200/30">
          {uniqueDays.map((day) => (
            <button
              key={day}
              onClick={() => {
                setSelectedDay(day);
                setAddForm((prev) => ({ ...prev, day }));
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDay === day
                  ? "bg-white text-indigo-600 shadow-2xs border border-slate-200/30"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              2{day - 20} ก.ค. 69 (วันที่ {day - 22})
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Detail banners for opening/closing */}
        {selectedDay === 23 && (
          <div className="mb-6 p-4 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-start gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-indigo-950">ไฮไลท์ประจำวัน: พิธีเปิดโครงการและปฐมนิเทศ</h3>
              <p className="text-xs text-indigo-800/80 mt-0.5 leading-relaxed">
                กิจกรรมสำคัญในตอนบ่าย 13.00 น. ประกอบด้วย พิธีเปิดอย่างเป็นทางการ (กล่าวรายงานเปิดโดย พอจ.หาญชัย, กล่าวเปิดโดยประธานฝ่ายตำรวจ และโอวาทธรรมต้อนรับโดยท่านเจ้าอาวาส) พร้อมสมาทานศีล 8 ในช่วงค่ำ
              </p>
            </div>
          </div>
        )}

        {selectedDay === 26 && (
          <div className="mb-6 p-4 bg-amber-50/70 rounded-xl border border-amber-100/70 flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-950">ไฮไลท์ประจำวัน: พิธีตักบาตรพระสงฆ์หมู่ใหญ่ และ จุดเทียนรวมใจ</h3>
              <p className="text-xs text-amber-800/80 mt-0.5 leading-relaxed">
                ตื่นนอนตอนเช้า 05.00 น. มีการตักบาตรหมู่จัดโดยท่าน ลพ.เนส และเจ้าหน้าที่ 20 นาย และกิจกรรมค่ำคือ พิธีจุดเทียนรวมใจน้อมรำลึกพระคุณแผ่นดิน
              </p>
            </div>
          </div>
        )}

        {selectedDay === 27 && (
          <div className="mb-6 p-4 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-emerald-950">ไฮไลท์ประจำวัน: พิธีปิดมอบประกาศนียบัตร</h3>
              <p className="text-xs text-emerald-800/80 mt-0.5 leading-relaxed">
                การบรรยายพิเศษเรื่องกระบวนการยุติธรรมโดยวิทยากรผู้พิพากษา และพิธีปิดโครงการบ่าย 13.00 น. รับประกาศนียบัตรเกียรติคุณและกล่าวลาพระอาจารย์เพื่อเดินทางกลับ
              </p>
            </div>
          </div>
        )}

        {/* Schedule Grid Table */}
        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-4 w-44 text-slate-500">ช่วงเวลา / ลาเบล</th>
                <th className="py-3 px-4 text-slate-500">กิจกรรม / เนื้อหาอย่างละเอียด</th>
                <th className="py-3 px-4 w-48 text-slate-500">ผู้ประสานงาน / พี่เลี้ยง</th>
                <th className="py-3 px-4 w-48 text-slate-500">พระอาจารย์ผู้ดูแล</th>
                <th className="py-3 px-4 w-28 text-center text-slate-500">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSchedule.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-4 align-top">
                    {editingId === item.id ? (
                      <div className="space-y-2">
                        <select
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          value={editForm.timeSlot}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              timeSlot: e.target.value as ScheduleItem["timeSlot"],
                            })
                          }
                        >
                          <option value="early_morning">ตื่นนอน / สวดเช้า</option>
                          <option value="breakfast">ข้าวเช้า</option>
                          <option value="morning">ช่วงสาย</option>
                          <option value="lunch">เที่ยง</option>
                          <option value="afternoon">ช่วงบ่าย</option>
                          <option value="evening">ช่วงค่ำ</option>
                        </select>
                        <input
                          type="text"
                          placeholder="ช่วงเวลา (น.)"
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          value={editForm.timeRange}
                          onChange={(e) => setEditForm({ ...editForm, timeRange: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <span
                          className={`inline-block px-2 py-1 rounded-md text-xs font-medium border ${getSlotColor(
                            item.timeSlot
                          )}`}
                        >
                          {getSlotThai(item.timeSlot)}
                        </span>
                        <div className="text-xs text-gray-500 flex items-center gap-1 font-mono">
                          <Clock size={12} /> {item.timeRange}
                        </div>
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-4 align-top">
                    {editingId === item.id ? (
                      <textarea
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl h-20 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                        value={editForm.activity}
                        onChange={(e) => setEditForm({ ...editForm, activity: e.target.value })}
                      />
                    ) : (
                      <p className="text-slate-700 leading-relaxed font-semibold">{item.activity}</p>
                    )}
                  </td>

                  <td className="py-4 px-4 align-top">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                        value={editForm.coordinator}
                        onChange={(e) => setEditForm({ ...editForm, coordinator: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <User size={13} className="text-slate-400" />
                        <span>{item.coordinator || "-"}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-4 align-top">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                        value={editForm.monkInCharge}
                        onChange={(e) => setEditForm({ ...editForm, monkInCharge: e.target.value })}
                      />
                    ) : (
                      <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2 py-1 rounded-lg border border-orange-150">
                        {item.monkInCharge || "-"}
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 align-top text-center">
                    <div className="flex items-center justify-center gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                      {editingId === item.id ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition-colors"
                            title="บันทึก"
                          >
                            <Check size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(item)}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="แก้ไข"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteSchedule(item.id)}
                            className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="ลบ"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSchedule.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    ยังไม่มีรายการกำหนดการสำหรับวันที่ {selectedDay} กรกฎาคม
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add activity button & form */}
        <div className="mt-6">
          {showAddForm ? (
            <form onSubmit={handleAddSubmit} className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">เพิ่มรายการกิจกรรมสําหรับวันที่ 2{selectedDay - 20} ก.ค.</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ช่วงเวลาทั่วไป</label>
                  <select
                    className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-indigo-500"
                    value={addForm.timeSlot}
                    onChange={(e) =>
                      setAddForm({ ...addForm, timeSlot: e.target.value as ScheduleItem["timeSlot"] })
                    }
                  >
                    <option value="early_morning">ตื่นนอน / สวดเช้า</option>
                    <option value="breakfast">ข้าวเช้า</option>
                    <option value="morning">ช่วงสาย</option>
                    <option value="lunch">เที่ยง</option>
                    <option value="afternoon">ช่วงบ่าย</option>
                    <option value="evening">ช่วงค่ำ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ระบุเวลาละเอียด (น.)</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 13.00 - 15.30 น."
                    className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-indigo-500"
                    value={addForm.timeRange}
                    onChange={(e) => setAddForm({ ...addForm, timeRange: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ผู้ประสานงาน / คณะตำรวจ</label>
                  <input
                    type="text"
                    placeholder="ชื่อผู้ประสานงาน/พี่เลี้ยง"
                    className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-indigo-500"
                    value={addForm.coordinator}
                    onChange={(e) => setAddForm({ ...addForm, coordinator: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">พระอาจารย์ผู้ควบคุม</label>
                  <input
                    type="text"
                    placeholder="เช่น พอจ.อติเทพ"
                    className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-indigo-500"
                    value={addForm.monkInCharge}
                    onChange={(e) => setAddForm({ ...addForm, monkInCharge: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">รายละเอียดกิจกรรม / หัวข้อบรรยาย</label>
                <input
                  type="text"
                  required
                  placeholder="ระบุกิจกรรมที่จะต้องปฏิบัติในตารางโดยละเอียด..."
                  className="w-full text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-indigo-500"
                  value={addForm.activity}
                  onChange={(e) => setAddForm({ ...addForm, activity: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 text-xs font-semibold pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm"
                >
                  เพิ่มกิจกรรม
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 px-4 py-2 border-2 border-dashed border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-500 rounded-xl w-full justify-center transition-all text-xs font-semibold cursor-pointer"
            >
              <Plus size={16} /> เพิ่มกิจกรรมใหม่สำหรับตารางรายวันนี้
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
