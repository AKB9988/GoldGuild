import {
    BriefcaseMedical,
    Bus, CircleDollarSign, Clapperboard, GraduationCap, Pen, Plus, ShoppingCart,
    UtensilsCrossed,
    X
} from "lucide-react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api.js";
import { Button } from "@/components/ui/button.jsx";

const Category_Data = {
    FOOD: {
        icon: <UtensilsCrossed size={20} />,
        label: "Food",
        colorClass: "bg-red-500/15 text-red-400",
        iconBg: "bg-red-500/12"
    },
    TRAVEL: {
        icon: <Bus size={20} />,
        label: "Travel",
        colorClass: "bg-blue-500/15 text-blue-400",
        iconBg: "bg-blue-500/12"
    },
    SHOPPING: {
        icon: <ShoppingCart size={20} />,
        label: "Shopping",
        colorClass: "bg-purple-500/15 text-purple-400",
        iconBg: "bg-purple-500/12"
    },
    ENTERTAINMENT: {
        icon: <Clapperboard size={20} />,
        label: "Entertainment",
        colorClass: "bg-green-500/15 text-green-400",
        iconBg: "bg-green-500/12"
    },
    HEALTH: {
        icon: <BriefcaseMedical size={20} />,
        label: "Health",
        colorClass: "bg-pink-500/15 text-pink-400",
        iconBg: "bg-pink-500/12"
    },
    EDUCATION: {
        icon: <GraduationCap size={20} />,
        label: "Education",
        colorClass: "bg-yellow-500/15 text-yellow-400",
        iconBg: "bg-yellow-500/12"
    },
    BILLS: {
        icon: <CircleDollarSign size={20} />,
        label: "Bills",
        colorClass: "bg-orange-500/15 text-orange-400",
        iconBg: "bg-orange-500/12"
    },
    OTHER: {
        icon: <Plus size={20} />,
        label: "Other",
        colorClass: "bg-zinc-500/15 text-zinc-400",
        iconBg: "bg-zinc-500/12"
    },
};

const CATEGORIES = ["All", "Food", "Travel", "Shopping", "Entertainment", "Health", "Education", "Bills", "Other"];

