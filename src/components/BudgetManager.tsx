import React, { useState } from "react";
import { BudgetItem } from "../types";
import { Coins, Plus, Trash2, TrendingUp, TrendingDown, Wallet, CreditCard, Sparkles } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, PieChart, Pie } from "recharts";

interface BudgetManagerProps {
  budgetItems: BudgetItem[];
  totalAttendees: number;
  onAddBudgetItem: (item: Omit<BudgetItem, "id" | "amount">) => void;
  onDeleteBudgetItem: (id: string) => void;
}

export default function BudgetManager({
  budgetItems,
  totalAttendees,
  onAddBudgetItem,
  onDeleteBudgetItem,
}: BudgetManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<Omit<BudgetItem, "id" | "amount">>({
    category: "expense",
    title: "",
    quantity: 1,
    unitPrice: 0,
    note: "",
  });

  const incomes = budgetItems.filter((i) => i.category === "income");
  const expenses = budgetItems.filter((i) => i.category === "expense");

  const totalIncome = incomes.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalExpense = expenses.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const balance = totalIncome - totalExpense;
  const spentPercentage = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
  
  // Cost per head for attendees
  const costPerHead = totalAttendees > 0 ? totalExpense / totalAttendees : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBudgetItem({
      ...form,
      quantity: Number(form.quantity) || 1,
      unitPrice: Number(form.unitPrice) || 0,
    });
    setForm({
      category: "expense",
      title: "",
      quantity: 1,
      unitPrice: 0,
      note: "",
    });
    setShowAddForm(false);
  };

  // Prepare data for the charts
  const barChartData = [
    {
      name: "งบประมาณทางการเงิน",
      รายรับ: totalIncome,
      รายจ่าย: totalExpense,
      คงเหลือ: balance,
    },
  ];

  const pieChartData = expenses.map((e) => ({
    name: e.title.length > 25 ? e.title.substring(0, 25) + "..." : e.title,
    value: e.quantity * e.unitPrice,
  }));

  const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden" id="budget-manager">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Coins className="text-indigo-600" size={22} />
            ระบบบริหารงบประมาณและการเงิน (Budget Management)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            บันทึกงบประมาณอุดหนุน รายรับจากการบริจาค และรายการค่าใช้จ่ายจัดงานรวมถึงสถิติต่อหัวผู้เข้าร่วมอบรม
          </p>
        </div>
      </div>

      {/* Financial Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-b border-gray-100">
        {/* Card 1: Income */}
        <div className="p-5 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">งบประมาณรายรับทั้งหมด</span>
            <div className="text-xl font-bold text-gray-800 mt-0.5">
              ฿{totalIncome.toLocaleString()}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">จาก ตร. อุดหนุน & เงินบริจาค</span>
          </div>
        </div>

        {/* Card 2: Expense */}
        <div className="p-5 flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shrink-0">
            <TrendingDown size={20} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">งบค่าใช้จ่ายเบิกจ่ายจริง</span>
            <div className="text-xl font-bold text-gray-800 mt-0.5">
              ฿{totalExpense.toLocaleString()}
            </div>
            <span className="text-[10px] text-rose-600 font-semibold">{spentPercentage.toFixed(1)}% ของงบรายรับ</span>
          </div>
        </div>

        {/* Card 3: Balance */}
        <div className="p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <Wallet size={20} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">งบประมาณคงเหลือคงคลัง</span>
            <div className="text-xl font-bold text-emerald-700 mt-0.5">
              ฿{balance.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">สถานะการเงินมั่นคง</span>
          </div>
        </div>

        {/* Card 4: Cost per head */}
        <div className="p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <CreditCard size={20} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">ค่าใช้จ่ายเฉลี่ยรายหัว</span>
            <div className="text-xl font-bold text-amber-700 mt-0.5">
              ฿{Math.round(costPerHead).toLocaleString()}{" "}
              <span className="text-xs font-normal text-gray-400">/ นาย</span>
            </div>
            <span className="text-[10px] text-gray-400">คำนวณจากผู้ร่วมงาน {totalAttendees} นาย</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
        {/* Left column: Chart Visualizers */}
        <div className="lg:col-span-4 p-6 space-y-6 bg-slate-50/50">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">การประมวลผลทางการเงินหลัก</h3>
          
          {/* Spent Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-gray-700">
              <span>อัตราส่วนการใช้จ่ายเงินโครงการ</span>
              <span>{spentPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(spentPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Bar Chart comparing income vs expense */}
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip formatter={(value: any) => `฿${value.toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="รายรับ" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="รายจ่าย" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="คงเหลือ" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart for expense distribution */}
          {expenses.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-500">สัดส่วนค่าใช้จ่ายจำแนกตามรายการ</h4>
              <div className="h-40 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `฿${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Micro-Legend details inside */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <span className="text-[9px] text-gray-400 font-semibold block uppercase">ค่าใช้จ่ายรวม</span>
                    <span className="text-xs font-extrabold text-gray-700">฿{totalExpense.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column: Ledger & Transaction Form */}
        <div className="lg:col-span-8 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">บัญชีธุรกรรม (Accounting Ledger)</span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus size={14} /> เพิ่มรายรับ / รายจ่ายใหม่
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAdd} className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-1 text-xs font-bold text-gray-700 mb-2">
                <Sparkles size={14} className="text-amber-500 animate-pulse" />
                กรอกรายละเอียดรายการบัญชีใหม่
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">ประเภท</label>
                  <select
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-indigo-500"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as "income" | "expense" })}
                  >
                    <option value="expense">รายจ่าย (-) </option>
                    <option value="income">รายรับ (+) </option>
                  </select>
                </div>
                <div className="sm:col-span-9">
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">ชื่อรายการธุรกรรม</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ค่าจัดหาเอกสารอบรมและธรรมะ, สมทบตักบาตร"
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-indigo-500"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">จำนวนหน่วย (ชิ้น / หัวคน)</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-indigo-500"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">ราคาต่อหน่วย (บาท)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-indigo-500"
                    value={form.unitPrice}
                    onChange={(e) => setForm({ ...form, unitPrice: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">หมายเหตุ / ฝ่ายผู้รับผิดชอบ</label>
                  <input
                    type="text"
                    placeholder="เช่น โอนโดยสำนักงานตำรวจ, จัดการโดย ลพ.เนส"
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-md focus:outline-indigo-500"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 text-xs font-semibold pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  บันทึกรายการบัญชี
                </button>
              </div>
            </form>
          )}

          {/* Ledger table */}
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="py-2.5 px-3 w-16 text-center">ประเภท</th>
                  <th className="py-2.5 px-3">รายการธุรกรรมการเงิน</th>
                  <th className="py-2.5 px-3 text-right w-24">จำนวน</th>
                  <th className="py-2.5 px-3 text-right w-28">ราคาต่อหน่วย</th>
                  <th className="py-2.5 px-3 text-right w-28">รวมเบ็ดเสร็จ</th>
                  <th className="py-2.5 px-3 pl-4">หมายเหตุประกอบ</th>
                  <th className="py-2.5 px-3 w-12 text-center">ลบ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {budgetItems.map((item) => {
                  const itemTotal = item.quantity * item.unitPrice;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded-sm text-[9px] font-bold ${
                          item.category === "income" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" 
                            : "bg-rose-50 text-rose-700 border border-rose-200/50"
                        }`}>
                          {item.category === "income" ? "รายรับ" : "รายจ่าย"}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-gray-700">{item.title}</td>
                      <td className="py-3 px-3 text-right font-mono">{item.quantity.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-mono">฿{item.unitPrice.toLocaleString()}</td>
                      <td className={`py-3 px-3 text-right font-mono font-bold ${
                        item.category === "income" ? "text-emerald-600" : "text-rose-600"
                      }`}>
                        {item.category === "income" ? "+" : "-"}฿{itemTotal.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 pl-4 text-gray-400 font-normal">{item.note || "-"}</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => onDeleteBudgetItem(item.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                          title="ลบรายการ"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
