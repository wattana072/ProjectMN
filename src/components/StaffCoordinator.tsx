import React, { useState } from "react";
import { StaffRow } from "../types";
import { Users, Bus, Hotel, Users2, Shield, Compass, Edit3, Check, Eye } from "lucide-react";

interface StaffCoordinatorProps {
  staffRows: StaffRow[];
  onUpdateStaff: (updated: StaffRow) => void;
}

export default function StaffCoordinator({ staffRows, onUpdateStaff }: StaffCoordinatorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<StaffRow>>({});
  const [showDutyId, setShowDutyId] = useState<string | null>(null);

  // Computations
  const totalWP1 = staffRows.reduce((sum, r) => sum + (r.monkWP1 || 0), 0);
  const totalWP2 = staffRows.reduce((sum, r) => sum + (r.monkWP2 || 0), 0);
  const totalWP3 = staffRows.reduce((sum, r) => sum + (r.monkWP3 || 0), 0);
  
  const totalMale = staffRows.reduce((sum, r) => sum + (r.maleStaff || 0), 0);
  const totalFemale = staffRows.reduce((sum, r) => sum + (r.femaleStaff || 0), 0);
  
  const totalVips = staffRows.reduce((sum, r) => sum + (r.vipStaff || 0), 0);
  const totalAttendees = staffRows.reduce((sum, r) => sum + (r.attendeeStaff || 0), 0);
  const totalInstructors = staffRows.reduce((sum, r) => sum + (r.instructorStaff || 0), 0);
  
  // Grand total formula matching column "รวม"
  const rowSum = (r: StaffRow) => 
    (r.monkWP1 || 0) + (r.monkWP2 || 0) + (r.monkWP3 || 0) + 
    (r.maleStaff || 0) + (r.femaleStaff || 0) + 
    (r.vipStaff || 0) + (r.attendeeStaff || 0) + (r.instructorStaff || 0);

  const grandTotal = staffRows.reduce((sum, r) => sum + rowSum(r), 0);

  const handleStartEdit = (row: StaffRow) => {
    setEditingId(row.id);
    setEditForm({ ...row });
  };

  const handleSaveEdit = () => {
    if (editingId && editForm) {
      onUpdateStaff(editForm as StaffRow);
      setEditingId(null);
    }
  };

  // Row bg colors to match Image 1
  const getRowBgColor = (order: number) => {
    switch (order) {
      case 1:
        return "bg-amber-50/40"; // พระผู้ใหญ่
      case 2:
        return "bg-cyan-50/50"; // กองร้อย ติวเตอร์
      case 3:
      case 4:
      case 5:
        return "bg-orange-50/30"; // พี่เลี้ยง พอจ.
      case 10:
        return "bg-amber-100/30"; // จราจร
      default:
        return "bg-white";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden" id="staff-coordinator">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Users2 className="text-indigo-600" size={22} />
          ระบบกําลังพลและทีมงานอบรม (Staffing, Transport & Lodging)
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          บันทึกยอดภิกษุสงฆ์ผู้ใหญ่ พี่เลี้ยง แยกตามอาคารที่พัก ยอดเจ้าหน้าที่ชาย-หญิง ยอดครูฝึก และระบบบริหารรถบัส/รถตู้เดินทาง
        </p>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-b border-gray-100">
        <div className="p-5 flex items-center gap-3">
          <div className="p-2.5 bg-orange-50 text-orange-600 rounded-lg shrink-0">
            <Hotel size={18} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">จัดสรรที่พักภิกษุสงฆ์</span>
            <div className="text-xs font-semibold text-gray-700 mt-0.5">
              WP1: <span className="font-bold text-orange-600">{totalWP1}</span> | 
              WP2: <span className="font-bold text-orange-600">{totalWP2}</span> | 
              WP3: <span className="font-bold text-orange-600">{totalWP3}</span>
            </div>
            <span className="text-[10px] text-gray-400">รวม พระสงฆ์ {totalWP1 + totalWP2 + totalWP3} รูป</span>
          </div>
        </div>

        <div className="p-5 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
            <Users size={18} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">เจ้าหน้าที่ทางโลก</span>
            <div className="text-xs font-semibold text-gray-700 mt-0.5">
              ชาย: <span className="font-bold text-emerald-600">{totalMale}</span> นาย | 
              หญิง: <span className="font-bold text-emerald-600">{totalFemale}</span> นาย
            </div>
            <span className="text-[10px] text-gray-400">รวม ฆราวาส {totalMale + totalFemale} คน</span>
          </div>
        </div>

        <div className="p-5 flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <Bus size={18} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">ระบบพาหนะเดินทาง</span>
            <div className="text-xs font-bold text-gray-700 mt-0.5">
              รถบัส ตร. และรถบัสวัด
            </div>
            <span className="text-[10px] text-gray-400">ตารางเดินรถบัสและรถตู้สัมพันธ์</span>
          </div>
        </div>

        <div className="p-5 flex items-center gap-3">
          <div className="p-2.5 bg-indigo-950 text-indigo-300 rounded-lg shrink-0">
            <Shield size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-300 font-bold block uppercase tracking-wider">ยอดกำลังพลทั้งโครงการ</span>
            <div className="text-lg font-extrabold text-indigo-900 mt-0.5">
              {grandTotal.toLocaleString()} <span className="text-xs font-normal text-slate-500">นาย</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">● ข้อมูลอัปเดตตรงตารางจริง</span>
          </div>
        </div>
      </div>

      {/* Main Staff Allocator Table (Emulating Excel styling but polished) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            {/* Summary Top Row EXACTLY as in Screenshot 1 */}
            <tr className="bg-slate-900 text-white text-xs font-bold divide-x divide-slate-800">
              <td className="py-2.5 px-3 text-center bg-slate-800">รวม</td>
              <td className="py-2.5 px-3 font-semibold text-slate-300">สรุปยอดกำลังพลทั้งงาน</td>
              <td className="py-2.5 px-3 text-center bg-amber-600/90 text-white w-16">{totalWP1}</td>
              <td className="py-2.5 px-3 text-center bg-amber-600/90 text-white w-16">{totalWP2}</td>
              <td className="py-2.5 px-3 text-center bg-amber-600/90 text-white w-16">{totalWP3}</td>
              <td className="py-2.5 px-3 text-center bg-emerald-600/90 text-white w-16">{totalMale}</td>
              <td className="py-2.5 px-3 text-center bg-emerald-600/90 text-white w-16">{totalFemale}</td>
              <td className="py-2.5 px-3 text-center bg-indigo-600/90 text-white w-16">{totalVips}</td>
              <td className="py-2.5 px-3 text-center bg-indigo-600/90 text-white w-16">{totalAttendees}</td>
              <td className="py-2.5 px-3 text-center bg-indigo-600/90 text-white w-16">{totalInstructors}</td>
              <td className="py-2.5 px-3 text-slate-400 font-mono text-[10px] pl-4">ระบบนับคำนวณอัตโนมัติ</td>
              <td className="py-2.5 px-3 text-center bg-indigo-950 font-extrabold text-indigo-300 text-sm w-24">
                {grandTotal.toLocaleString()}
              </td>
              <td className="w-16"></td>
            </tr>

            {/* Column Headers */}
            <tr className="border-b border-gray-200 bg-gray-100 text-[11px] font-bold text-gray-600 tracking-wider divide-x divide-gray-200">
              <th className="py-3 px-3 text-center w-12 bg-gray-200/50">ลำดับ</th>
              <th className="py-3 px-3 w-60">ชื่อหน่วยงาน / ส่วนงานรับผิดชอบ</th>
              <th className="py-3 px-3 text-center w-16 bg-amber-50">พระ WP1</th>
              <th className="py-3 px-3 text-center w-16 bg-amber-50">พระ WP2</th>
              <th className="py-3 px-3 text-center w-16 bg-amber-50">พระ WP3</th>
              <th className="py-3 px-3 text-center w-16 bg-emerald-50">ชาย</th>
              <th className="py-3 px-3 text-center w-16 bg-emerald-50">หญิง</th>
              <th className="py-3 px-3 text-center w-16 bg-blue-50">ผู้ใหญ่</th>
              <th className="py-3 px-3 text-center w-16 bg-indigo-50">ผู้เข้าอบรม</th>
              <th className="py-3 px-3 text-center w-16 bg-indigo-50">ครูฝึก</th>
              <th className="py-3 px-3">การเดินทาง / ยานพาหนะเดินทาง</th>
              <th className="py-3 px-3 text-center w-24 bg-gray-200/50">รวมหน่วย</th>
              <th className="py-3 px-3 text-center w-16">จัดการ</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-xs">
            {staffRows.map((row) => {
              const rSum = rowSum(row);
              const isEditing = editingId === row.id;

              return (
                <tr key={row.id} className={`${getRowBgColor(row.order)} hover:bg-indigo-50/20 transition-colors`}>
                  {/* ลำดับ */}
                  <td className="py-3 px-3 text-center font-bold font-mono text-gray-500 bg-gray-50/20">{row.order}</td>
                  
                  {/* หน่วยงาน */}
                  <td className="py-3 px-3 font-semibold text-gray-800">
                    <div className="flex flex-col gap-0.5">
                      <span>{row.division}</span>
                      <button
                        onClick={() => setShowDutyId(showDutyId === row.id ? null : row.id)}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 font-bold mt-0.5 cursor-pointer text-left self-start"
                      >
                        <Eye size={10} /> {showDutyId === row.id ? "ซ่อนหน้าที่" : "ดูหน้าที่ในงานอบรม"}
                      </button>
                    </div>
                    {showDutyId === row.id && (
                      <div className="mt-2 p-2 bg-indigo-950 text-indigo-100 rounded-lg text-[10px] leading-relaxed font-normal shadow-xs border border-indigo-900 animate-fadeIn">
                        <strong>หน้าที่รับผิดชอบ:</strong> {row.responsibility}
                      </div>
                    )}
                  </td>

                  {/* พระ WP1 */}
                  <td className="py-3 px-3 text-center bg-amber-50/30">
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-12 text-center p-1 border border-gray-300 rounded bg-white font-semibold focus:outline-indigo-500"
                        value={editForm.monkWP1 || 0}
                        onChange={(e) => setEditForm({ ...editForm, monkWP1: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      <span className={row.monkWP1 ? "font-bold text-orange-700" : "text-gray-300 font-mono"}>{row.monkWP1 || "-"}</span>
                    )}
                  </td>

                  {/* พระ WP2 */}
                  <td className="py-3 px-3 text-center bg-amber-50/30">
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-12 text-center p-1 border border-gray-300 rounded bg-white font-semibold focus:outline-indigo-500"
                        value={editForm.monkWP2 || 0}
                        onChange={(e) => setEditForm({ ...editForm, monkWP2: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      <span className={row.monkWP2 ? "font-bold text-orange-700" : "text-gray-300 font-mono"}>{row.monkWP2 || "-"}</span>
                    )}
                  </td>

                  {/* พระ WP3 */}
                  <td className="py-3 px-3 text-center bg-amber-50/30">
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-12 text-center p-1 border border-gray-300 rounded bg-white font-semibold focus:outline-indigo-500"
                        value={editForm.monkWP3 || 0}
                        onChange={(e) => setEditForm({ ...editForm, monkWP3: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      <span className={row.monkWP3 ? "font-bold text-orange-700" : "text-gray-300 font-mono"}>{row.monkWP3 || "-"}</span>
                    )}
                  </td>

                  {/* ชาย */}
                  <td className="py-3 px-3 text-center bg-emerald-50/30">
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-12 text-center p-1 border border-gray-300 rounded bg-white font-semibold focus:outline-indigo-500"
                        value={editForm.maleStaff || 0}
                        onChange={(e) => setEditForm({ ...editForm, maleStaff: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      <span className={row.maleStaff ? "font-bold text-emerald-700" : "text-gray-300 font-mono"}>{row.maleStaff || "-"}</span>
                    )}
                  </td>

                  {/* หญิง */}
                  <td className="py-3 px-3 text-center bg-emerald-50/30">
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-12 text-center p-1 border border-gray-300 rounded bg-white font-semibold focus:outline-indigo-500"
                        value={editForm.femaleStaff || 0}
                        onChange={(e) => setEditForm({ ...editForm, femaleStaff: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      <span className={row.femaleStaff ? "font-bold text-emerald-700" : "text-gray-300 font-mono"}>{row.femaleStaff || "-"}</span>
                    )}
                  </td>

                  {/* ผู้ใหญ่ */}
                  <td className="py-3 px-3 text-center bg-blue-50/30">
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-12 text-center p-1 border border-gray-300 rounded bg-white font-semibold focus:outline-indigo-500"
                        value={editForm.vipStaff || 0}
                        onChange={(e) => setEditForm({ ...editForm, vipStaff: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      <span className={row.vipStaff ? "font-bold text-slate-800" : "text-gray-300 font-mono"}>{row.vipStaff || "-"}</span>
                    )}
                  </td>

                  {/* ผู้เข้าอบรม */}
                  <td className="py-3 px-3 text-center bg-indigo-50/30">
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-16 text-center p-1 border border-gray-300 rounded bg-white font-semibold focus:outline-indigo-500"
                        value={editForm.attendeeStaff || 0}
                        onChange={(e) => setEditForm({ ...editForm, attendeeStaff: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      <span className={row.attendeeStaff ? "font-bold text-indigo-700" : "text-gray-300 font-mono"}>
                        {row.attendeeStaff ? row.attendeeStaff.toLocaleString() : "-"}
                      </span>
                    )}
                  </td>

                  {/* ครูฝึก */}
                  <td className="py-3 px-3 text-center bg-indigo-50/30">
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-12 text-center p-1 border border-gray-300 rounded bg-white font-semibold focus:outline-indigo-500"
                        value={editForm.instructorStaff || 0}
                        onChange={(e) => setEditForm({ ...editForm, instructorStaff: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      <span className={row.instructorStaff ? "font-bold text-indigo-600" : "text-gray-300 font-mono"}>{row.instructorStaff || "-"}</span>
                    )}
                  </td>

                  {/* การเดินทาง */}
                  <td className="py-3 px-3 text-gray-600 font-medium font-mono text-[11px]">
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded bg-white text-xs focus:outline-indigo-500"
                        value={editForm.travelDetail || ""}
                        onChange={(e) => setEditForm({ ...editForm, travelDetail: e.target.value })}
                      />
                    ) : (
                      <span>{row.travelDetail || "-"}</span>
                    )}
                  </td>

                  {/* รวมหน่วย */}
                  <td className="py-3 px-3 text-center bg-gray-50/60 font-bold font-mono text-gray-700">
                    {rSum ? rSum.toLocaleString() : "-"}
                  </td>

                  {/* จัดการ */}
                  <td className="py-3 px-3 text-center">
                    {isEditing ? (
                      <button
                        onClick={handleSaveEdit}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                        title="บันทึก"
                      >
                        <Check size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(row)}
                        className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                        title="แก้ไขยอด"
                      >
                        <Edit3 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
