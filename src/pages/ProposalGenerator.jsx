import React, { useState } from "react";

function ProposalGenerator() {
  // 1. All required states correctly defined
  const [jobPost, setJobPost] = useState("");
  const [proposalResult, setProposalResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // New States for Week 2 Tasks
  const [platform, setPlatform] = useState("Upwork");
  const [skill, setSkill] = useState("Web Dev");
  const [tone, setTone] = useState("Professional");

  const handleGenerateProposal = async (e) => {
    e.preventDefault();
    if (!jobPost.trim()) return;

    setLoading(true);
    setProposalResult(null);

    try {
      // Backend (FastAPI) Call
      const response = await fetch("http://localhost:8000/api/proposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_post: jobPost,
          platform: platform, // Sending Platform
          skill: skill, // Sending Skill
          tone: tone, // Sending Tone
        }),
      });

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("Backend returned non-JSON format.");
      }

      if (!response.ok) {
        throw new Error(
          data.detail ? JSON.stringify(data.detail) : "Validation Error",
        );
      }

      // Handling response safely based on structure
      if (typeof data === "string") {
        setProposalResult({ proposal: data, key_points: [] });
      } else if (data.proposal) {
        // Fallback key_points as empty array if backend doesn't send it yet
        setProposalResult({ ...data, key_points: data.key_points || [] });
      } else {
        setProposalResult({ proposal: JSON.stringify(data), key_points: [] });
      }
    } catch (error) {
      console.error("Proposal generation failed:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Copy logic
  const handleCopy = () => {
    if (!proposalResult || !proposalResult.proposal) return;
    navigator.clipboard.writeText(proposalResult.proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Download Logic (Generates .txt file)
  const handleDownload = () => {
    if (!proposalResult || !proposalResult.proposal) return;

    // Get current date for filename (YYYY-MM-DD)
    const date = new Date().toISOString().split("T")[0];
    const fileName = `proposal-${date}.txt`;

    // Create a Blob from the text
    const blob = new Blob([proposalResult.proposal], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // Create temporary link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10 border border-gray-100">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">
        AI Proposal Generator
      </h2>
      <p className="text-gray-500 mb-6 text-sm">
        Paste the client's job description to generate a highly customized,
        high-converting proposal instantly.
      </p>

      <form onSubmit={handleGenerateProposal} className="space-y-5">
        {/* NEW SETTINGS GRID: Platform, Skill, Tone */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {/* Platform Toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Platform
            </label>
            <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden">
              <button
                type="button"
                onClick={() => setPlatform("Upwork")}
                className={`flex-1 py-2 text-sm font-medium transition ${platform === "Upwork" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                Upwork
              </button>
              <button
                type="button"
                onClick={() => setPlatform("Fiverr")}
                className={`flex-1 py-2 text-sm font-medium transition border-l border-gray-300 ${platform === "Fiverr" ? "bg-green-600 text-white border-none" : "text-gray-600 hover:bg-gray-100"}`}
              >
                Fiverr
              </button>
            </div>
          </div>

          {/* Skill Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Primary Skill
            </label>
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="Web Dev">Web Development</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Writing">Content Writing</option>
              <option value="Marketing">Digital Marketing</option>
              <option value="Mobile Dev">Mobile App Dev</option>
              <option value="AI/ML">AI & Machine Learning</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Proposal Tone
            </label>
            <div className="flex flex-col space-y-1">
              <div className="flex rounded-lg overflow-hidden border border-gray-300">
                {["Professional", "Friendly", "Confident"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`flex-1 py-2 text-xs font-medium transition border-r border-gray-300 last:border-0 
                      ${tone === t ? "bg-purple-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Job Description Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Job Description / Client Requirements
          </label>
          <textarea
            value={jobPost}
            onChange={(e) => setJobPost(e.target.value)}
            rows="5"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm"
            placeholder="Paste the exact job post text here..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 font-semibold flex justify-center items-center shadow-sm text-sm"
        >
          {loading ? "Drafting with AI..." : "Generate Custom Proposal"}
        </button>
      </form>

      {/* RESULT SECTION */}
      {proposalResult && proposalResult.proposal && (
        <div className="mt-8">
          {/* Key Points Badges (Green) */}
          {proposalResult.key_points &&
            proposalResult.key_points.length > 0 && (
              <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="text-sm font-bold text-gray-700 mb-2">
                  🎯 Key Requirements Extracted
                </h4>
                <div className="flex flex-wrap gap-2">
                  {proposalResult.key_points.map((point, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 border border-green-200 rounded-full text-xs font-semibold shadow-sm"
                    >
                      ✓ {point}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Proposal Box */}
          <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-indigo-900 flex items-center gap-1">
                ✨ Generated Proposal
              </h3>

              {/* Action Buttons: Copy & Download */}
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 font-semibold hover:bg-gray-100 transition shadow-sm flex items-center gap-1"
                >
                  📥 Download .txt
                </button>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-white border border-indigo-300 rounded-lg text-xs text-indigo-700 font-semibold hover:bg-indigo-100 transition shadow-sm flex items-center gap-1"
                >
                  {copied ? "✓ Copied" : "📋 Copy"}
                </button>
              </div>
            </div>

            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-lg border border-indigo-100 max-h-96 overflow-y-auto shadow-inner">
              {proposalResult.proposal}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProposalGenerator;
