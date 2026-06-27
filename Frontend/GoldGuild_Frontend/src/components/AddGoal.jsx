import { X } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api.js";
import { Button } from "@/components/ui/button.jsx";

export default function AddGoal({ onClose, onSuccess }) {
    const [name, setName] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [deadline, setDeadline] = useState(tomorrow.toISOString().split("T")[0]);

    const addGoal = useMutation({
        mutationFn: async (data) => {
            const res = await api.post("/api/goals", data);
            return res.data;
        },
        onSuccess: () => {
            onSuccess();
            onClose();
        },
        onError: (e) => {
            alert("Error: " + (e?.response?.data?.message || e.message));
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Enter a valid goal name");
            return;
        }
        if (!targetAmount || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
            alert("Enter a valid target amount");
            return;
        }
        
        const selectedDate = new Date(deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate <= today) {
            alert("Deadline must be a future date");
            return;
        }

        addGoal.mutate({
            name,
            targetAmount: Number(targetAmount),
            deadline
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="flex flex-col items-stretch p-7 shadow-2xl bg-surface-card border border-border-custom rounded-md w-full max-w-[440px]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg text-white font-bold">Add Saving Goal </h3>
                    <Button size="icon" onClick={onClose} variant="ghost" className="rounded-full text-white border w-8 h-8">
                        <X size="20" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="font-semibold text-xs text-[#8A8A8A] mb-1.5 block">Goal Name</label>
                        <input
                            type="text"
                            placeholder="e.g., Buy Gold Coin, New Laptop"
                            className="w-full bg-surface-2 border border-border-custom rounded-lg text-white text-sm p-[11px_14px] outline-none focus:border-gold focus:ring-3 focus:ring-gold-glow placeholder:text-[#555]"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={100}
                        />
                    </div>

                    <div className="mt-5">
                        <label className="font-semibold text-xs text-[#8A8A8A] mb-1.5 block">Target Amount (₹)</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 text-gold font-bold text-lg -translate-y-1/2">₹</span>
                            <input
                                type="number"
                                min="1"
                                step="1"
                                className="w-full bg-surface-2 border border-border-custom rounded-lg text-gold font-extrabold text-xl pl-9 pr-3 py-2.5 outline-none focus:border-gold focus:ring-3 focus:ring-gold-glow placeholder:text-[#555] placeholder:font-normal"
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="mt-5">
                        <label className="text-xs font-semibold text-[#8A8A8A] mb-1.5 block tracking-wider">Deadline</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full bg-surface-2 border border-border-custom rounded-lg text-white text-sm p-[11px_14px] outline-none focus:border-gold focus:ring-3 focus:ring-gold-glow transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-gold-glow border border-gold-dim rounded-lg px-3.5 py-2.5 mt-5 text-xs text-gold font-semibold">
                        ✨ Achieving a saving goal earns you <strong>+100 XP</strong>!
                    </div>

                    <div className="flex gap-2.5 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-border-custom text-white text-sm font-semibold rounded-lg py-2.5 hover:border-gold/50 transition-all cursor-pointer bg-transparent"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={addGoal.isPending}
                            className="flex-[2] bg-gold text-[#0F0F0F] font-semibold text-sm rounded-lg py-2.5 hover:bg-[#fbbf24] hover:shadow-gold transition-all cursor-pointer disabled:opacity-50"
                        >
                            {addGoal.isPending ? "Creating…" : "Create Goal"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
