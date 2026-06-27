import {useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import api from "@/services/api.js";
import AddGoal from "@/components/AddGoal.jsx";
import {Goal,Check} from "lucide-react";

const fmt = (n) =>
    "₹" + Number(n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
export default function Goals (){
    const [name, setName] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [deadline, setDeadline] = useState("");
    const [contribAmounts, setContribAmounts] = useState({});
    const [showNewGoal, setShowNewGoal] = useState(false);

    const qc = useQueryClient();

    const {data:goals=[],isLoading}=useQuery({
        queryKey:["goals"],
        queryFn:async()=>{
            const res = await api.get("/api/goals");
            return res.data;
        }
    });

    const createGoal=useMutation({
        mutationFn:async (goalData)=>
        {
            const res=await api.post("/api/goals",goalData);
            return res.data;
        },
        onSuccess:async ()=>{
            await Promise.all([
                qc.invalidateQueries({ queryKey: ["goals"] }),
            qc.invalidateQueries({ queryKey: ["gamification-profile"] })
            ]);
            setName("");
            setTargetAmount("");
            setDeadline("");
            setShowNewGoal(false);
        } ,
        onError: (e) => alert("Error: " + (e?.response?.data?.message || e.message)),
    });
    const contributeGoal=useMutation({
        mutationFn:async ({id,amount})=>{
            const res = await api.put(`/api/goals/${id}/contribute`,{amount});
            return res.data;
        },
        onSuccess:async ()=> {
            await Promise.all([
                qc.invalidateQueries({queryKey: ["goals"]}),
                qc.invalidateQueries({queryKey: ["gamification-profile"]})
            ]);
        },
        onError: (e) => alert("Error: " + (e?.response?.data?.message || e.message)),
    })
    const deleteGoal = useMutation({
        mutationFn: async (id) => {
            const res = await api.delete(`/api/goals/${id}`);
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["goals"] });
        },
        onError: (e) => alert("Error: " + (e?.response?.data?.message || e.message)),
    });

    const handleCreate = (e) => {
        e.preventDefault();
        if (!name || !targetAmount || !deadline) {
            alert("Please fill in all fields.");
            return;
        }
        createGoal.mutate({
            name,
            targetAmount: Number(targetAmount),
            deadline,
        });
    };

    const handleContribute = (id) => {
        const amt = contribAmounts[id];
        if (!amt || isNaN(Number(amt)) || Number(amt) <= 0) {
            alert("Please enter a valid positive amount.");
            return;
        }
        contributeGoal.mutate({ id, amount: Number(amt) });
        setContribAmounts((prev) => ({ ...prev, [id]: "" }));
    };

    return(
        <div className="w-full bg-[#0F0F0F] text-zinc-400 p-6 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-extrabold text-white tracking-tight">Saving Goals</h2>
                    <p className="text-xs text-[#8A8A8A] mt-1">Set targets and fund your next financial milestone.</p>
                </div>
                <button
                    onClick={() => setShowNewGoal(true)}
                    className="bg-gold text-[#0F0F0F] font-semibold text-xs px-4 py-2 rounded-lg hover:bg-[#fbbf24] hover:shadow-gold transition-all cursor-pointer"
                >
                    + Create Goal
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-sm text-[#8A8A8A]">
                    Loading your goals ledger...
                </div>
            ) : goals.length === 0 ? (
                <div className="text-center py-16 bg-[#1A1A1A] border border-[#2E2E2E] rounded-[14px] flex flex-col items-center justify-center">
                    <div className="text-4xl mb-3"><Goal/></div>
                    <div className="text-sm font-bold text-white">No active goals found</div>
                    <p className="text-xs text-[#8A8A8A] mt-1 mb-4">
                        Set a saving goal and start mapping out your milestones!
                    </p>
                    <button
                        onClick={() => setShowNewGoal(true)}
                        className="bg-gold text-[#0F0F0F] font-semibold text-xs px-4 py-2 rounded-lg hover:bg-[#fbbf24] cursor-pointer"
                    >
                        Create Your First Goal
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {goals.map((goal) => {
                        const pct = goal.targetAmount > 0
                            ? Math.min((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100, 100)
                            : 0;
                        const done = goal.completed;

                        return (
                            <div
                                key={goal.id}
                                className={`bg-[#1A1A1A] border rounded-[14px] p-5 flex flex-col justify-between transition-all ${
                                    done
                                        ? "border-green-500/30 bg-green-500/5"
                                        : "border-[#2E2E2E] hover:border-gold-dim"
                                }`}
                            >
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-2.5">
                                            <div
                                                className={`w-10 h-10 rounded-[10px] flex items-center justify-center text-lg ${
                                                    done ? "bg-green-500/15" : "bg-gold-glow border border-gold-dim"
                                                }`}
                                            >
                                                {done ? <Check/> : <Goal/>}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{goal.name}</h4>
                                                <p className="text-[11px] text-[#8A8A8A]">
                                                    {done
                                                        ? "Milestone completed!"
                                                        : `Target date: ${new Date(goal.deadline).toLocaleDateString("en-IN", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        done
                                            ? "bg-green-500/15 text-[#10B981]"
                                            : "bg-gold-glow text-gold border border-gold-dim"
                                    }`}
                                >
                                    {done ? "✓ Done" : "Active"}
                                </span>
                                            <button
                                                onClick={() => {
                                                    if (confirm("Are you sure you want to delete this goal?")) {
                                                        deleteGoal.mutate(goal.id);
                                                    }
                                                }}
                                                className="w-7 h-7 rounded bg-[#222222] border border-[#2E2E2E] text-red-400 hover:bg-[#2A2A2A] flex items-center justify-center text-xs transition-colors cursor-pointer"
                                                title="Delete Goal"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-baseline mb-2">
                            <span className={`text-xl font-extrabold ${done ? "text-[#10B981]" : "text-gold"}`}>
                                {fmt(goal.currentAmount)}
                            </span>
                                        <span className="text-xs text-[#8A8A8A]">/ {fmt(goal.targetAmount)}</span>
                                    </div>


                                    <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${
                                                done ? "bg-gradient-to-r from-[#10B981] to-[#34d399]" : "bg-gradient-to-r from-gold to-[#fbbf24]"
                                            }`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1 text-[11px] text-[#8A8A8A]">
                                        <span>{Math.round(pct)}% saved</span>
                                        {done && <span className="font-bold text-[#10B981]">+100 XP awarded</span>}
                                    </div>
                                </div>


                                {!done && (
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-[#2E2E2E]/40">
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8A8A8A]">₹</span>
                                            <input
                                                type="number"
                                                placeholder="Contribute amount"
                                                value={contribAmounts[goal.id] || ""}
                                                onChange={(e) =>
                                                    setContribAmounts((prev) => ({
                                                        ...prev,
                                                        [goal.id]: e.target.value,
                                                    }))
                                                }
                                                className="w-full bg-[#222222] border border-[#2E2E2E] rounded-lg text-white text-xs pl-6 pr-2 py-2 outline-none focus:border-gold transition-colors"
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleContribute(goal.id)}
                                            disabled={contributeGoal.isPending}
                                            className="bg-gold-glow border border-gold-dim text-gold font-semibold text-xs px-3 py-2 rounded-lg hover:bg-gold hover:text-[#0F0F0F] transition-all cursor-pointer disabled:opacity-50"
                                        >
                                            Contribute
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            {showNewGoal &&
                <AddGoal onSuccess={async ()=>{
                   await qc.invalidateQueries({ queryKey: ["goals"] });
                    await qc.invalidateQueries({ queryKey: ["gamification-profile"] });
                    setShowNewGoal(false)
                }} onClose={()=>setShowNewGoal(false)}
                    />}
        </div>


    )
}