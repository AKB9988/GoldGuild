import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {useState} from "react";

import HomePage from "./pages/HomePage.jsx"
import AppSidebar from "@/components/AppSidebar.jsx";
import Expenses from "@/pages/Expenses.jsx";
import Goals from "@/pages/Goals.jsx";
import Analytics from "@/pages/Analytics.jsx";
import Friends from "@/pages/Friends.jsx";
import Leaderboard from "@/pages/Leaderboard.jsx";
import Settings from "@/pages/Settings.jsx";
import Login from "@/pages/Login.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Register from "@/pages/Register.jsx";
import AddExpense from "@/components/AddExpense.jsx";

const queryClient = new QueryClient();
export default function App() {
    const [activeNav,setActiveNav]= useState("Home")

    return (
        <>
        <QueryClientProvider client={queryClient}>
            <Login/>
            <Register/>

            {/*<AddExpense/>*/}

            <SidebarProvider>

                <AppSidebar activeNav={activeNav} setActiveNav={setActiveNav}/>
                <SidebarInset className="bg-surface-bg min-h-screen">
                    <div>
                        <SidebarTrigger className="-ml-1 text-slate-600 hover:bg-slate-100" />
                    </div>


                    <main className="p-6">
                        {activeNav==="Home" && <HomePage setActiveNav={setActiveNav}/>}
                        {activeNav==="Expenses" && <Expenses/>}
                        {activeNav==="Goals" && <Goals/>}
                        {activeNav==="Analytics" && <Analytics/>}
                        {activeNav==="Friends" && <Friends/>}
                        {activeNav==="Settings" && <Settings/>}
                        {activeNav==="Leaderboard" && <Leaderboard/>}
                    </main>

                </SidebarInset>
            </SidebarProvider>
        </QueryClientProvider>
            </>

    )
}