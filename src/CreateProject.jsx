import { useState, useEffect, useMemo } from "react";
import { supabase } from "./supabaseClient";
import {
  Trash2,
  Plus,
  Calendar,
  Folder,
  CheckCircle,
  Search,
  AlertCircle,
  Clock,
  TrendingUp,
  Zap,
  ChevronRight,
} from "lucide-react";

export default function CreateProject() {
  const [project, setProject] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("deadline", { ascending: true });
    if (!error) setProjects(data);
    setLoading(false);
  }

  const filteredProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, projects]);

  const getStatus = (deadline) => {
    const diffDays = Math.ceil(
      (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays < 0)
      return {
        label: "Overdue",
        color: "bg-rose-500",
        text: "text-rose-600",
        light: "bg-rose-50",
        icon: <AlertCircle className="w-3 h-3" />,
      };
    if (diffDays <= 7)
      return {
        label: "Urgent",
        color: "bg-orange-500",
        text: "text-orange-600",
        light: "bg-orange-50",
        icon: <Clock className="w-3 h-3" />,
      };
    return {
      label: "Active",
      color: "bg-emerald-500",
      text: "text-emerald-600",
      light: "bg-emerald-50",
      icon: <Zap className="w-3 h-3" />,
    };
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const { error } = await supabase.from("projects").insert([project]);
    if (error) setMessage({ text: error.message, type: "error" });
    else {
      setMessage({ text: "Project Synced Successfully", type: "success" });
      setProject({ title: "", description: "", deadline: "" });
      fetchProjects();
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      {/* 1. ULTRA-MODERN NAV */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <Folder className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-slate-800">
              PRO<span className="text-blue-600 italic">FLOW</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-slate-100 p-1.5 rounded-full pl-4 border border-slate-200">
            <span className="text-xs font-bold text-slate-500">
              v2.4.0 Stable
            </span>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm"
              alt="user"
            />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-12">
        {/* 2. ANALYTICS HEADER */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-200/80 shadow-sm flex items-center gap-6">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="8"
                  strokeDasharray="220"
                  strokeDashoffset={220 - projects.length * 10}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <TrendingUp className="absolute w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                Efficiency Score
              </p>
              <h3 className="text-3xl font-black text-slate-800 leading-none">
                94.2%
              </h3>
              <p className="text-emerald-500 text-xs font-bold mt-1">
                +2.4% from last week
              </p>
            </div>
          </div>

          <div className="flex-[2] bg-slate-900 rounded-[2rem] p-6 text-white flex items-center justify-between overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-1">Welcome back, Chief.</h2>
              <p className="text-slate-400 text-sm max-w-[280px]">
                You have {projects.length} active projects and 2 due for review
                today.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-10 w-48 h-48 bg-blue-500/20 blur-[80px] rounded-full"></div>
            <button
              onClick={() => window.scrollTo({ top: 1000, behavior: "smooth" })}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 group shadow-xl shadow-blue-900/20"
            >
              Quick Action{" "}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* 3. PROJECT FEED (LEFT) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                Timeline
              </h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search registry..."
                  className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/5 outline-none w-64 transition-all shadow-sm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-6">
              {filteredProjects.length === 0 ? (
                <div className="py-24 text-center bg-slate-100/50 rounded-[3rem] border-4 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold uppercase tracking-tighter text-xl italic opacity-50">
                    Empty Registry
                  </p>
                </div>
              ) : (
                filteredProjects.map((p) => {
                  const status = getStatus(p.deadline);
                  return (
                    <div
                      key={p.id}
                      className="group bg-white border border-slate-200/60 p-6 rounded-[2rem] hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-500 flex flex-col gap-4"
                    >
                      <div className="flex justify-between items-start">
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status.light} ${status.text}`}
                        >
                          {status.icon} {status.label}
                        </div>
                        <button
                          onClick={() => deleteProject(p.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                          {p.title}
                        </h4>
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                          {p.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"
                              ></div>
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            Team Assigned
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-xs font-black">
                            {new Date(p.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 4. CREATION PANEL (RIGHT) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white/40 backdrop-blur-3xl border border-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/5">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  Deploy Project
                </h3>
                <p className="text-slate-500 text-sm font-medium">
                  Initialize a new instance in the cloud registry.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) =>
                      setProject({ ...project, title: e.target.value })
                    }
                    className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all text-sm font-bold placeholder:text-slate-300 shadow-sm"
                    placeholder="e.g. Quantum Interface"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Execution Brief
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) =>
                      setProject({ ...project, description: e.target.value })
                    }
                    className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl h-32 resize-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all text-sm leading-relaxed font-medium placeholder:text-slate-300 shadow-sm"
                    placeholder="Define the scope..."
                    required
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Final Deadline
                  </label>
                  <input
                    type="date"
                    value={project.deadline}
                    onChange={(e) =>
                      setProject({ ...project, deadline: e.target.value })
                    }
                    className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all text-sm font-bold shadow-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-3"
                >
                  <Plus className="w-4 h-4" /> Start Production
                </button>
              </form>

              {message.text && (
                <div
                  className={`mt-8 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-in fade-in slide-in-from-bottom-4 duration-500 ${message.type === "success" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" : "bg-rose-500 text-white"}`}
                >
                  {message.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