const fmt = (n) =>
    "₹" + Number(n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const currentMonth = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

function EditExpense({ onClose, onSuccess, expense }) {
    const [amount, setAmount] = useState(expense.amount);
    const [category, setCategory] = useState(expense.category);
    const [note, setNote] = useState(expense.note || "");
    const [date, setDate] = useState(expense.date);

    const updateExpense = useMutation({
        mutationFn: async (data) => {
            const r = await api.put(`/api/expenses/${expense.id}`, data);
            return r.data;
        },
        onSuccess: () => { onSuccess(); onClose(); },
        onError: (e) => alert("Error: " + (e?.response?.data?.message || e.message)),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            alert("Enter a valid amount");
            return;
        }
        updateExpense.mutate({ amount: Number(amount), category, note, date });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="flex flex-col items-stretch p-7 shadow-2xl bg-surface-card border rounded-md w-full max-w-[440px]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="flex items-center gap-2 text-lg text-white font-bold"> Edit Expense <Pen size={16}/> </h3>
                    <Button size="icon" onClick={onClose} variant="ghost" className="rounded-full text-white border w-8 h-8"><X size="20" /> </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="font-semibold text-xs text-[#8A8A8A] mb-1.5 block">Amount (₹)</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 text-gold font-bold text-lg -translate-y-1/2">₹</span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full bg-surface-2 border border-border-custom rounded-lg text-gold font-extrabold text-xl pl-9 pr-3 py-2.5 outline-none focus:border-gold focus:ring-3 focus:ring-gold-glow placeholder:text-[#555]"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00" />
                        </div>
                    </div>

                    <div className="mt-5 relative">
                        <label className="font-semibold text-xs text-[#8A8A8A] mb-1.5 block">Category</label>
                        <div className="grid grid-cols-4 gap-2">
                            {Object.entries(Category_Data).map(([key, value]) => (
                                <button
                                    key={key} type="button"
                                    onClick={() => setCategory(key)}
                                    className={`p-2.5 rounded-lg border text-center text-[11px] font-semibold transition-all cursor-pointer flex flex-col items-center
                                        ${category === key
                                        ? "border-gold text-gold bg-gold-glow"
                                        : "border text-[#8A8A8A] bg-surface-2 hover:border-gold/50 hover:text-gold/70"
                                    }`}
                                >
                                    <span className="block text-lg mb-0.5">{value.icon}</span>
                                    {value.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5">
                        <label className="text-xs font-semibold text-[#8A8A8A] mb-1.5 block tracking-wider">Note (optional)</label>
                        <input
                            type="text" placeholder="What was this for?"
                            value={note} onChange={(e) => setNote(e.target.value)}
                            className="w-full bg-surface-2 border border rounded-lg text-white text-sm p-[11px_14px] outline-none focus:border-gold focus:ring-3 focus:ring-gold-glow transition-all placeholder:text-[#555]"
                        />
                    </div>

                    <div className="mt-5">
                        <label className="text-xs font-semibold text-[#8A8A8A] mb-1.5 block tracking-wider">Date</label>
                        <input
                            type="date" value={date} onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-surface-2 border border rounded-lg text-white text-sm p-[11px_14px] outline-none focus:border-gold focus:ring-3 focus:ring-gold-glow transition-all"
                        />
                    </div>

                    <div className="flex gap-2.5 pt-4">
                        <button type="button" onClick={onClose}
                                className="flex-1 border border-border-custom text-white text-sm font-semibold rounded-lg py-2.5 hover:border-gold/50 transition-all cursor-pointer bg-transparent">
                            Cancel
                        </button>
                        <button type="submit" disabled={updateExpense.isPending}
                                className="flex-[2] bg-gold text-[#0F0F0F] font-semibold text-sm rounded-lg py-2.5 hover:bg-[#fbbf24] hover:shadow-gold transition-all cursor-pointer disabled:opacity-50">
                            {updateExpense.isPending ? "Saving…" : "Save Changes ⚡"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Expenses() {
    const [activeTab, setActiveTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [editingExpense, setEditingExpense] = useState(null);

    const qc = useQueryClient();

    const { data: expenses, isLoading } = useQuery({
        queryKey: ["expenses"],
        queryFn: async () => {
            const res = await api.get("/api/expenses");
            return res.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/api/expenses/${id}`);
        },
        onSuccess: async () => {
            try {
                await Promise.all([
                    qc.invalidateQueries({ queryKey: ["expenses"] }),
                    qc.invalidateQueries({ queryKey: ["expenses-month", currentMonth()] }),
                    qc.invalidateQueries({ queryKey: ["gamification-profile"] }),
                    qc.invalidateQueries({ queryKey: ["budget-status"] })
                ]);
            } catch (error) {
                console.error("Failed to invalidate queries:", error);
            }
        },
        onError: (e) => alert("Error: " + (e?.response?.data?.message || e.message))
    });

    const handleSuccessEdit = async () => {
        try {
            await Promise.all([
                qc.invalidateQueries({ queryKey: ["expenses"] }),
                qc.invalidateQueries({ queryKey: ["expenses-month", currentMonth()] }),
                qc.invalidateQueries({ queryKey: ["gamification-profile"] }),
                qc.invalidateQueries({ queryKey: ["budget-status"] })
            ]);
        } catch (error) {
            console.error("Failed to invalidate queries:", error);
        }
    };

    const filteredExpenses = useMemo(() => {
        const list = expenses || [];
        return list.filter((exp) => {
            const meta = Category_Data[exp.category] || Category_Data.OTHER;
            const matchTab = activeTab === "All" || meta.label.toLowerCase() === activeTab.toLowerCase();
            const searchString = `${exp.note || ""} ${meta.label}`.toLowerCase();
            const matchSearch = searchString.includes(searchQuery.toLowerCase());
            return matchTab && matchSearch;
        });
    }, [expenses, searchQuery, activeTab]);

    return (
        <div className="w-full bg-[#0F0F0F] text-zinc-400 p-6 font-sans">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                                activeTab === cat
                                    ? "bg-gold-glow border-gold text-gold"
                                    : "bg-[#1A1A1A] border-zinc-800 text-zinc-400 hover:border-zinc-700"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="🔍 Search entries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#1A1A1A] border border-zinc-800 rounded-lg px-4 py-1.5 text-xs text-white outline-none focus:border-gold transition-colors w-48"
                    />
                </div>
            </div>
            <div className="bg-[#141414] border border-zinc-900 rounded-xl overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse text-xs">
                    <thead>
                    <tr className="border-b border-zinc-900 text-zinc-500 font-bold uppercase tracking-wider">
                        <th className="p-4 w-12 text-center">#</th>
                        <th className="p-4">Description</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-center">XP Earned</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4 text-center w-28">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/50">
                    {isLoading ? (
                        <tr>
                            <td colSpan="7" className="p-12 text-center text-zinc-500 text-sm">
                                Loading expenses from Guild ledger...
                            </td>
                        </tr>
                    ) : filteredExpenses.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="p-12 text-center text-zinc-500 text-sm">
                                No matching transaction logs found.
                            </td>
                        </tr>
                    ) : (
                        filteredExpenses.map((exp, index) => {
                            const meta = Category_Data[exp.category] || Category_Data.OTHER;
                            return (
                                <tr key={exp.id || index} className="hover:bg-zinc-900/20 transition-colors group">
                                    <td className="p-4 text-center text-zinc-600 font-medium">{index + 1}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-zinc-200">{exp.note || meta.label}</div>
                                        <div className="text-[11px] text-zinc-500 mt-0.5">
                                            {exp.note ? `${meta.label} entry` : "No sub-notes added"}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-md font-semibold text-[11px] inline-flex items-center gap-1 ${meta.colorClass}`}>
                                                {meta.icon} {meta.label}
                                            </span>
                                    </td>
                                    <td className="p-4 text-zinc-400 font-medium">
                                        {new Date(exp.date).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </td>
                                    <td className="p-4 text-center">
                                            <span className="bg-gold-glow text-gold border border-gold-dim px-2 py-0.5 rounded-full font-bold text-[10px]">
                                                +10 XP
                                            </span>
                                    </td>
                                    <td className="p-4 font-black text-sm text-red-500 tracking-tight">
                                        -{fmt(exp.amount)}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button
                                                onClick={() => setEditingExpense(exp)}
                                                className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                                                title="Edit Expense"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm("Delete this expense log?")) {
                                                        deleteMutation.mutate(exp.id);
                                                    }
                                                }}
                                                disabled={deleteMutation.isPending}
                                                className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-red-400/80 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-45"
                                                title="Delete Expense"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between mt-5 text-xs text-zinc-500 font-medium">
                <div>Showing {filteredExpenses.length} of {(expenses || []).length} expenses</div>
            </div>

            {editingExpense && (
                <EditExpense
                    expense={editingExpense}
                    onClose={() => setEditingExpense(null)}
                    onSuccess={handleSuccessEdit}
                />
            )}
        </div>
    );
}