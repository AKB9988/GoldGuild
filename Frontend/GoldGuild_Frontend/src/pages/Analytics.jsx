import {
    BriefcaseMedical,
    Bus,
    CircleDollarSign,
    Clapperboard,
    GraduationCap, Plus,
    ShoppingCart,
    UtensilsCrossed
} from "lucide-react";
import {useQuery} from "@tanstack/react-query";


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

    const fmt=(n)=>
        "₹" + Number(n??0).toLocaleString("en-IN", { maximumFractionDigits: 0 });



export default function Analytics (){

    const {data:expenses=[],isLoading:loadingExpenses}=useQuery({
        queryKey:["expenses"],
        queryFn:async ()=>{
            const res = await api.get("/api/expenses");
            return res.data;
        }
    });

    const totalSpentAllTime = expenses.reduce((sum,e)=>sum+Number(e.amount),0);
    const avgTransaction = expenses.length ? totalSpentAllTime/expenses.length:0;
    const highestExpense= expenses.length?Math.max(...expenses.map((e)=>Number(e.amount))):0;

    const categoryBreakdown = expenses.reduce((acc, e)=>{
        const cat = e.category|| "Other"
        acc[cat] = (acc[cat]||0)+Number(e.amount);
        return acc;
    },{});

    const sortedCategories = Object.entries(categoryBreakdown)
        .map(([cat, total]) => {
            const meta = Category_Data[cat] || { icon: <Plus size={20} />, label: cat };
            const pct = totalSpentAllTime > 0 ? (total / totalSpentAllTime) * 100 : 0;
            return { cat, total, pct, ...meta };
        })
        .sort((a, b) => b.total - a.total);


    return (
        <div className="w-full bg-[#0F0F0F] text-zinc-400 p-6 font-sans">

            <div className="mb-6">
                <h2 className="text-xl font-extrabold text-white tracking-tight">Spending Analytics </h2>
                <p className="text-xs text-[#8A8A8A] mt-1">Review spending distributions, average transaction sizing, and category logs.</p>
            </div>

            {loadingExpenses ? (
                <div className="text-center py-12 text-sm text-[#8A8A8A]">Processing ledger metrics...</div>
            ) : expenses.length === 0 ? (
                <div className="text-center py-16 bg-[#1A1A1A] border border-[#2E2E2E] rounded-[14px]">
                    <div className="text-4xl mb-3">📊</div>
                    <div className="text-sm font-bold text-white">No analytics compiled yet</div>
                    <p className="text-xs text-[#8A8A8A] mt-1">Add expenses in the dashboard or expenses ledger to view breakdowns.</p>
                </div>
            ) : (
                <div className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl p-5 hover:border-gold-dim transition-all">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8A8A8A]">Total Logged Ledger</span>
                            <div className="text-2xl font-black text-white mt-1.5">{fmt(totalSpentAllTime)}</div>
                            <span className="text-[10px] text-zinc-500 block mt-1">{expenses.length} transaction entries</span>
                        </div>

                        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl p-5 hover:border-gold-dim transition-all">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8A8A8A]">Average Transaction Size</span>
                            <div className="text-2xl font-black text-gold mt-1.5">{fmt(avgTransaction)}</div>
                            <span className="text-[10px] text-zinc-500 block mt-1">Mean expenditure per log</span>
                        </div>

                        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl p-5 hover:border-gold-dim transition-all">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8A8A8A]">Highest Transaction Entry</span>
                            <div className="text-2xl font-black text-red-400 mt-1.5">{fmt(highestExpense)}</div>
                            <span className="text-[10px] text-zinc-500 block mt-1">Single maximum spend log</span>
                        </div>
                    </div>


                    <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl p-6 shadow-md">
                        <h3 className="text-sm font-bold text-white mb-5">Category Distribution</h3>
                        <div className="space-y-4">
                            {sortedCategories.map((c) => (
                                <div key={c.cat} className="space-y-1.5">
                                    <div className="flex justify-between items-center text-xs font-semibold">
                                        <span className="text-white flex items-center gap-2">
                                            <span>{c.icon}</span> {c.label}
                                        </span>
                                        <span className="text-zinc-300">
                                            {fmt(c.total)} <span className="text-[#8A8A8A] font-normal">({Math.round(c.pct)}%)</span>
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-[#222222] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-gold to-[#fbbf24] rounded-full transition-all"
                                            style={{ width: `${c.pct}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}