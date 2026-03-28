import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function CreateProject() {
  const [project, setProject] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const [message, setMessage] = useState("");
  const [projects, setProjects] = useState([]);

  // Fetch all data on load
  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setProjects(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { error } = await supabase.from("projects").insert([project]);

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Project created successfully in supabase database");
      setProject({ title: "", description: "", deadline: "" });

      // refresh table
      fetchProjects();
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 mb-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Create New Project
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Project Title
            </label>
            <input
              type="text"
              value={project.title}
              onChange={(e) =>
                setProject({ ...project, title: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Upwork Website Redesign"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              value={project.description}
              onChange={(e) =>
                setProject({ ...project, description: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg outline-none h-28 resize-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe project requirements..."
              required
            ></textarea>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Deadline
            </label>
            <input
              type="date"
              value={project.deadline}
              onChange={(e) =>
                setProject({ ...project, deadline: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Create Project
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-green-600 font-semibold">
            {message}
          </p>
        )}
      </div>

      {/* Project List */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">All Projects</h3>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Deadline</th>
              <th className="p-3 border">Created</th>
            </tr>
          </thead>

          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No projects found.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id} className="hover:bg-gray-100">
                  <td className="p-3 border">{p.id}</td>
                  <td className="p-3 border">{p.title}</td>
                  <td className="p-3 border">{p.deadline}</td>
                  <td className="p-3 border">
                    {new Date(p.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
