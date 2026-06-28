import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import api from "../services/api";
import {ChartNoAxesColumn, Flame, Goal, Medal, Zap} from "lucide-react";
import HomePage from "@/pages/HomePage.jsx";


export default function Login({ onLoginSuccess, onNavigateToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = useMutation({
        mutationFn: async (userData) => {
            const response = await api.post("/api/auth/login", userData);
            return response.data;
        },
        onSuccess: (data) => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                setEmail('');
                setPassword('');
                if (onLoginSuccess) onLoginSuccess();
            }
            else
                alert("Login successful but token not saved check backend");

        },
        onError: (error) => {
            alert("Login failed: " + (error?.response?.data?.message || error?.message || "Invalid Credentials"));
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Please fill all fields.");
            return;
        }
        login.mutate({ email, password });
    }

    return (
        <div className="w-full min-h-screen bg-surface-bg flex items-center justify-center p-4">
            <div className="flex w-full max-w-[900px] min-h-[560px] rounded-[22px] overflow-hidden border border-border-custom shadow-dark flex-col md:flex-row">


                <div className="flex-1 bg-gradient-to-br from-[#1c1507] to-surface-card p-8 md:p-[50px_44px] flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(245,158,11,0.12),transparent_70%)] rounded-full"></div>
                    <div className="w-14 h-14 bg-gradient-to-br from-gold to-[#d97706] rounded-[16px] flex items-center justify-center text-3xl mb-7 glow-gold relative z-10">🏆</div>
                    <div className="text-3xl font-extrabold leading-tight mb-3.5 tracking-tight text-white relative z-10">
                        Master your<br />
                        <span className="text-gold">finances</span>,<br />
                        level up your life.
                    </div>
                    <div className="text-sm text-[#8A8A8A] leading-relaxed mb-9 relative z-10">
                        Track expenses, hit saving goals, earn XP & badges — and compete with friends on the leaderboard.
                    </div>
                    <ul className="list-none flex flex-col gap-3 relative z-10">
                        <li className="flex items-center gap-2.5 text-sm text-[#8A8A8A]">
                            <span className="text-gold text-[15px]"><Zap/></span> Earn XP for every logged expense
                        </li>
                        <li className="flex items-center gap-2.5 text-sm text-[#8A8A8A]">
                            <span className="text-gold text-[15px]"><Goal/></span> Set & achieve saving goals
                        </li>
                        <li className="flex items-center gap-2.5 text-sm text-[#8A8A8A]">
                            <span className="text-gold text-[15px]"><Medal/></span> Unlock badges & climb ranks
                        </li>
                        <li className="flex items-center gap-2.5 text-sm text-[#8A8A8A]">
                            <span className="text-gold text-[15px]"><ChartNoAxesColumn/></span> Visual budget analytics
                        </li>
                        <li className="flex items-center gap-2.5 text-sm text-[#8A8A8A]">
                            <span className="text-gold text-[15px]"><Flame/></span> Maintain daily streaks
                        </li>
                    </ul>
                </div>

                <div className="w-full md:w-[400px] bg-surface-card p-8 md:p-[50px_44px] flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-1.5 text-white">Welcome back</h2>
                    <p className="text-sm text-[#8A8A8A] mb-7">Sign in to your GoldGuild account</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-[#8A8A8A] mb-1.5 block tracking-wider">Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-surface-2 border border-border-custom rounded-lg text-white text-sm p-[11px_14px] outline-none focus:border-gold focus:ring-3 focus:ring-gold-glow transition-all placeholder:text-[#555]"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="text-xs font-semibold text-[#8A8A8A] block tracking-wider">Password</label>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-surface-2 border border-border-custom rounded-lg text-white text-sm p-[11px_14px] outline-none focus:border-gold focus:ring-3 focus:ring-gold-glow transition-all placeholder:text-[#555]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={login.isPending}
                            className="w-full mt-2 inline-flex items-center justify-center gap-1.5 font-semibold text-sm p-[10px_22px] rounded-lg bg-gold text-[#0F0F0F] cursor-pointer hover:bg-[#fbbf24] hover:shadow-gold hover:-translate-y-px active:translate-y-0 transition-all disabled:opacity-50"
                        >
                            {login.isPending ? "Logging in...." : "Sign In →"}
                        </button>
                    </form>

                    <div className="text-center text-xs text-[#8A8A8A] mt-6">
                        Don't have an account? <span onClick={onNavigateToRegister} className="text-gold font-semibold hover:underline ml-1 cursor-pointer">Signup</span>
                    </div>

                    <div className="mt-5 bg-gold-glow border border-gold-dim rounded-lg p-3 flex items-center gap-2.5">
                        <span className="text-xl">✨</span>
                        <div>
                            <div className="text-xs font-bold text-gold">New here?</div>
                            <div className="text-[11px] text-[#8A8A8A]">You'll earn 50 XP just for registering!</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}