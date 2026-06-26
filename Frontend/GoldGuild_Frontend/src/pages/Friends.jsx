import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api.js";
import { Handshake, X, Check } from "lucide-react";

export default function Friends() {
    const [friendUsername, setFriendUsername] = useState("");
    const qc = useQueryClient();

    const { data: friends = [], isLoading: loadingFriends } = useQuery({
        queryKey: ["friends"],
        queryFn: async () => {
            const res = await api.get("/api/friends");
            return res.data;
        }
    });

    const { data: pendingRequests = [], isLoading: loadingPending } = useQuery({
        queryKey: ["friends-pending"],
        queryFn: async () => {
            const res = await api.get("/api/friends/pending");
            return res.data;
        }
    });

    const sendFriendRequest = useMutation({
        mutationFn: async (username) => {
            const res = await api.post("/api/friends/requests", { username });
            return res.data;
        },
        onSuccess: async () => {
            alert("Friend request sent successfully!");
            setFriendUsername("");
            await qc.invalidateQueries({ queryKey: ["friends-pending"] });
        },
        onError: (e) => alert("Error: " + (e?.response?.data?.message || e.message)),
    });

    const acceptFriendRequest = useMutation({
        mutationFn: async (id) => {
            const res = await api.put(`/api/friends/${id}/accept`);
            return res.data;
        },
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["friends"] });
            await qc.invalidateQueries({ queryKey: ["friends-pending"] });
        },
        onError: (e) => alert("Error: " + (e?.response?.data?.message || e.message)),
    });

    const rejectFriendRequest = useMutation({
        mutationFn: async (id) => {
            const response = await api.put(`/api/friends/${id}/reject`);
            return response.data;
        },
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["friends-pending"] });
        },
        onError: (e) => alert("Error: " + (e?.response?.data?.message || e.message)),
    });

    const handleSendRequest = (e) => {
        e.preventDefault();
        if (!friendUsername.trim()) {
            alert("Enter a username first.");
            return;
        }
        sendFriendRequest.mutate(friendUsername.trim());
    };

    return (
        <div className="w-full bg-[#0F0F0F] text-zinc-400 p-6 font-sans">
            <div className="mb-6">
                <h2 className="text-xl font-extrabold text-white tracking-tight">Guild Friends</h2>
                <p className="text-xs text-[#8A8A8A] mt-1">Connect with friends, track metrics, and climb the Leaderboard together.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-[14px] p-5 shadow-lg">
                        <h3 className="text-sm font-bold text-white mb-4">Send Friend Request</h3>
                        <form onSubmit={handleSendRequest} className="space-y-3">
                            <div>
                                <label className="text-[10px] font-semibold text-[#8A8A8A] uppercase tracking-wider mb-1 block">Friend's Username</label>
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={friendUsername}
                                    onChange={(e) => setFriendUsername(e.target.value)}
                                    className="w-full bg-[#222222] border border-[#2E2E2E] rounded-lg text-white text-xs p-2.5 outline-none focus:border-gold transition-colors placeholder:text-[#555]"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={sendFriendRequest.isPending}
                                className="w-full bg-gold text-[#0F0F0F] font-semibold text-xs py-2 rounded-lg hover:bg-[#fbbf24] hover:shadow-gold transition-all cursor-pointer disabled:opacity-50"
                            >
                                {sendFriendRequest.isPending ? "Sending..." : "Send Request"}
                            </button>
                        </form>
                    </div>

                    {/* Pending Incoming Requests */}
                    <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-[14px] p-5 shadow-lg">
                        <h3 className="text-sm font-bold text-white mb-4">Pending Requests</h3>
                        {loadingPending ? (
                            <div className="text-xs text-[#8A8A8A]">Loading requests...</div>
                        ) : pendingRequests.length === 0 ? (
                            <div className="text-xs text-[#555] italic">No pending requests.</div>
                        ) : (
                            <div className="space-y-3">
                                {pendingRequests.map((req) => (
                                    <div key={req.friendshipId} className="flex items-center justify-between bg-[#222222] border border-[#2E2E2E] rounded-lg p-2.5">
                                        <div className="min-w-0">
                                            <div className="text-xs font-bold text-white truncate">{req.username || "Unknown User"}</div>
                                            <div className="text-[9px] text-[#8A8A8A]">wants to connect</div>
                                        </div>
                                        <div className="flex gap-1.5 flex-shrink-0">
                                            <button
                                                onClick={() => acceptFriendRequest.mutate(req.friendshipId)}
                                                className="w-6 h-6 rounded bg-green-500/10 border border-green-500/30 text-green-400 text-xs flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors cursor-pointer"
                                                title="Accept Request"
                                            >
                                                <Check size={14} />
                                            </button>
                                            <button
                                                onClick={() => rejectFriendRequest.mutate(req.friendshipId)}
                                                className="w-6 h-6 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                                                title="Reject Request"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>


                <div className="lg:col-span-2">
                    <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-[14px] p-5 shadow-lg min-h-[300px]">
                        <h3 className="text-sm font-bold text-white mb-4">My Friends List</h3>
                        {loadingFriends ? (
                            <div className="text-center py-8 text-sm text-[#8A8A8A]">Loading friends list...</div>
                        ) : friends.length === 0 ? (
                            <div className="text-center py-12 flex flex-col items-center justify-center">
                                <div className="text-gold mb-3"><Handshake size={32} /></div>
                                <div className="text-sm font-bold text-white">Your list is empty</div>
                                <p className="text-xs text-[#8A8A8A] mt-1">Send requests to invite friends to the GoldGuild!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {friends.map((friend) => (
                                    <div key={friend.friendshipId} className="flex items-center gap-3 bg-[#222222] border border-[#2E2E2E] rounded-xl p-3.5 hover:border-gold-dim transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/30 to-[#d97706]/30 border border-gold-dim flex items-center justify-center font-bold text-sm text-gold flex-shrink-0">
                                            {friend.username ? friend.username.slice(0, 2).toUpperCase() : "??"}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-bold text-white truncate">{friend.username}</div>
                                            <div className="text-[10px] text-[#8A8A8A]">
                                                Connected since {friend.createdAt ? new Date(friend.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recent"}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}