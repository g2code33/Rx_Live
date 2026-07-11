"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, Edit, Save, X, Plus, Trash2, Upload, Camera, 
  Shield, Star, Activity, TrendingUp, Calendar, MapPin
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function TeamOwnerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [team, setTeam] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingTeam, setEditingTeam] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<any>(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      const res = await fetch("/api/teams/my");
      const data = await res.json();
      
      if (!res.ok || !data.team) {
        toast.error("No team assigned to your account");
        router.push("/dashboard");
        return;
      }
      
      setTeam(data.team);
      setUser(data.user);
      setPlayers(data.team.players || []);
    } catch (error) {
      toast.error("Failed to load team data");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTeam = async () => {
    try {
      const res = await fetch(`/api/teams/${team.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(team),
      });

      if (!res.ok) throw new Error("Failed to update team");
      
      toast.success("Team updated successfully!");
      setEditingTeam(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAddPlayer = () => {
    setEditingPlayer({
      teamId: team.id,
      name: "",
      firstName: "",
      lastName: "",
      number: players.length + 1,
      position: "MID",
      photo: "",
      nationality: "Ghana",
      countryFlag: "🇬🇭",
    });
    setShowPlayerModal(true);
  };

  const handleSavePlayer = async () => {
    try {
      const endpoint = editingPlayer.id 
        ? `/api/players/${editingPlayer.id}` 
        : "/api/players";
      const method = editingPlayer.id ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPlayer),
      });

      if (!res.ok) throw new Error("Failed to save player");
      
      toast.success(editingPlayer.id ? "Player updated!" : "Player added!");
      setShowPlayerModal(false);
      setEditingPlayer(null);
      fetchOwnerData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeletePlayer = async (id: number) => {
    if (!confirm("Delete this player?")) return;
    
    try {
      await fetch(`/api/players/${id}`, { method: "DELETE" });
      toast.success("Player deleted!");
      fetchOwnerData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In production, you'd upload to cloud storage
    // For now, we'll use a placeholder
    const reader = new FileReader();
    reader.onloadend = () => {
      if (field === "team") {
        setTeam({ ...team, logo: reader.result as string });
      } else if (editingPlayer) {
        setEditingPlayer({ ...editingPlayer, photo: reader.result as string });
      }
      toast.success("Photo uploaded!");
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/40 font-bold uppercase tracking-widest text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg pb-32">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 h-16 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 overflow-hidden">
              {team?.logo ? (
                <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
              ) : (
                <img src="/rx-live-logo.png" alt="Rx Live" className="w-full h-full object-contain p-1" />
              )}
            </div>
            <div>
              <h1 className="font-black text-lg uppercase">{team?.name}</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Team Owner Dashboard</p>
            </div>
          </div>
          
          <button 
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 glass-light rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10"
          >
            Back to Admin
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: <Activity size={16} /> },
            { id: "squad", label: "Squad", icon: <Users size={16} /> },
            { id: "settings", label: "Settings", icon: <Edit size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-brand-green text-black"
                  : "glass-light text-white/40 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Team Card */}
            <div className="glass rounded-[3rem] p-8 border border-white/5">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-white/5 overflow-hidden border-4 border-white/10">
                    {team?.logo ? (
                      <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white/20">
                        {team?.shortName || team?.name?.[0]}
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-10 h-10 gradient-green rounded-full flex items-center justify-center cursor-pointer shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={18} className="text-black" />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, "team")} />
                  </label>
                </div>
                
                <div className="flex-grow text-center md:text-left">
                  <h2 className="text-3xl font-black italic uppercase mb-2">{team?.name}</h2>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                    <span className="flex items-center gap-2 text-white/60">
                      <MapPin size={14} /> {team?.city}
                    </span>
                    <span className="flex items-center gap-2 text-white/60">
                      <Calendar size={14} /> Founded {team?.founded || "2024"}
                    </span>
                    <span className="flex items-center gap-2 text-white/60">
                      <Users size={14} /> {players.length} Players
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-black text-brand-green mb-1">{players.filter(p => p.isCaptain).length}</div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Captain</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Players", value: players.length, icon: <Users />, color: "text-brand-blue" },
                { label: "Avg Rating", value: (players.reduce((sum, p) => sum + (p.rating || 6.5), 0) / (players.length || 1)).toFixed(2), icon: <Star />, color: "text-yellow-400" },
                { label: "Formation", value: team?.formation || "4-4-2", icon: <Activity />, color: "text-brand-green" },
                { label: "Matches", value: "0", icon: <Calendar />, color: "text-purple-400" },
              ].map((stat, i) => (
                <div key={i} className="glass rounded-[2rem] p-6 border border-white/5">
                  <div className={`${stat.color} mb-4`}>{stat.icon}</div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
                  <p className="text-2xl font-black mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="glass rounded-[3rem] p-8 border border-white/5">
              <h3 className="text-lg font-black uppercase tracking-widest mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Add Player", icon: <Plus />, action: handleAddPlayer, color: "bg-brand-green/10 text-brand-green" },
                  { label: "Edit Team", icon: <Edit />, action: () => setEditingTeam(true), color: "bg-brand-blue/10 text-brand-blue" },
                  { label: "View Squad", icon: <Users />, action: () => setActiveTab("squad"), color: "bg-purple-400/10 text-purple-400" },
                  { label: "Settings", icon: <Edit />, action: () => setActiveTab("settings"), color: "bg-orange-400/10 text-orange-400" },
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={action.action}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl ${action.color} hover:opacity-80 transition-opacity`}
                  >
                    {action.icon}
                    <span className="text-xs font-black uppercase tracking-widest">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Squad Tab */}
        {activeTab === "squad" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Team Squad</h2>
              <button
                onClick={handleAddPlayer}
                className="gradient-green text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm flex items-center gap-2"
              >
                <Plus size={18} /> Add Player
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => (
                <div key={player.id} className="glass rounded-[2rem] p-6 border border-white/5 hover:border-brand-green/30 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 overflow-hidden">
                        {player.photo ? (
                          <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-black text-white/20 text-xl">
                            {player.name?.[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold">{player.name}</h3>
                        <p className="text-xs text-white/40">#{player.number} • {player.position}</p>
                      </div>
                    </div>
                    {player.isCaptain && (
                      <div className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-[10px] font-black uppercase">
                        Captain
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-brand-green">{player.rating?.toFixed(1)}</span>
                      <span className="text-[10px] text-white/40 uppercase">Rating</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingPlayer(player); setShowPlayerModal(true); }}
                        className="p-2 hover:bg-brand-blue/10 rounded-lg text-white/40 hover:text-brand-blue transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePlayer(player.id)}
                        className="p-2 hover:bg-brand-red/10 rounded-lg text-white/40 hover:text-brand-red transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {players.length === 0 && (
                <div className="col-span-full glass rounded-[3rem] p-12 border border-white/5 text-center">
                  <Users size={48} className="mx-auto text-white/20 mb-4" />
                  <p className="text-white/40 font-bold uppercase tracking-widest">No players yet</p>
                  <button onClick={handleAddPlayer} className="mt-4 text-brand-green font-black uppercase tracking-widest hover:underline">
                    Add your first player
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Team Settings</h2>
            
            <div className="glass rounded-[3rem] p-8 border border-white/5 space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  value={team?.name || ""}
                  onChange={(e) => setTeam({ ...team, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Short Name
                  </label>
                  <input
                    type="text"
                    value={team?.shortName || ""}
                    onChange={(e) => setTeam({ ...team, shortName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Code
                  </label>
                  <input
                    type="text"
                    value={team?.code || ""}
                    onChange={(e) => setTeam({ ...team, code: e.target.value.toUpperCase() })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={team?.city || ""}
                  onChange={(e) => setTeam({ ...team, city: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                  Venue
                </label>
                <input
                  type="text"
                  value={team?.venue || ""}
                  onChange={(e) => setTeam({ ...team, venue: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                  Coach
                </label>
                <input
                  type="text"
                  value={team?.coach || ""}
                  onChange={(e) => setTeam({ ...team, coach: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                  Formation
                </label>
                <select
                  value={team?.formation || "4-4-2"}
                  onChange={(e) => setTeam({ ...team, formation: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                >
                  <option value="4-4-2">4-4-2</option>
                  <option value="4-3-3">4-3-3</option>
                  <option value="4-2-3-1">4-2-3-1</option>
                  <option value="3-5-2">3-5-2</option>
                  <option value="3-4-3">3-4-3</option>
                  <option value="5-3-2">5-3-2</option>
                </select>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  onClick={handleSaveTeam}
                  className="flex-1 gradient-green text-black py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Player Modal */}
      {showPlayerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass rounded-[3rem] p-8 w-full max-w-lg border border-white/5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black uppercase tracking-tighter">
                {editingPlayer?.id ? "Edit Player" : "Add Player"}
              </h3>
              <button
                onClick={() => { setShowPlayerModal(false); setEditingPlayer(null); }}
                className="p-2 hover:bg-white/5 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editingPlayer?.firstName || ""}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, firstName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editingPlayer?.lastName || ""}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, lastName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingPlayer?.name || ""}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Number
                  </label>
                  <input
                    type="number"
                    value={editingPlayer?.number || ""}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, number: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Position
                  </label>
                  <select
                    value={editingPlayer?.position || "MID"}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, position: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                  >
                    <option value="GK">Goalkeeper</option>
                    <option value="DEF">Defender</option>
                    <option value="MID">Midfielder</option>
                    <option value="FWD">Forward</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlayer?.isCaptain || false}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, isCaptain: e.target.checked })}
                    className="w-4 h-4 rounded bg-white/5 border-white/10"
                  />
                  <span className="text-xs font-bold uppercase tracking-widest">Team Captain</span>
                </label>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  onClick={handleSavePlayer}
                  className="flex-1 gradient-green text-black py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Save Player
                </button>
                <button
                  onClick={() => { setShowPlayerModal(false); setEditingPlayer(null); }}
                  className="px-8 py-4 glass-light rounded-xl font-black uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
