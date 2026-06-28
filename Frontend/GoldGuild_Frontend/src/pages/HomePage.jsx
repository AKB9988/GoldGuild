import {
    Trophy, Flame, Star, Target, CheckCircle2, Wallet, Gem, Zap, Crown, BriefcaseMedical,
    Bus,
    CircleDollarSign,
    Clapperboard,
    GraduationCap, Plus,
    ShoppingCart,
    UtensilsCrossed, DollarSign, Goal, Banknote, ChartNoAxesColumn
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api.js";
import { useMemo, useState } from "react";
import AddExpense from "@/components/AddExpense.jsx";
import AddGoal from "@/components/AddGoal.jsx";

export default function HomePage({ setActiveNav }) {
    const queryClient = useQueryClient();

    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showAddGoal, setShowAddGoal] = useState(false);

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

    const Badge_Data = {
        FIRST_EXPENSE: {
            icon: <Trophy size={20} />,
            label: "First Expense",
            colorClass: "bg-yellow-500/15 text-yellow-400",
            iconBg: "bg-yellow-500/12"
        },
        STREAK_7: {
            icon: <Flame size={20} />,
            label: "7-Day Streak",
            colorClass: "bg-orange-500/15 text-orange-400",
            iconBg: "bg-orange-500/12"
        },
        STREAK_30: {
            icon: <Star size={20} />,
            label: "30-Day Streak",
            colorClass: "bg-blue-500/15 text-blue-400",
            iconBg: "bg-blue-500/12"
        },
        FIRST_GOAL: {
            icon: <Target size={20} />,
            label: "First Goal",
            colorClass: "bg-red-500/15 text-red-400",
            iconBg: "bg-red-500/12"
        },
        GOAL_COMPLETED: {
            icon: <CheckCircle2 size={20} />,
            label: "Goal Crusher",
            colorClass: "bg-green-500/15 text-green-400",
            iconBg: "bg-green-500/12"
        },
        UNDER_BUDGET: {
            icon: <Wallet size={20} />,
            label: "Under Budget",
            colorClass: "bg-emerald-500/15 text-emerald-400",
            iconBg: "bg-emerald-500/12"
        },
        BUDGET_MASTER: {
            icon: <Gem size={20} />,
            label: "Budget Master",
            colorClass: "bg-cyan-500/15 text-cyan-400",
            iconBg: "bg-cyan-500/12"
        },
        LEVEL_5: {
            icon: <Zap size={20} />,
            label: "Level 5",
            colorClass: "bg-purple-500/15 text-purple-400",
            iconBg: "bg-purple-500/12"
        },
        XP_1000: {
            icon: <Crown size={20} />,
            label: "XP 1000",
            colorClass: "bg-amber-500/15 text-amber-400",
            iconBg: "bg-amber-500/12"
        },
    };
    const fmt = (n) =>
        "₹" + Number(n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
    const currentMonth = () => {
        const date = new Date();
        return "" + date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, 0);
    }
    const XP_PER_LEVEL = 500;
    const xpNextLevel = (xp) => XP_PER_LEVEL - (xp % XP_PER_LEVEL);
    const xpProgress = (xp) => ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
    const monthLabel = new Date().toLocaleString("default", { month: "long", year: "numeric" });
    const username = localStorage.getItem("username") || "user";

    const { data: profile, isLoading: loadingProfile } = useQuery({
        queryKey: ["gamification-profile"],
        queryFn: async () => {
            const res = await api.get("/api/gamification/profile");
            return res.data;
        }
    });
    const { data: expenses = [], isLoading: loadingExp } = useQuery({
        queryKey: ["expenses"],
        queryFn: async () => {
            const res = await api.get("/api/expenses");
            return res.data;
        }
    });
    const { data: monthExpenses = [], isLoading: monthlyExpLoading } = useQuery({
        queryKey: ["expenses-month", currentMonth()],
        queryFn: async () => {
            const res = await api.get(`/api/expenses/month/${currentMonth()}`);
            return res.data;
        }
    });
    const { data: budgets = [], isLoading: loadingBudget } = useQuery({
        queryKey: ["budget-status"],
        queryFn: async () => {
            const res = await api.get("/api/budgets/status");
            return res.data;
        }
    });
    const { data: goals = [], isLoading: loadingGoals } = useQuery({
        queryKey: ["goals"],
        queryFn: async () => {
            const res = await api.get("/api/goals");
            return res.data;
        }
    });
    const totalSpent = useMemo(
        () => monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
        [monthExpenses]
    );
    const recentExpenses = [...expenses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
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

    const xp = profile?.xp ?? 0;
    const level = profile?.level ?? 1;
    const streak = profile?.streakCount ?? 0;
    const badges = profile?.badges ?? [];
    const xpPct = xpProgress(xp);
    const xpLeft = xpNextLevel(xp);
    const ringDeg = Math.round((xpPct / 100) * 360);

    return (
        <div className="flex-col min-h-screen bg-surface-bg font-sans">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 w-full">
                <div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">
                        {greeting}, {username}
                    </h1>
                    <p className="text-sm text-[#8A8A8A] mt-1">
                        Here's your financial snapshot for {monthLabel}
                    </p>
                </div>
                <div className="flex items-center gap-3">

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

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {[
                    {
                        icon: <Banknote className="text-gold" />, iconBg: "bg-red-500/12", label: "Total Spent",
                        value: monthlyExpLoading ? "…" : fmt(totalSpent),
                        valueClass: "text-[#EF4444]",
                        sub: `${monthExpenses.length} transactions`,
                        subClass: "text-[#EF4444]",
                    },
                    {
                        icon: <CircleDollarSign className="text-gold" />, iconBg: "bg-green-500/12", label: "Budget Left",
                        value: loadingBudget ? "…" : fmt(Math.max(budgetLeft, 0)),
                        valueClass: budgetLeft < 0 ? "text-[#EF4444]" : "text-[#10B981]",
                        sub: totalBudget > 0 ? `${Math.round((totalSpent / totalBudget) * 100)}% used` : "No budget set",
                        subClass: "text-[#10B981]",
                    },
                    {
                        icon: <Goal className="text-gold" />, iconBg: "bg-yellow-500/12", label: "Goals Progress",
                        value: loadingGoals ? "…" : `${avgGoalProgress}%`,
                        valueClass: "text-gold",
                        sub: `${activeGoals.length} active goal${activeGoals.length !== 1 ? "s" : ""}`,
                        subClass: "text-gold",
                    },
                    {
                        icon: <Zap className="text-gold" />, iconBg: "bg-indigo-500/12", label: "XP This Month",
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

            {/*profile ans recent  transactions*/}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
                <div className="bg-gradient-to-br from-[#1c1507] to-surface-card border border-gold-dim rounded-[14px] p-[22px]">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="text-sm font-bold text-gold">Gamification Profile</div>
                            <div className="text-xs text-[#8A8A8A] mt-0.5">Keep going, you're on fire!</div>
                        </div>


                        <div className="relative w-[70px] h-[70px] flex-shrink-0 rounded-full flex items-center justify-center"
                             style={{
                                 background: `conic-gradient(#F59E0B ${xpPct}%, #2A2A2A ${xpPct}% 100%)`
                             }}
                        >

                            <div className="absolute w-[54px] h-[54px] bg-[#0F0F0F] rounded-full flex flex-col items-center justify-center">
                                <span className="text-xl font-black text-amber-500 leading-none">{level}</span>
                                <span className="text-[9px] text-[#8A8A8A]">LVL</span>
                            </div>
                        </div>
                    </div>

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
                        <div className="text-[11px] text-[#8A8A8A] mt-1">{xpLeft} XP to Level {level + 1} </div>
                    </div>


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

                    {badges.length > 0 && (
                        <div className="">
                            <div className="text-[11px] font-bold text-[#8A8A8A] tracking-widest mb-3">
                                RECENT BADGES
                            </div>
                            <div className="flex gap-4 flex-wrap">
                                <div className="flex gap-3 flex-wrap">
                                    {badges.slice(0, 6).map((b, i) => {
                                        const meta = Badge_Data[b.badgeType || b];

                                        if (!meta) return null;

                                        return (
                                            <div key={i} className="flex flex-col items-center text-center w-[65px]">
                                                <div className={`p-2 rounded-xl ${meta.iconBg} ${meta.colorClass} flex items-center justify-center`}>
                                                    {meta.icon}
                                                </div>
                                                <div className="text-[10px] text-amber-500 font-medium mt-1.5 truncate w-full">
                                                    {meta.label}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-surface-card border border-border-custom rounded-[14px] p-[22px]">
                    <div className=" flex w-full justify-between">
                        <h2 className="text-white font-bold">Recent Transactions</h2>
                        <span onClick={() => setActiveNav("Expenses")} className="text-gold font-semibold hover:underline cursor-pointer">View All →</span>
                    </div>
                    <div>
                        {
                            loadingExp ? (<div className="text-center text-[#8A8A8A] text-sm py-6">
                                    Loading...
                                </div>) :
                                recentExpenses.length === 0 ? (
                                    <div className="flex flex-col justify-center items-center w-full py-6">
                                        <div className="w-10 h-10 mt-2 rounded-lg mb-2 p-2 bg-green-300/12 text-white"><DollarSign /></div>
                                        <div className="text-sm text-[#8A8A8A] ">No expenses yet</div>
                                        <button onClick={() => setShowAddExpense(true)} className="text-gold hover:underline cursor-pointer font-bold text-sm bg-transparent border-0">Add your first expense →</button>
                                    </div>
                                ) : (
                                    <div className="space-y-0">
                                        {recentExpenses.map((exp) => {
                                            const meta = Category_Data[exp.category] ?? Category_Data.OTHER;
                                            return (
                                                <div key={exp.id} className="flex items-center gap-3 py-3 border-b border-border-custom last:border-b-0">
                                                    <div className={`w-10 h-10 ${meta.iconBg} rounded-[10px] flex items-center justify-center text-[17px] flex-shrink-0`}>
                                                        {meta.icon}
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
            </div>

            {/*Budget and goals*/}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div className="bg-surface-card border border-border-custom rounded-[14px] p-[22px]">
                    <div className="flex justify-between items-center mb-5 ">
                        <h2 className="font-bold text-white">Monthly Budget</h2>
                        {
                            budgets.length > 0 && (
                                totalSpent > totalBudget ?
                                    <span className="text-[11px] font-semibold bg-red-500/15 text-[#EF4444] px-2.5 py-1 rounded-full">Over budget ⚠ </span> :
                                    <span className="text-[11px] font-semibold bg-green-500/15 text-[#10B981] px-2.5 py-1 rounded-full">On Track ✓</span>
                            )
                        }
                    </div>
                    {loadingBudget ? (
                        <div className="text-center text-[#8A8A8A] text-sm py-6">Loading…</div>
                    ) : budgets.length === 0 ? (
                        <div className="flex flex-col justify-center items-center w-full ">
                            <div className="w-10 h-10 mt-2 rounded-lg mb-2 p-2 bg-green-300/12 text-white"><ChartNoAxesColumn /></div>
                            <div className="text-sm text-[#8A8A8A]">No budgets set yet</div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {budgets.map((b) => {
                                const meta = Category_Data[b.category] ?? Category_Data.OTHER;
                                const isOver = Number(b.spentAmount) > Number(b.limitAmount);
                                const pct = b.limitAmount > 0 ? Math.min((Number(b.spentAmount) / Number(b.limitAmount)) * 100, 100) : 0;


                                let barColor = "from-[#10B981] to-[#34d399]";
                                if (isOver) barColor = "from-[#EF4444] to-[#f87171]";
                                else if (pct > 70) barColor = "from-gold to-[#fbbf24]";
                                return (
                                    <div key={b.id} className="flex items-center gap-3">

                                        <div className={`w-[34px] h-[34px] ${meta.iconBg} rounded-lg flex items-center justify-center`}>
                                            {meta.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center text-[13px] font-semibold mb-1.5">
                                                <span className="text-white">{meta.label}</span>
                                                <span className="text-xs text-[#8A8A8A]">
                                                    <span className={isOver ? "text-[#EF4444]" : "text-gold"}>
                                                        {fmt(b.spentAmount)}
                                                    </span>
                                                    {` / ${fmt(b.limitAmount)}`}
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all bg-gradient-to-r ${barColor}`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}


                        </div>

                    )
                    }</div>


                <div className="bg-surface-card border border-border-custom rounded-[14px] p-[22px]">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-bold text-white">Saving Goals </h2>
                        <span onClick={() => setActiveNav("Goals")} className="text-gold cursor-pointer hover:underline">View all →</span>
                    </div>

                    {loadingGoals ? (
                        <div className="text-center text-[#8A8A8A] text-sm py-6">Loading…</div>
                    ) : goals.length === 0 ? (
                        <div className="flex flex-col justify-center items-center w-full ">
                            <div className="w-10 h-10 mt-2 rounded-lg mb-2 p-2 bg-green-300/12 text-white "><Goal/></div>
                            <div className="text-sm text-[#8A8A8A] mb-2.5">No goals yet.</div>
                            <button onClick={() => setShowAddGoal(true)} className="text-gold hover:underline cursor-pointer font-bold text-sm bg-transparent border-0">Create your first! →</button>
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
            {showAddExpense && (
                <AddExpense
                    Category_Data={Category_Data}
                    onClose={() => setShowAddExpense(false)}
                    onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ["expenses"] });
                        queryClient.invalidateQueries({ queryKey: ["expenses-month"] });
                        queryClient.invalidateQueries({ queryKey: ["budget-status"] });
                        queryClient.invalidateQueries({ queryKey: ["gamification-profile"] });
                    }}
                />
            )}
            {showAddGoal && (
                <AddGoal
                    onClose={() => setShowAddGoal(false)}
                    onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ["goals"] });
                        queryClient.invalidateQueries({ queryKey: ["gamification-profile"] });
                    }}
                />
            )}
        </div>
    )
}

