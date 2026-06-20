import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import api from "../services/api";

export default function Login()
{
    const [email, setEmail]= useState('');
    const [password, setPassword] = useState('');

    const login = useMutation({
        mutationFn:async (userData)=>{
            const response= await api.post("/api/auth/login",userData);
            return response.data;
        },
        onSuccess:(data)=>{
            if(data.token)
            {
                localStorage.setItem('token', data.token);
                alert("Login successful, token saved.");
                setEmail('');
                setPassword('');
            }
            else
                alert("Login successful but token not saved check backend");
            
        },
        onError:(error)=>
        {
            alert("Login failed: " + (error?.response?.data?.message || error?.message || "Invalid Credentials"));
        }
    });

    const handleSubmit =(e)=>{
        e.preventDefault();
        if(!email||!password){
            alert("Please fill all fields." );
            return;
        }
        login.mutate({email,password});
    }

    return (
        <div className="w-full min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#1A1A1A] rounded-[24px] border border-[#333]/60 p-8 shadow-2xl transition-all duration-300 hover:border-[#F59E0B]/30 flex flex-col justify-between min-h-[500px]">
                <div>
                    <div className="text-center pb-6">
                        <div className="text-4xl font-bold text-[#F59E0B] tracking-tight">GoldGuild</div>
                        <div className="text-[#9CA3AF] text-sm mt-2">make budgeting feel like a game</div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[#9CA3AF] text-[11px] mb-1 font-medium">Email</label>
                            <input 
                                type="email" 
                                placeholder="Enter Email" 
                                value={email} 
                                onChange={(e)=>setEmail(e.target.value)}
                                className="w-full bg-[#0F0F0F] border border-[#333]/80 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/30 transition-all placeholder:text-[#555]"
                            />
                        </div>
                        <div>
                            <label className="block text-[#9CA3AF] text-[11px] mb-1 font-medium">Password</label>
                            <input 
                                type="password" 
                                placeholder="Enter Password" 
                                value={password} 
                                onChange={(e)=>setPassword(e.target.value)}
                                className="w-full bg-[#0F0F0F] border border-[#333]/80 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/30 transition-all placeholder:text-[#555]"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={login.isPending}
                            className="w-full bg-[#F59E0B] hover:bg-[#d98a0a] active:scale-[0.98] text-[#0F0F0F] font-semibold py-2.5 rounded-lg text-sm transition-all disabled:opacity-50 mt-6 cursor-pointer shadow-md shadow-[#F59E0B]/10"
                        >
                            {login.isPending ? "Logging in...." : "Login"}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-8 text-[#9CA3AF] text-xs">
                    Don't have an account? <span className="text-[#F59E0B] hover:underline ml-1 font-medium">Signup</span>
                </div>
            </div>
        </div>
    )
}