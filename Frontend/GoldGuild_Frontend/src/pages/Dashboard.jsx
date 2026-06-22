import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api.js";

const CATEGORY_META = {
    FOOD: { emoji: "🍕", label: "Food", colorClass: "bg-red-500/15 text-red-400", iconBg: "bg-red-500/12" },
    TRAVEL: { emoji: "🚌", label: "Travel", colorClass: "bg-blue-500/15 text-blue-400", iconBg: "bg-blue-500/12" },
    SHOPPING: { emoji: "🛍️", label: "Shopping", colorClass: "bg-purple-500/15 text-purple-400", iconBg: "bg-purple-500/12" },
    ENTERTAINMENT: { emoji: "🎬", label: "Entertainment", colorClass: "bg-green-500/15 text-green-400", iconBg: "bg-green-500/12" },
    HEALTH: { emoji: "💊", label: "Health", colorClass: "bg-pink-500/15 text-pink-400", iconBg: "bg-pink-500/12" },
    EDUCATION: { emoji: "📚", label: "Education", colorClass: "bg-yellow-500/15 text-yellow-400", iconBg: "bg-yellow-500/12" },
    BILLS: { emoji: "⚡", label: "Bills", colorClass: "bg-orange-500/15 text-orange-400", iconBg: "bg-orange-500/12" },
    OTHER: { emoji: "➕", label: "Other", colorClass: "bg-surface-3/50 text-[#8A8A8A]", iconBg: "bg-surface-3" },
};

const BADGE_META = {
    FIRST_EXPENSE: { emoji: "🏆", label: "First Expense" },
    STREAK_7: { emoji: "🔥", label: "7-Day Streak" },
    STREAK_30: { emoji: "🌟", label: "30-Day Streak" },
    FIRST_GOAL: { emoji: "🎯", label: "First Goal" },
    GOAL_COMPLETED: { emoji: "✅", label: "Goal Crusher" },
    UNDER_BUDGET: { emoji: "💰", label: "Under Budget" },
    BUDGET_MASTER: { emoji: "💎", label: "Budget Master" },
    LEVEL_5: { emoji: "⚡", label: "Level 5" },
    XP_1000: { emoji: "👑", label: "XP 1000" },
};

