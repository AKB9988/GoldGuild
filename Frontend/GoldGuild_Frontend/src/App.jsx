import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { useState } from "react";
import { Trophy } from "lucide-react";

import HomePage from "./pages/HomePage.jsx"
import AppSidebar from "@/components/AppSidebar.jsx";
import Expenses from "@/pages/Expenses.jsx";
import Goals from "@/pages/Goals.jsx";
import Analytics from "@/pages/Analytics.jsx";
import Friends from "@/pages/Friends.jsx";
import Leaderboard from "@/pages/Leaderboard.jsx";
import Settings from "@/pages/Settings.jsx";
import Login from "@/pages/Login.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Register from "@/pages/Register.jsx";

const queryClient = new QueryClient();

export default function App() {
    const [authScreen, setAuthScreen] = useState(() => 
        localStorage.getItem("token") ? "app" : "login"
    );
    const [activeNav, setActiveNav] = useState("Home");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setAuthScreen("login");
    };

    return (
        <QueryClientProvider client={queryClient}>
            {authScreen === "login" && (
                <Login 
                    onLoginSuccess={() => setAuthScreen("app")} 
                    onNavigateToRegister={() => setAuthScreen("register")} 
                />
            )}

            {authScreen === "register" && (
                <Register 
                    onNavigateToLogin={() => setAuthScreen("login")} 
                />
            )}

            {authScreen === "app" && (
                <SidebarProvider>
                    <AppSidebar 
                        activeNav={activeNav} 
                        setActiveNav={setActiveNav} 
                        onLogout={handleLogout}
                    />
                    <SidebarInset className="bg-surface-bg min-h-screen flex flex-col">
                        {/* Mobile Only Navigation Bar */}
                        <header className="flex md:hidden items-center justify-between px-4 py-3 bg-surface-card border-b border-border-custom sticky top-0 z-40">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[8px] flex items-center justify-center text-sm shadow-[0_0_10px_rgba(251,191,36,0.3)]"><Trophy size={16} className="text-white" /></div>
                                <span className="text-base font-extrabold text-amber-500 tracking-tight">GoldGuild</span>
                            </div>
                            <SidebarTrigger className="text-[#8A8A8A] hover:text-gold hover:bg-surface-2 p-1.5 rounded-lg transition-colors cursor-pointer" />
                        </header>

                        {/* Main Content View */}
                        <main className="p-4 sm:p-6 flex-1 min-w-0 overflow-x-hidden">
                            {activeNav === "Home" && <HomePage setActiveNav={setActiveNav} />}
                            {activeNav === "Expenses" && <Expenses />}
                            {activeNav === "Goals" && <Goals />}
                            {activeNav === "Analytics" && <Analytics />}
                            {activeNav === "Friends" && <Friends />}
                            {activeNav === "Settings" && <Settings />}
                            {activeNav === "Leaderboard" && <Leaderboard />}
                        </main>

                        {/* App Footer */}
                        <footer className="mt-auto border-t border-border-custom/40 py-6 px-6 text-center text-xs text-[#8A8A8A] bg-surface-bg">
                            <p className="font-semibold text-gold/90 text-sm mb-1">GoldGuild — Master Your Financial Future 🏆</p>
                            <p>Empowering you to save smarter, track expenditures, and level up your financial freedom every single day.</p>
                        </footer>
                    </SidebarInset>
                </SidebarProvider>
            )}
        </QueryClientProvider>
    );
}