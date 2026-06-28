import {useQuery} from "@tanstack/react-query";
import api from "@/services/api.js";

export default function Leaderboard (){
    const {data:leaderboard=[],isLoading}= useQuery({
        queryKey:["leaderboard"],
        queryFn:async ()=>{
            const res = await api.get("/api/gamification/leaderboard");
            return res.data;
        }
    });

    const currentUser = localStorage.getItem("username")||"";

    const rank1= leaderboard.find((u)=> u.rank===1);
    const rank2= leaderboard.find((u)=>u.rank===2);
    const rank3= leaderboard.find((u)=>u.rank===3);


    return(
        <div className="w-full text-zinc-400 font-sans">

            <div className="mb-6 sm:mb-8">
                <h2 className="text-xl font-extrabold text-white tracking-tight">Guild Leaderboard </h2>
                <p className="text-xs text-[#8A8A8A] mt-1">Climb the ranks by maintaining your savings streak and logging expenses.</p>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-sm text-[#8A8A8A]">Loading leaderboard logs...</div>
            ) : leaderboard.length === 0 ? (
                <div className="text-center py-16 bg-[#1A1A1A] border border-[#2E2E2E] rounded-[14px]">
                    <div className="text-4xl mb-3">🏅</div>
                    <div className="text-sm font-bold text-white">No entries on the board yet</div>
                    <p className="text-xs text-[#8A8A8A] mt-1">Check back once the guild members start logging their ledger.</p>
                </div>
            ) : (
                <>
                    <div className="flex items-end justify-center gap-2 sm:gap-6 mb-8 pt-6 sm:pt-8 select-none">
                        {rank2 && (
                            <div className="flex flex-col items-center">
                                <div className="relative mb-2">
                                    <div className="rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-zinc-600 border border-zinc-500 flex items-center justify-center font-bold text-xs sm:text-sm text-white shadow-md">{rank2.username.slice(0,2).toUpperCase()}</div>
                                </div>
                                <div className="w-16 xs:w-20 sm:w-24 h-16 bg-zinc-800/80 border border-zinc-700/50 rounded-t-lg flex flex-col items-center justify-center text-center shadow-lg p-1">
                                    <span className="text-base sm:text-lg font-black text-zinc-400">#2</span>
                                    <span className="text-[9px] sm:text-[10px] text-zinc-500 font-bold max-w-[55px] sm:max-w-[70px] truncate">{rank2.username}</span>
                                    <span className="text-[8px] sm:text-[9px] text-[#8A8A8A]">{rank2.xp.toLocaleString()} XP</span>
                                </div>
                            </div>
                        )}

                        {rank1 && (
                            <div className="flex flex-col items-center">
                                <div className="relative mb-2">
                                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-base sm:text-lg animate-bounce">👑</span>
                                    <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-gold to-[#d97706] border-2 border-gold flex items-center justify-center font-extrabold text-base sm:text-lg text-[#0F0F0F] shadow-gold">
                                        {rank1.username.slice(0, 2).toUpperCase()}
                                    </div>
                                </div>
                                <div className="w-20 xs:w-24 sm:w-28 h-20 sm:h-24 bg-gradient-to-t from-gold-glow to-gold/25 border border-gold-dim rounded-t-xl flex flex-col items-center justify-center text-center shadow-gold p-1">
                                    <span className="text-xl sm:text-2xl font-black text-gold">#1</span>
                                    <span className="text-[11px] sm:text-xs text-white font-bold max-w-[65px] sm:max-w-[80px] truncate">{rank1.username}</span>
                                    <span className="text-[9px] sm:text-[10px] text-gold font-semibold">{rank1.xp.toLocaleString()} XP</span>
                                </div>
                            </div>
                        )}

                        {rank3 && (
                            <div className="flex flex-col items-center">
                                <div className="relative mb-2">
                                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-amber-800/90 border border-amber-700 flex items-center justify-center font-bold text-xs text-white shadow-md">
                                        {rank3.username.slice(0, 2).toUpperCase()}
                                    </div>
                                </div>
                                <div className="w-16 xs:w-20 sm:w-24 h-12 sm:h-14 bg-amber-900/20 border border-amber-950/40 rounded-t-lg flex flex-col items-center justify-center text-center shadow-lg p-1">
                                    <span className="text-sm sm:text-base font-black text-amber-600">#3</span>
                                    <span className="text-[9px] sm:text-[10px] text-zinc-500 font-bold max-w-[55px] sm:max-w-[70px] truncate">{rank3.username}</span>
                                    <span className="text-[8px] sm:text-[9px] text-[#8A8A8A]">{rank3.xp.toLocaleString()} XP</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#141414] border border-zinc-900 rounded-xl overflow-x-auto shadow-xl">
                        <table className="w-full text-left border-collapse text-xs min-w-[480px] sm:min-w-full">
                            <thead>
                                <tr className="border-b border-zinc-900 text-zinc-500 font-bold uppercase tracking-wider">
                                    <th className="p-3 sm:p-4 w-14 sm:w-16 text-center">Rank</th>
                                    <th className="p-3 sm:p-4">User</th>
                                    <th className="p-3 sm:p-4 text-center">Level</th>
                                    <th className="p-3 sm:p-4 text-right">Total XP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900/50">
                            {
                                leaderboard.map((user)=>{
                                    const isMe = user.username.toLowerCase()===currentUser.toLowerCase();
                                    return(
                                        <tr key={user.rank}
                                            className={`transition-colors hover:bg-zinc-900/20 
                                            ${isMe?"bg-gold-glow/40 border-y border-gold-dim/40":""}`}
                                            >
                                            <td className="p-3 sm:p-4 text-center">
                                                {user.rank >3 ? (<span className="font-bold text-zinc-500">#{user.rank}</span>)
                                                :(
                                                    <span className="text-base">{user.rank===1?"🥇":user.rank===2?"🥈":"🥉"}</span>
                                                    )}
                                            </td>
                                            <td className="p-3 sm:p-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                                            isMe?"bg-gold text-[#0F0F0F]":"bg-surface-3 border-border-custom text-white"
                                                        }`}
                                                    >{user.username ? user.username.slice(0, 2).toUpperCase() : "??"}</div>
                                                    <div>
                                                        <span className={`font-bold ${isMe?"text-gold ":"text-zinc-200"}`}>{user.username}</span>
                                                        {isMe && <span className="ml-1.5 text-[9px] font-semibold rounded-full px-1.5 py-0.5 text-gold bg-gold-glow border border-gold-dim">Me</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 sm:p-4 text-center font-bold text-zinc-300">Lvl {user.level}</td>
                                            <td className="p-3 sm:p-4 text-right font-black text-gold text-sm tracking-tight">{user.xp.toLocaleString()} XP</td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    )
}