import {Banknote, Goal, Home, Podium, Handshake, ChartNoAxesColumn, Settings, Trophy, LogOut} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"

export default function AppSidebar({activeNav, setActiveNav, onLogout}){
    const { state } = useSidebar();

    const NAV_ICONS=[
        { icon: <Home size={20} />, label: "Home" },
        { icon: <Banknote size={20} />, label: "Expenses" },
        { icon: <Goal size={20} />, label: "Goals" },
        { icon: <Podium size={20} />, label: "Leaderboard" },
        { icon: <Handshake size={20} />, label: "Friends" },
        { icon: <ChartNoAxesColumn size={20} />, label: "Analytics" },
        { icon: <Settings size={20} />, label: "Settings" }
    ]
    const username = localStorage.getItem("username") || "User";

    return(
        <>
            <Sidebar className="dark" collapsible="icon">
                <SidebarHeader className="bg-surface-card border-b border-border-custom p-0">
                    <div className={`flex items-center justify-between transition-all duration-200 ${state === "collapsed" ? "flex-col gap-3 p-3" : "px-4 py-4"}`}>
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[10px] flex items-center justify-center text-lg shadow-[0_0_15px_rgba(251,191,36,0.3)] flex-shrink-0"><Trophy /></div>
                            {state !== "collapsed" && <span className="text-lg font-extrabold text-amber-500 tracking-tight">GoldGuild</span>}
                        </div>
                        <SidebarTrigger className="text-[#8A8A8A] hover:text-gold hover:bg-surface-2 p-1.5 rounded-lg transition-colors cursor-pointer flex-shrink-0" />
                    </div>
                </SidebarHeader>

                <SidebarContent className="bg-surface-card">
                    {NAV_ICONS.map(({icon,label})=>(
                        <SidebarGroup key={label} className={state === "collapsed" ? "p-1" : "p-2"}>
                            <div
                                onClick={()=>setActiveNav(label)}
                                className={`flex items-center rounded-lg text-sm font-medium cursor-pointer transition-all border 
                                ${state === "collapsed" ? "justify-center px-0 py-2" : "gap-2.5 px-3 py-2"}
                                ${activeNav === label ? "bg-gold-glow border-gold-dim text-gold font-semibold" : "border-transparent text-[#8A8A8A] hover:bg-surface-2 hover:text-white"}`}
                                title={state === "collapsed" ? label : undefined}>
                                <span className="flex-shrink-0">{icon}</span>
                                {state !== "collapsed" && <span>{label}</span>}
                            </div>
                        </SidebarGroup>
                    ))}
                </SidebarContent>

                <SidebarFooter className="bg-surface-card p-0 border-t border-border-custom">
                    <div className={`flex items-center justify-between transition-all duration-200 ${state === "collapsed" ? "flex-col gap-2 p-3" : "px-4 py-3.5"} font-semibold text-white`}>
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="rounded-full h-9 w-9 flex items-center justify-center bg-gold text-xs text-[#0F0F0F] font-bold flex-shrink-0">
                                {username.slice(0,2).toUpperCase()}
                            </div>
                            {state !== "collapsed" && <span className="truncate text-sm text-zinc-200">{username}</span>}
                        </div>
                        <button
                            onClick={onLogout}
                            title="Log Out"
                            className="p-2 text-[#8A8A8A] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer flex items-center justify-center flex-shrink-0"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </SidebarFooter>
            </Sidebar>
        </>
    )
}