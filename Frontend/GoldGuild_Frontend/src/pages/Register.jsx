import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../services/api.js";

export default function Register({ onNavigateToLogin, onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signup = useMutation({
        mutationFn: async (userData) => {
            const response = await api.post("/api/auth/register", userData);
            return response.data;
        },
        onSuccess: (data) => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                setEmail('');
                setPassword('');
                setUsername('');
                if (onLoginSuccess) onLoginSuccess();
            } else {
                alert("Registration successful, please sign in.");
                if (onNavigateToLogin) onNavigateToLogin();
            }
        },
        onError: (error) => {
            alert("Error: " + (error?.response?.data?.message || error?.message || "Something went wrong"));
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !email || !password) {
            alert("Please fill all fields");
            return;
        }
        signup.mutate({ username, email, password });
    };


    return (
        <div className="w-full min-h-screen bg-surface-bg flex items-center justify-center p-4">
            <div className="w-full max-w-[480px] bg-surface-card rounded-[22px] border border-border-custom p-8 md:p-[44px] shadow-dark flex flex-col justify-between">
                <div>
                    <div className="text-center mb-8">
                        <div className="w-[52px] h-[52px] bg-gradient-to-br from-gold to-[#d97706] rounded-[14px] flex items-center justify-center text-2xl mx-auto mb-4 shadow-gold">🏆</div>
                        <h2 className="text-2xl font-extrabold text-white">Join GoldGuild</h2>
                        <p className="text-sm text-[#8A8A8A] mt-1">Start your financial journey today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-xs font-semibold text-[#8A8A8A] mb-1.5 block tracking-wider">Username</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-surface-2 border border-border-custom rounded-lg text-white text-sm p-[11px_14px] pr-10 outline-none focus:border-gold focus:ring-3 focus:ring-gold-glow transition-all placeholder:text-[#555]"
                                />
                                {username.length >= 3 && (
                                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#10B981] text-sm">✓</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-[#8A8A8A] mb-1.5 block tracking-wider">Email Address</label>
                            <input
                                type="email"
                                placeholder="arjun@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-surface-2 border border-border-custom rounded-lg text-white text-sm p-[11px_14px] outline-none focus:border-gold focus:ring-3 focus:ring-gold-glow transition-all placeholder:text-[#555]"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-[#8A8A8A] mb-1.5 block tracking-wider">Password</label>
                            <input
                                type="password"
                                placeholder="Min 8 chars, 1 uppercase, 1 number"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-surface-2 border border-border-custom rounded-lg text-white text-sm p-[11px_14px] outline-none focus:border-gold focus:ring-3 focus:ring-gold-glow transition-all placeholder:text-[#555]"
                            />

                        </div>


                        <div className="text-xs text-[#8A8A8A] flex items-start gap-2.5 mb-5 select-none">
                            <input
                                type="checkbox"
                                id="terms-cb"
                                defaultChecked
                                className="mt-0.5 accent-gold"
                            />
                            <label htmlFor="terms-cb" className="cursor-pointer">
                                I agree to the <a href="#" className="text-gold hover:underline">Terms of Service</a> and <a href="#" className="text-gold hover:underline">Privacy Policy</a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={signup.isPending}
                            className="w-full inline-flex items-center justify-center gap-1.5 font-semibold text-sm p-[10px_22px] rounded-lg bg-gold text-[#0F0F0F] cursor-pointer hover:bg-[#fbbf24] hover:shadow-gold hover:-translate-y-px active:translate-y-0 transition-all disabled:opacity-50"
                        >
                            {signup.isPending ? "Registering...." : "Create Account"}
                        </button>
                    </form>
                </div>

                <div className="text-center text-xs text-[#8A8A8A] mt-6">
                    Already have an account? <span onClick={onNavigateToLogin} className="text-gold font-semibold hover:underline ml-1 cursor-pointer">Login</span>
                </div>

                <div className="mt-5 bg-surface-2 rounded-lg p-3 flex gap-3 items-center">
                    <span className="text-2xl">🎁</span>
                    <div className="text-xs">
                        <span className="font-bold text-gold">Welcome Bonus: </span>
                        <span className="text-[#8A8A8A]">+50 XP on your first login. Start your streak today!</span>
                    </div>
                </div>
            </div>
        </div>
    );
}