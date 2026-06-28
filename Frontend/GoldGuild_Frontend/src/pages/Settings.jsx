import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api.js";

const CATEGORY_DATA = [
    { id: "FOOD", label: "🍴 Food" },
    { id: "TRAVEL", label: "🚌 Travel" },
    { id: "SHOPPING", label: "🛒 Shopping" },
    { id: "ENTERTAINMENT", label: "🎬 Entertainment" },
    { id: "HEALTH", label: "🏥 Health" },
    { id: "EDUCATION", label: "🎓 Education" },
    { id: "BILLS", label: "🧾 Bills" },
    { id: "OTHER", label: "➕ Other" },
];

const fmt = (amount) => "₹" + Number(amount ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export default function Settings() {
    const [category, setCategory] = useState("FOOD");
    const [limitAmount, setLimitAmount] = useState("");
    const [month, setMonth] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    });

    const qc = useQueryClient();

    const { data: budgets = [], isLoading } = useQuery({
        queryKey: ["budgets", month],
        queryFn: async () => {
            const response = await api.get("/api/budgets/status", { params: { month } });
            return response.data;
        },
    });

    const setBudget = useMutation({
        mutationFn: async (budgetData) => {
            const response = await api.post("/api/budgets", budgetData);
            return response.data;
        },
        onSuccess: async () => {
            alert("Budget set successfully!");
            setLimitAmount("");
            await qc.invalidateQueries({ queryKey: ["budgets", month] });
            await qc.invalidateQueries({ queryKey: ["budget-status"] });
        },
        onError: (e) => {
            alert("Error: " + (e?.response?.data?.message || e.message));
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!limitAmount || isNaN(Number(limitAmount)) || Number(limitAmount) <= 0) {
            alert("Please enter a valid positive amount.");
            return;
        }
        setBudget.mutate({
            category,
            limitAmount: Number(limitAmount),
            month,
        });
    };

    return (
        <div className="w-full bg-[#0F0F0F] text-zinc-400 p-6 font-sans">
            <div className="mb-6">
                <h2 className="text-xl font-extrabold text-white tracking-tight">Budget Settings</h2>
                <p className="text-xs text-[#8A8A8A] mt-1">Configure your monthly budget thresholds and control your spending.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-[14px] p-5 shadow-lg">
                        <h3 className="text-sm font-bold text-white mb-4">Define Category Budget</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-semibold text-[#8A8A8A] uppercase tracking-wider mb-1.5 block">Select Month</label>
                                <input
                                    type="month"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="w-full bg-[#222222] border border-[#2E2E2E] rounded-lg text-white text-xs p-2.5 outline-none focus:border-gold transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-semibold text-[#8A8A8A] uppercase tracking-wider mb-1.5 block">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-[#222222] border border-[#2E2E2E] rounded-lg text-white text-xs p-2.5 outline-none focus:border-gold transition-colors cursor-pointer"
                                >
                                    {CATEGORY_DATA.map((opt) => (
                                        <option key={opt.id} value={opt.id}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-semibold text-[#8A8A8A] uppercase tracking-wider mb-1.5 block">Limit Amount (₹)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 5000"
                                    value={limitAmount}
                                    onChange={(e) => setLimitAmount(e.target.value)}
                                    className="w-full bg-[#222222] border border-[#2E2E2E] rounded-lg text-white text-xs p-2.5 outline-none focus:border-gold transition-colors placeholder:text-[#555]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={setBudget.isPending}
                                className="w-full bg-gold text-[#0F0F0F] font-semibold text-xs py-2.5 rounded-lg hover:bg-[#fbbf24] hover:shadow-gold transition-all cursor-pointer disabled:opacity-50"
                            >
                                {setBudget.isPending ? "Setting..." : "Apply Budget Limit"}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-[14px] p-5 shadow-lg min-h-[300px]">
                        <h3 className="text-sm font-bold text-white mb-4">
                            Configured Limits for <span className="text-gold font-extrabold">{month}</span>
                        </h3>

                        {isLoading ? (
                            <div className="text-center py-8 text-xs text-[#8A8A8A]">Loading budget profiles...</div>
                        ) : budgets.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-3xl mb-3">📊</div>
                                <div className="text-sm font-bold text-white">No limits set for this period</div>
                                <p className="text-xs text-[#8A8A8A] mt-1">Configure limits on the left to restrict category spendings.</p>
                            </div>
                        ) : (
                            <div className="space-y-3.5">
                                {budgets.map((b) => {
                                    const opt = CATEGORY_DATA.find((o) => o.id === b.category) || { label: `➕ ${b.category}` };
                                    const isOver = Number(b.spentAmount) > Number(b.limitAmount);
                                    const pct = b.limitAmount > 0 ? Math.min((Number(b.spentAmount) / Number(b.limitAmount)) * 100, 100) : 0;

                                    return (
                                        <div key={b.id} className="bg-[#222222] border border-[#2E2E2E] rounded-xl p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-white">
                                                        {opt.label}
                                                    </span>
                                                    {isOver && (
                                                        <span className="text-[9px] font-bold bg-red-500/15 text-[#EF4444] px-1.5 py-0.5 rounded-full border border-red-500/20">
                                                            Limit Exceeded
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs">
                                                    <span className="text-[#8A8A8A]">Limit: </span>
                                                    <span className="text-white font-bold">{fmt(b.limitAmount)}</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between text-[11px] text-[#8A8A8A] mb-1.5">
                                                <span>Spent: {fmt(b.spentAmount)}</span>
                                                <span>{Math.round(pct)}% consumed</span>
                                            </div>

                                            <div className="w-full h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${
                                                        isOver
                                                            ? "bg-red-500"
                                                            : pct > 80
                                                                ? "bg-amber-500"
                                                                : "bg-green-500"
                                                    }`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}