const fmt = (n) =>
    "₹" + Number(n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const currentMonth = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const NAV_ITEMS = [
    { icon: "🏠", label: "Dashboard" },
    { icon: "💸", label: "Expenses" },
    { icon: "🎯", label: "Goals" },
    { icon: "🏅", label: "Leaderboard" },
    { icon: "👥", label: "Friends" },
    { icon: "📊", label: "Analytics" },
    { icon: "⚙️", label: "Settings" },
];

const XP_PER_LEVEL = 500;
const xpToNextLevel = (xp) => XP_PER_LEVEL - (xp % XP_PER_LEVEL);
const xpProgress = (xp) => ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;

// Add Expense page 
function AddExpenseModal({ onClose, onSuccess }) {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("FOOD");
    const [note, setNote] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const addExpense = useMutation({
        mutationFn: async (data) => {
            const r = await api.post("/api/expenses", data);
            return r.data
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
        addExpense.mutate({ amount: Number(amount), category, note, date });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-[440px] bg-surface-card border border-border-custom rounded-[18px] p-7 shadow-dark">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Add Expense 💸</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-2 border border-border-custom text-[#8A8A8A] flex items-center justify-center hover:text-white transition-colors cursor-pointer text-sm">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Amount */}
                    <div>
                        <label className="text-xs font-semibold text-[#8A8A8A] mb-1.5 block tracking-wider">Amount (₹)</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold font-bold text-base">₹</span>
                            <input
                                type="number" min="1" step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-surface-2 border border-border-custom rounded-lg text-gold font-extrabold text-xl pl-8 pr-3 py-2.5 outline-none focus:border-gold focus:ring-3 focus:ring-gold-glow transition-all placeholder:text-[#555] placeholder:font-normal placeholder:text-base"
                            />
                        </div>
                    </div>

                    {/* Category grid */}
                    <div>
                        <label className="text-xs font-semibold text-[#8A8A8A] mb-2 block tracking-wider">Category</label>
                        <div className="grid grid-cols-4 gap-2">
                            {Object.entries(CATEGORY_META).map(([key, { emoji, label }]) => (
                                <button
                                    key={key} type="button"
                                    onClick={() => setCategory(key)}
                                    className={`p-2.5 rounded-lg border text-center text-[11px] font-semibold transition-all cursor-pointer
                                        ${category === key
                                            ? "border-gold text-gold bg-gold-glow"
                                            : "border-border-custom text-[#8A8A8A] bg-surface-2 hover:border-gold/50 hover:text-gold/70"
                                        }`}
                                >
                                    <span className="block text-lg mb-0.5">{emoji}</span>
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="text-xs font-semibold text-[#8A8A8A] mb-1.5 block tracking-wider">Note (optional)</label>
                        <input
                            type="text" placeholder="What was this for?"
                            value={note} onChange={(e) => setNote(e.target.value)}
                            className="w-full bg-surface-2 border border-border-custom rounded-lg text-white text-sm p-[11px_14px] outline-none focus:border-gold focus:ring-3 focus:ring-gold-glow transition-all placeholder:text-[#555]"
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="text-xs font-semibold text-[#8A8A8A] mb-1.5 block tracking-wider">Date</label>
                        <input
                            type="date" value={date} onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-surface-2 border border-border-custom rounded-lg text-white text-sm p-[11px_14px] outline-none focus:border-gold focus:ring-3 focus:ring-gold-glow transition-all"
                        />
                    </div>

                    {/* XP hint */}
                    <div className="flex items-center gap-2 bg-gold-glow border border-gold-dim rounded-lg px-3.5 py-2.5 text-xs text-gold font-semibold">
                        ⚡ You'll earn <strong>+10 XP</strong> for this entry!
                    </div>

                    <div className="flex gap-2.5 pt-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 border border-border-custom text-white text-sm font-semibold rounded-lg py-2.5 hover:border-gold/50 transition-all cursor-pointer bg-transparent">
                            Cancel
                        </button>
                        <button type="submit" disabled={addExpense.isPending}
                            className="flex-[2] bg-gold text-[#0F0F0F] font-semibold text-sm rounded-lg py-2.5 hover:bg-[#fbbf24] hover:shadow-gold transition-all cursor-pointer disabled:opacity-50">
                            {addExpense.isPending ? "Adding…" : "Add Expense ⚡"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


//    MAIN DASHBOARD
export default function Dashboard() {
    const [activeNav, setActiveNav] = useState("Dashboard");
    const [showAddExpense, setShowAddExpense] = useState(false);
    const qc = useQueryClient();


    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    const monthLabel = new Date().toLocaleString("default", { month: "long", year: "numeric" });


    const { data: profile, isLoading: loadingProfile } = useQuery({
        queryKey: ["gamification-profile"],
        queryFn: async () => {
            const response = await api.get("/api/gamification/profile");
            return response.data;
        },
    });

    const { data: expenses = [], isLoading: loadingExp } = useQuery({
        queryKey: ["expenses"],
        queryFn: async () => {
            const response = await api.get("/api/expenses");
            return response.data;
        },
    });

    const { data: monthExpenses = [] } = useQuery({
        queryKey: ["expenses-month", currentMonth()],
        queryFn: async () => {
            const response = await api.get(`/api/expenses/month/${currentMonth()}`);
            return response.data;
        },
    });

    const { data: budgets = [], isLoading: loadingBudgets } = useQuery({
        queryKey: ["budget-status"],
        queryFn: async () => {
            const response = await api.get("/api/budgets/status");
            return response.data;
        },
    });

    const { data: goals = [], isLoading: loadingGoals } = useQuery({
        queryKey: ["goals"],
        queryFn: async () => {
            const response = await api.get("/api/goals");
            return response.data;
        },
    });


    const totalSpent = useMemo(
        () => monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
        [monthExpenses]
    );

    const totalBudget = useMemo(
        () => budgets.reduce((sum, b) => sum + Number(b.limitAmount), 0),
        [budgets]
    );

    const budgetLeft = totalBudget - totalSpent;

    const activeGoals = goals.filter((g) => !g.completed);
    const avgGoalProgress = activeGoals.length
        ? Math.round(activeGoals.reduce((s, g) => {
            const pct = g.targetAmount > 0 ? (Number(g.currentAmount) / Number(g.targetAmount)) * 100 : 0;
            return s + pct;
        }, 0) / activeGoals.length)
        : 0;

    const recentExpenses = [...expenses]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    const username = localStorage.getItem("username") || "User";
    const initials = username.slice(0, 2).toUpperCase();

    const xp = profile?.xp ?? 0;
    const level = profile?.level ?? 1;
    const streak = profile?.streakCount ?? 0;
    const badges = profile?.badges ?? [];
    const xpPct = xpProgress(xp);
    const xpLeft = xpToNextLevel(xp);
    const ringDeg = Math.round((xpPct / 100) * 360);

    return (
        <div className="flex min-h-screen bg-surface-bg font-sans">

            {/*  SIDEBAR */}
            <aside className="w-[240px] min-h-screen bg-surface-card border-r border-border-custom flex flex-col flex-shrink-0 sticky top-0 h-screen">
                <div className="flex items-center gap-2.5 px-5 py-6 border-b border-border-custom">
                    <div className="w-9 h-9 bg-gradient-to-br from-gold to-[#d97706] rounded-[10px] flex items-center justify-center text-lg glow-gold">🏆</div>
                    <span className="text-lg font-extrabold text-gold tracking-tight">GoldGuild</span>
                </div>

                <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                    {NAV_ITEMS.map(({ icon, label }) => (
                        <div
                            key={label}
                            onClick={() => setActiveNav(label)}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all border
                                ${activeNav === label
                                    ? "bg-gold-glow border-gold-dim text-gold font-semibold"
                                    : "border-transparent text-[#8A8A8A] hover:bg-surface-2 hover:text-white"
                                }`}
                        >
                            <span className="w-5 text-center text-[17px]">{icon}</span>
                            {label}
                            {label === "Goals" && activeGoals.length > 0 && (
                                <span className="ml-auto bg-gold text-[#0F0F0F] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {activeGoals.length}
                                </span>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="border-t border-border-custom p-3">
                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-surface-2 cursor-pointer transition-colors">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-[#d97706] flex items-center justify-center font-bold text-sm text-[#0F0F0F] flex-shrink-0">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-semibold text-white truncate">{username}</div>
                            <div className="text-[11px] text-[#8A8A8A]">Level {level} · {xp.toLocaleString()} XP</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/*  MAIN CONTENT  */}
            <main className="flex-1 p-8 overflow-y-auto">

                {/* Page header */}
                <div className="flex items-start justify-between mb-7">
                    <div>
                        <h1 className="text-2xl font-extrabold text-white tracking-tight">
                            {greeting}, {username} 👋
                        </h1>
                        <p className="text-sm text-[#8A8A8A] mt-1">
                            Here's your financial snapshot for {monthLabel}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Streak chip */}
                        <div className="flex items-center gap-2.5 bg-surface-2 border border-border-custom rounded-xl px-4 py-2">
                            <span className="text-2xl" style={{ animation: "pulse 2s infinite" }}>🔥</span>
                            <div>
                                <div className="text-xl font-black text-gold leading-none">{streak}</div>
                                <div className="text-[10px] text-[#8A8A8A]">day streak</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAddExpense(true)}
                            className="inline-flex items-center gap-2 bg-gold text-[#0F0F0F] font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-[#fbbf24] hover:shadow-gold hover:-translate-y-px transition-all cursor-pointer"
                        >
                            + Add Expense
                        </button>
                    </div>
                </div>

                {/* ── KPI Cards ── */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                    {[
                        {
                            icon: "💸", iconBg: "bg-red-500/12", label: "Total Spent",
                            value: loadingExp ? "…" : fmt(totalSpent),
                            valueClass: "text-[#EF4444]",
                            sub: `${monthExpenses.length} transactions`,
                            subClass: "text-[#EF4444]",
                        },
                        {
                            icon: "💰", iconBg: "bg-green-500/12", label: "Budget Left",
                            value: loadingBudgets ? "…" : fmt(Math.max(budgetLeft, 0)),
                            valueClass: budgetLeft < 0 ? "text-[#EF4444]" : "text-[#10B981]",
                            sub: totalBudget > 0 ? `${Math.round((totalSpent / totalBudget) * 100)}% used` : "No budget set",
                            subClass: "text-[#10B981]",
                        },
                        {
                            icon: "🎯", iconBg: "bg-yellow-500/12", label: "Goals Progress",
                            value: loadingGoals ? "…" : `${avgGoalProgress}%`,
                            valueClass: "text-gold",
                            sub: `${activeGoals.length} active goal${activeGoals.length !== 1 ? "s" : ""}`,
                            subClass: "text-gold",
                        },
                        {
                            icon: "⚡", iconBg: "bg-indigo-500/12", label: "XP This Month",
                            value: loadingProfile ? "…" : `+${xp.toLocaleString()}`,
                            valueClass: "text-indigo-400",
                            sub: `${badges.length} badge${badges.length !== 1 ? "s" : ""} earned`,
                            subClass: "text-indigo-400",
                        },
                    ].map(({ icon, iconBg, label, value, valueClass, sub, subClass }) => (
                        <div key={label}
                            className="bg-surface-card border border-border-custom rounded-[14px] p-[22px] flex flex-col gap-2.5 hover:border-gold-dim hover:-translate-y-0.5 transition-all">
                            <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center text-[19px]`}>{icon}</div>
                            <div className="text-xs text-[#8A8A8A] font-medium">{label}</div>
                            <div className={`text-[26px] font-black leading-none tracking-tight ${valueClass}`}>{value}</div>
                            <div className={`text-xs font-semibold ${subClass}`}>{sub}</div>
                        </div>
                    ))}
                </div>

                {/* ── Middle row: Gamification + Recent Transactions ── */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">

                    {/* Gamification card */}
                    <div className="bg-gradient-to-br from-[#1c1507] to-surface-card border border-gold-dim rounded-[14px] p-[22px]">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="text-sm font-bold text-gold">⚡ Gamification Profile</div>
                                <div className="text-xs text-[#8A8A8A] mt-0.5">Keep going, you're on fire!</div>
                            </div>

                            {/* Level ring */}
                            <div className="relative w-[70px] h-[70px] flex-shrink-0">
                                <svg className="-rotate-90 w-full h-full" viewBox="0 0 70 70">
                                    <circle cx="35" cy="35" r="28" fill="none" stroke="#2A2A2A" strokeWidth="8" />
                                    <circle
                                        cx="35" cy="35" r="28" fill="none"
                                        stroke="#F59E0B" strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(ringDeg / 360) * 175.9} 175.9`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xl font-black text-gold leading-none">{level}</span>
                                    <span className="text-[9px] text-[#8A8A8A]">LVL</span>
                                </div>
                            </div>
                        </div>

                        {/* XP bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-[#8A8A8A]">XP Progress</span>
                                <span className="text-gold font-bold">{xp.toLocaleString()} / {((level) * XP_PER_LEVEL).toLocaleString()}</span>
                            </div>
                            <div className="w-full h-1.5 bg-surface-3 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-gold to-[#fbbf24] rounded-full transition-all"
                                    style={{ width: `${xpPct}%` }}
                                />
                            </div>
                            <div className="text-[11px] text-[#8A8A8A] mt-1">{xpLeft} XP to Level {level + 1} 🚀</div>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-2.5 mb-4">
                            {[
                                { val: xp.toLocaleString(), label: "Total XP", color: "text-gold" },
                                { val: `🔥 ${streak}`, label: "Streak", color: "text-white" },
                                { val: badges.length, label: "Badges", color: "text-indigo-400" },
                            ].map(({ val, label, color }) => (
                                <div key={label} className="bg-surface-2 border border-border-custom rounded-lg p-3 text-center">
                                    <div className={`text-lg font-extrabold ${color} leading-none`}>{val}</div>
                                    <div className="text-[10px] text-[#8A8A8A] mt-1">{label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Badges row */}
                        {badges.length > 0 && (
                            <div>
                                <div className="text-[11px] font-bold text-[#8A8A8A] tracking-widest mb-2">RECENT BADGES</div>
                                <div className="flex gap-2 flex-wrap">
                                    {badges.slice(0, 6).map((b, i) => {
                                        const meta = BADGE_META[b.badgeType] ?? { emoji: "🏅", label: b.badgeType };
                                        return (
                                            <div key={i} className="text-center">
                                                <div className="text-2xl">{meta.emoji}</div>
                                                <div className="text-[9px] text-gold mt-0.5">{meta.label}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-surface-card border border-border-custom rounded-[14px] p-[22px]">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-bold text-white">Recent Transactions</h2>
                            <span className="text-xs text-gold cursor-pointer hover:underline">View all →</span>
                        </div>

                        {loadingExp ? (
                            <div className="text-center text-[#8A8A8A] text-sm py-8">Loading…</div>
                        ) : recentExpenses.length === 0 ? (
                            <div className="text-center py-10">
                                <div className="text-4xl mb-3">💸</div>
                                <div className="text-sm text-[#8A8A8A]">No expenses yet</div>
                                <button onClick={() => setShowAddExpense(true)}
                                    className="mt-3 text-xs text-gold hover:underline cursor-pointer">
                                    Add your first expense →
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-0">
                                {recentExpenses.map((exp) => {
                                    const meta = CATEGORY_META[exp.category] ?? CATEGORY_META.OTHER;
                                    return (
                                        <div key={exp.id} className="flex items-center gap-3 py-3 border-b border-border-custom last:border-b-0">
                                            <div className={`w-10 h-10 ${meta.iconBg} rounded-[10px] flex items-center justify-center text-[17px] flex-shrink-0`}>
                                                {meta.emoji}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold text-white truncate">
                                                    {exp.note || meta.label}
                                                </div>
                                                <div className="text-xs text-[#8A8A8A]">
                                                    {new Date(exp.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {meta.label}
                                                </div>
                                            </div>
                                            <div className="text-[15px] font-bold text-[#EF4444] flex-shrink-0">
                                                −{fmt(exp.amount)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Bottom row: Budget + Goals ── */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                    {/* Budget tracker */}
                    <div className="bg-surface-card border border-border-custom rounded-[14px] p-[22px]">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-bold text-white">Monthly Budget</h2>
                            {budgets.length > 0 && totalSpent <= totalBudget && (
                                <span className="text-[11px] font-semibold bg-green-500/15 text-[#10B981] border-0 px-2.5 py-1 rounded-full">On Track ✓</span>
                            )}
                            {budgets.length > 0 && totalSpent > totalBudget && (
                                <span className="text-[11px] font-semibold bg-red-500/15 text-[#EF4444] px-2.5 py-1 rounded-full">Over Budget ⚠</span>
                            )}
                        </div>

                        {loadingBudgets ? (
                            <div className="text-center text-[#8A8A8A] text-sm py-6">Loading…</div>
                        ) : budgets.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-3">📊</div>
                                <div className="text-sm text-[#8A8A8A]">No budgets set yet</div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {budgets.map((b) => {
                                    const meta = CATEGORY_META[b.category] ?? CATEGORY_META.OTHER;
                                    const pct = b.limitAmount > 0 ? Math.min((Number(b.spentAmount) / Number(b.limitAmount)) * 100, 100) : 0;
                                    const isOver = Number(b.spentAmount) > Number(b.limitAmount);
                                    return (
                                        <div key={b.id} className="flex items-center gap-3">
                                            <div className={`w-[34px] h-[34px] ${meta.iconBg} rounded-lg flex items-center justify-center text-base flex-shrink-0`}>
                                                {meta.emoji}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center text-[13px] font-semibold mb-1.5">
                                                    <span className="text-white">{meta.label}</span>
                                                    <span className="text-xs text-[#8A8A8A]">
                                                        <span className={isOver ? "text-[#EF4444]" : "text-gold"}>
                                                            {fmt(b.spentAmount)}
                                                        </span>
                                                        {" / "}{fmt(b.limitAmount)}
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${isOver
                                                                ? "bg-gradient-to-r from-[#EF4444] to-[#f87171]"
                                                                : pct > 70
                                                                    ? "bg-gradient-to-r from-gold to-[#fbbf24]"
                                                                    : "bg-gradient-to-r from-[#10B981] to-[#34d399]"
                                                            }`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Active Goals */}
                    <div className="bg-surface-card border border-border-custom rounded-[14px] p-[22px]">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-bold text-white">Saving Goals 🎯</h2>
                            <span className="text-xs text-gold cursor-pointer hover:underline">View all →</span>
                        </div>

                        {loadingGoals ? (
                            <div className="text-center text-[#8A8A8A] text-sm py-6">Loading…</div>
                        ) : goals.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-3">🎯</div>
                                <div className="text-sm text-[#8A8A8A]">No goals yet. Create your first!</div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {goals.slice(0, 4).map((g) => {
                                    const pct = g.targetAmount > 0
                                        ? Math.min((Number(g.currentAmount) / Number(g.targetAmount)) * 100, 100)
                                        : 0;
                                    const done = g.completed;
                                    return (
                                        <div key={g.id}
                                            className={`border rounded-xl p-4 transition-all ${done
                                                    ? "border-green-500/30 bg-green-500/5"
                                                    : "border-border-custom hover:border-gold-dim"
                                                }`}>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center text-lg
                                                        ${done ? "bg-green-500/15" : "bg-gold-glow border border-gold-dim"}`}>
                                                        {done ? "✅" : "🎯"}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white">{g.name}</div>
                                                        <div className="text-[11px] text-[#8A8A8A]">
                                                            {done ? "Completed!" : `Due ${new Date(g.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full
                                                    ${done ? "bg-green-500/15 text-[#10B981]" : "bg-gold-glow text-gold border border-gold-dim"}`}>
                                                    {done ? "✓ Done" : "Active"}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-baseline mb-1.5">
                                                <span className={`text-lg font-extrabold ${done ? "text-[#10B981]" : "text-gold"}`}>
                                                    {fmt(g.currentAmount)}
                                                </span>
                                                <span className="text-xs text-[#8A8A8A]">/ {fmt(g.targetAmount)}</span>
                                            </div>
                                            <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${done ? "bg-gradient-to-r from-[#10B981] to-[#34d399]" : "bg-gradient-to-r from-gold to-[#fbbf24]"}`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <span className="text-[11px] text-[#8A8A8A]">{Math.round(pct)}% achieved</span>
                                                {done && <span className="text-[11px] font-bold text-[#10B981]">+100 XP 🎉</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* ══ Add Expense Modal ══ */}
            {showAddExpense && (
                <AddExpenseModal
                    onClose={() => setShowAddExpense(false)}
                    onSuccess={() => {
                        qc.invalidateQueries({ queryKey: ["expenses"] });
                        qc.invalidateQueries({ queryKey: ["expenses-month", currentMonth()] });
                        qc.invalidateQueries({ queryKey: ["gamification-profile"] });
                        qc.invalidateQueries({ queryKey: ["budget-status"] });
                    }}
                />
            )}

            {/* pulse keyframe */}
            <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}`}</style>
        </div>
    );
}