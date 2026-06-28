import {
    X
} from "lucide-react";
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import api from "@/services/api.js";
import {Button} from "@/components/ui/button.jsx";

export default function AddExpense({onClose,onSuccess,Category_Data}){

    const[amount , setAmount]=useState("");
    const[category, setCategory]= useState("FOOD");
    const [note , setNote] = useState("");
    const [date, setDate]=useState(new Date().toISOString().split("T")[0]);

    const addExpense=useMutation({
        mutationFn:async (data)=>
        {
            const res = await api.post("/api/expenses",data);
            return res.data;
        },
        onSuccess:()=>{onSuccess(); onClose(); },
        onError:(e)=>alert("Error: "+ (e?.response?.data?.message || e.message))
    });

    const handleSubmit=(e)=>{
        e.preventDefault();
        if(!amount||isNaN(Number(amount))|| Number(amount)<=0) {
            alert("Enter valid amount");
            return;
        }
        addExpense.mutate({
            amount :Number(amount),
            category,
            note,
            date
        });
    };
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="flex flex-col items-stretch p-5 sm:p-7 shadow-2xl bg-surface-card border rounded-md w-full max-w-[440px] max-h-[90vh] overflow-y-auto">
            <div className= "flex items-center justify-between mb-6">
                <h3 className="text-lg text-white font-bold"> Add Expense  </h3>
                <Button size="icon" onClick={onClose} variant="ghost" className="rounded-full text-white border w-8 h-8"><X size="20"/> </Button>
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
                            className="w-full bg-surface-2 border border-border-custom rounded-lg text-gold font-extrabold text-xl pl-9 pr-3 py-2.5 outline-none focus:border-gold focus:ring-3 focus:ring-gold-glow placeholder:text-[#555] placeholder:font-normal"
                            value={amount}
                            onChange={(e)=>setAmount(e.target.value)}
                            placeholder="0.00"/>
                    </div>
                </div>

                <div className="mt-5 relative">
                <label className="font-semibold text-xs text-[#8A8A8A] mb-1.5 block">Category</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {Object.entries(Category_Data).map(([key,value]) => (
                            <button
                                key={key} type="button"
                                onClick={() => setCategory(key)}
                                className={`p-2 sm:p-2.5 rounded-lg border text-center text-[10px] sm:text-[11px] font-semibold transition-all cursor-pointer flex flex-col items-center justify-center truncate
                                        ${category === key
                                    ? "border-gold text-gold bg-gold-glow"
                                    : "border text-[#8A8A8A] bg-surface-2 hover:border-gold/50 hover:text-gold/70"
                                }`}
                            >
                                <span className="block text-base sm:text-lg mb-0.5">{value.icon}</span>
                                <span className="truncate max-w-full">{value.label}</span>
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

                <div className="flex items-center gap-2 bg-gold-glow border border-gold-dim rounded-lg px-3.5 py-2.5 mt-5 text-xs text-gold font-semibold">
                    ⚡ You'll earn <strong>+10 XP</strong> for this entry!
                </div>

                <div className="flex gap-2.5 pt-1">
                    <button type="button" onClick={onClose}
                            className="flex-1 border border-border-custom text-white text-sm font-semibold rounded-lg py-2.5 hover:border-gold/50 transition-all cursor-pointer bg-transparent">
                        Cancel
                    </button>
                    <button type="submit" disabled={addExpense.isPending}
                            className="flex-[2] bg-gold text-[#0F0F0F] font-semibold text-sm rounded-lg py-2.5 hover:bg-[#fbbf24] hover:shadow-gold transition-all cursor-pointer disabled:opacity-50">
                        {addExpense.isPending ? "Adding…" : "Add Expense "}
                    </button>
                </div>
                </form>
        </div>
        </div>
    )
}