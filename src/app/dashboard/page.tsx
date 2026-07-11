"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Trophy, Users, Settings, Newspaper, MessageSquare, BarChart3, 
  ShieldCheck, PlusCircle, Edit, Trash2, Save, X, Upload, LogOut,
  Bell, Calendar, MapPin, DollarSign, TrendingUp, Activity
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<"admin" | "media" | "fan">("admin");
  const [activeTab, setActiveTab] = useState("overview");
  const [teams, setTeams] = useState<any[]>([]);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [showTeamModal, setShowTeamModal] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchTeams();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
      if (data.user.role === "admin") setActiveRole("admin");
      else if (data.user.role === "media") setActiveRole("media");
      else setActiveRole("fan");
    } catch (error) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams");
      const data = await res.json();
      setTeams(data.teams || []);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const handleSaveTeam = async () => {
    try {
      const endpoint = editingTeam?.id ? `/api/teams/${editingTeam.id}` : "/api/teams";
      const method = editingTeam?.id ? "PUT" : "POST";
      
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTeam),
      });

      if (!res.ok) throw new Error("Failed to save team");
      
      toast.success(editingTeam?.id ? "Team updated!" : "Team created!");
      setShowTeamModal(false);
      setEditingTeam(null);
      fetchTeams();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteTeam = async (id: number) => {
    if (!confirm("Are you sure you want to delete this team?")) return;
    
    try {
      await fetch(`/api/teams/${id}`, { method: "DELETE" });
      toast.success("Team deleted!");
      fetchTeams();
    } catch (error: any) {
      toast.error(error.message);
    }
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

  const sidebarLinks = {
    admin: [
      { id: "overview", name: "Overview", icon: <BarChart3 size={20} /> },
      { id: "teams", name: "Teams", icon: <Users size={20} /> },
      { id: "matches", name: "Matches", icon: <Calendar size={20} /> },
      { id: "players", name: "Players", icon: <Trophy size={20} /> },
      { id: "media", name: "Media", icon: <Newspaper size={20} /> },
      { id: "settings", name: "Settings", icon: <Settings size={20} /> },
    ],
    media: [
      { id: "overview", name: "Analytics", icon: <BarChart3 size={20} /> },
      { id: "publish", name: "Publish", icon: <PlusCircle size={20} /> },
      { id: "library", name: "Library", icon: <Newspaper size={20} /> },
    ],
    fan: [
      { id: "overview", name: "Dashboard", icon: <BarChart3 size={20} /> },
      { id: "predictions", name: "Predictions", icon: <Trophy size={20} /> },
      { id: "following", name: "Following", icon: <Users size={20} /> },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-bg pb-32">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 h-16 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8">
              <img src="/rx-live-logo.png" alt="Rx Live" className="w-full h-full object-contain" />
            </div>
            <span className="font-black text-lg uppercase tracking-tighter hidden sm:block">Admin Dashboard</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-white/5 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-red rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{user?.name}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-green/20 border border-brand-green/40 flex items-center justify-center font-black text-brand-green">
                {user?.name?.[0]}
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="glass rounded-[2rem] p-4 border border-white/5 sticky top-24">
              <nav className="space-y-2">
                {sidebarLinks[activeRole].map((link) => (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeTab === link.id
                        ? "bg-brand-green/10 text-brand-green border border-brand-green/20"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </button>
                ))}
              </nav>

              {/* Role Switcher for Demo */}
              <div className="mt-8 pt-8 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Simulate Role</p>
                <div className="space-y-2">
                  {["admin", "media", "fan"].map((role) => (
                    <button
                      key={role}
                      onClick={() => setActiveRole(role as any)}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        activeRole === role
                          ? "bg-brand-green text-black"
                          : "bg-white/5 text-white/40 hover:bg-white/10"
                      }`}
                    >
                      {role.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            {activeRole === "admin" && activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total Matches", value: "128", icon: <Trophy />, color: "text-brand-green", bg: "bg-brand-green/10" },
                    { label: "Active Teams", value: "32", icon: <Users />, color: "text-brand-blue", bg: "bg-brand-blue/10" },
                    { label: "Total Players", value: "456", icon: <Activity />, color: "text-purple-400", bg: "bg-purple-400/10" },
                    { label: "Revenue", value: "₵45k", icon: <DollarSign />, color: "text-orange-400", bg: "bg-orange-400/10" },
                  ].map((stat, i) => (
                    <div key={i} className={`glass ${stat.bg} p-6 rounded-[2rem] border border-white/5`}>
                      <div className={`${stat.color} mb-4`}>{stat.icon}</div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
                      <p className="text-2xl font-black mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="glass rounded-[2rem] p-8 border border-white/5">
                  <h3 className="text-lg font-black uppercase tracking-widest mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Add Team", icon: <PlusCircle />, action: () => { setEditingTeam({}); setShowTeamModal(true); } },
                      { label: "Add Match", icon: <Calendar /> },
                      { label: "Add Player", icon: <Users /> },
                      { label: "Post News", icon: <Newspaper /> },
                    ].map((action, i) => (
                      <button
                        key={i}
                        onClick={action.action}
                        className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-brand-green/30 transition-all group"
                      >
                        <div className="text-white/40 group-hover:text-brand-green transition-colors">{action.icon}</div>
                        <span className="text-xs font-black uppercase tracking-widest">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeRole === "admin" && activeTab === "teams" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Teams Management</h2>
                  <button
                    onClick={() => { setEditingTeam({}); setShowTeamModal(true); }}
                    className="gradient-green text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm flex items-center gap-2"
                  >
                    <PlusCircle size={18} /> Add Team
                  </button>
                </div>

                <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40">
                        <th className="px-6 py-4 text-left">Team</th>
                        <th className="px-6 py-4 text-left">Code</th>
                        <th className="px-6 py-4 text-left">City</th>
                        <th className="px-6 py-4 text-left">Colors</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {teams.map((team) => (
                        <tr key={team.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-black text-sm">
                                {team.shortName || team.name?.[0]}
                              </div>
                              <span className="font-bold">{team.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white/60">{team.code || "-"}</td>
                          <td className="px-6 py-4 text-white/60">{team.city || "-"}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded" style={{ backgroundColor: team.primaryColor || "#fff" }}></div>
                              <div className="w-4 h-4 rounded" style={{ backgroundColor: team.secondaryColor || "#000" }}></div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => { setEditingTeam(team); setShowTeamModal(true); }}
                                className="p-2 hover:bg-brand-green/10 rounded-lg text-white/40 hover:text-brand-green transition-colors"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteTeam(team.id)}
                                className="p-2 hover:bg-brand-red/10 rounded-lg text-white/40 hover:text-brand-red transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {teams.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-white/20 italic">
                            No teams found. Click "Add Team" to create one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Team Modal */}
            {showTeamModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="glass rounded-[3rem] p-8 w-full max-w-lg border border-white/5 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black uppercase tracking-tighter">
                      {editingTeam?.id ? "Edit Team" : "Create Team"}
                    </h3>
                    <button
                      onClick={() => { setShowTeamModal(false); setEditingTeam(null); }}
                      className="p-2 hover:bg-white/5 rounded-full"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                        Team Name *
                      </label>
                      <input
                        type="text"
                        value={editingTeam?.name || ""}
                        onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                        placeholder="e.g., Accra Lions"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                          Short Name
                        </label>
                        <input
                          type="text"
                          value={editingTeam?.shortName || ""}
                          onChange={(e) => setEditingTeam({ ...editingTeam, shortName: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                          placeholder="e.g., AL"
                          maxLength={10}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                          Code
                        </label>
                        <input
                          type="text"
                          value={editingTeam?.code || ""}
                          onChange={(e) => setEditingTeam({ ...editingTeam, code: e.target.value.toUpperCase() })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                          placeholder="e.g., ACL"
                          maxLength={3}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={editingTeam?.city || ""}
                        onChange={(e) => setEditingTeam({ ...editingTeam, city: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                        placeholder="e.g., Accra"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                        Venue
                      </label>
                      <input
                        type="text"
                        value={editingTeam?.venue || ""}
                        onChange={(e) => setEditingTeam({ ...editingTeam, venue: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                        placeholder="e.g., Accra Sports Stadium"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                        Coach
                      </label>
                      <input
                        type="text"
                        value={editingTeam?.coach || ""}
                        onChange={(e) => setEditingTeam({ ...editingTeam, coach: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                        placeholder="e.g., Otto Addo"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                          Primary Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={editingTeam?.primaryColor || "#1e3a8a"}
                            onChange={(e) => setEditingTeam({ ...editingTeam, primaryColor: e.target.value })}
                            className="w-12 h-12 rounded-xl border border-white/10"
                          />
                          <input
                            type="text"
                            value={editingTeam?.primaryColor || "#1e3a8a"}
                            onChange={(e) => setEditingTeam({ ...editingTeam, primaryColor: e.target.value })}
                            className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                          Secondary Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={editingTeam?.secondaryColor || "#ffffff"}
                            onChange={(e) => setEditingTeam({ ...editingTeam, secondaryColor: e.target.value })}
                            className="w-12 h-12 rounded-xl border border-white/10"
                          />
                          <input
                            type="text"
                            value={editingTeam?.secondaryColor || "#ffffff"}
                            onChange={(e) => setEditingTeam({ ...editingTeam, secondaryColor: e.target.value })}
                            className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button
                        onClick={handleSaveTeam}
                        className="flex-1 gradient-green text-black py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <Save size={18} /> Save Team
                      </button>
                      <button
                        onClick={() => { setShowTeamModal(false); setEditingTeam(null); }}
                        className="px-8 py-4 glass-light rounded-xl font-black uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs placeholder */}
            {activeTab !== "overview" && activeTab !== "teams" && (
              <div className="glass rounded-[3rem] p-24 border border-white/5 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  {sidebarLinks[activeRole].find(l => l.id === activeTab)?.icon}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{activeTab}</h3>
                <p className="text-white/40">This section is under development</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
