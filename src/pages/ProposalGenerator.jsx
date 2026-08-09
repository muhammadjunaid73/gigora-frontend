import React, { useState } from "react";

// Small lock overlay used to gate Pro-only controls for free users
const ProLockOverlay = ({ onUpgradeClick, label }) => (
  <button
    type="button"
    onClick={onUpgradeClick}
    className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 bg-white/85 backdrop-blur-[1px] rounded-lg border border-dashed border-gray-300 hover:border-yellow-400 hover:bg-yellow-50/80 transition group"
  >
    <svg
      className="w-5 h-5 text-gray-400 group-hover:text-yellow-600 transition"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
    <span className="text-xs font-bold text-gray-500 group-hover:text-yellow-700">
      {label} — Pro only
    </span>
  </button>
);

// 🎯 Key Points Skeleton
const KeyPointsSkeleton = () => (
  <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-48 mb-3"></div>
    <div className="flex flex-wrap gap-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-7 bg-gray-200 rounded-full w-28"></div>
      ))}
    </div>
  </div>
);

// 📝 Proposal Box Skeleton
const ProposalBoxSkeleton = () => (
  <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-xl animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-5 bg-gray-200 rounded w-40"></div>
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded-lg w-28"></div>
        <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
      </div>
    </div>
    <div className="bg-white p-4 rounded-lg border border-indigo-100 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-11/12"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

// Full Results Skeleton
const ResultsSkeleton = () => (
  <div className="mt-8">
    <KeyPointsSkeleton />
    <ProposalBoxSkeleton />
  </div>
);

function ProposalGenerator({
  user,
  isProUser = false,
  onUpgradeClick,
  onTrackUsage, // ✅ Usage tracking callback
  onSaveHistory, // ✅ History saving callback
  onRefresh, // ✅ Refresh dashboard callback
}) {
  // Form states
  const [jobPost, setJobPost] = useState("");
  const [platform, setPlatform] = useState("Upwork");
  const [skill, setSkill] = useState("Web Dev");
  const [tone, setTone] = useState("Professional");

  // Result states
  const [proposalResult, setProposalResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const handleGenerateProposal = async (e) => {
    e.preventDefault();
    if (!jobPost.trim()) return;

    // ✅ Check usage before generating
    if (onTrackUsage) {
      const allowed = await onTrackUsage("proposal");
      if (!allowed) return; // Usage limit reached, modal will show
    }

    setLoading(true);
    setProposalResult(null);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/api/proposal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_post: jobPost,
          platform: platform,
          skill: skill,
          tone: tone,
        }),
      });

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Backend returned non-JSON:", responseText);
        throw new Error(
          "Backend returned non-JSON format. Check your backend terminal!",
        );
      }

      if (!response.ok) {
        throw new Error(
          data.detail
            ? JSON.stringify(data.detail)
            : `Backend Error: ${response.status}`,
        );
      }

      // Handle different response structures
      let result;
      if (typeof data === "string") {
        result = { proposal: data, key_points: [] };
      } else if (data.proposal) {
        result = { ...data, key_points: data.key_points || [] };
      } else {
        result = { proposal: JSON.stringify(data), key_points: [] };
      }

      setProposalResult(result);

      // ✅ Save to history
      if (onSaveHistory) {
        const outputText = result.proposal;
        await onSaveHistory("Proposal", outputText, {
          platform,
          skill,
          tone,
          jobPostLength: jobPost.length,
          keyPoints: result.key_points,
        });
      }

      setToastMessage("Proposal generated successfully!");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (error) {
      console.error("Proposal generation failed:", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Copy logic
  const handleCopy = () => {
    if (!proposalResult || !proposalResult.proposal) return;
    navigator.clipboard.writeText(proposalResult.proposal);
    setCopied(true);
    setToastMessage("Proposal copied to clipboard!");
    setTimeout(() => {
      setCopied(false);
      setToastMessage("");
    }, 2000);
  };

  // Handle Download Logic (Generates .txt file)
  const handleDownload = () => {
    if (!proposalResult || !proposalResult.proposal) return;

    const date = new Date().toISOString().split("T")[0];
    const fileName = `proposal-${date}.txt`;

    const blob = new Blob([proposalResult.proposal], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage("Proposal downloaded!");
    setTimeout(() => setToastMessage(""), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md mt-2 sm:mt-6 border border-gray-100">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce">
          ✅ {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <h2 className="text-2xl font-bold mb-2 text-gray-800">
        AI Proposal Generator
      </h2>
      <p className="text-gray-500 mb-6 text-sm">
        Paste the client's job description to generate a highly customized,
        high-converting proposal instantly.
      </p>

      {/* FORM */}
      <form onSubmit={handleGenerateProposal} className="space-y-5">
        {/* SETTINGS GRID: Platform, Skill, Tone */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {/* Platform Toggle — always free */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Platform
            </label>
            <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden">
              <button
                type="button"
                onClick={() => setPlatform("Upwork")}
                disabled={loading}
                className={`flex-1 py-2 text-sm font-medium transition disabled:opacity-50 ${
                  platform === "Upwork"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Upwork
              </button>
              <button
                type="button"
                onClick={() => setPlatform("Fiverr")}
                disabled={loading}
                className={`flex-1 py-2 text-sm font-medium transition border-l border-gray-300 disabled:opacity-50 ${
                  platform === "Fiverr"
                    ? "bg-green-600 text-white border-none"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Fiverr
              </button>
            </div>
          </div>

          {/* Skill Dropdown — Pro-only */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Primary Skill
            </label>
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              disabled={!isProUser || loading}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="Web Dev">Web Development</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Writing">Content Writing</option>
              <option value="Marketing">Digital Marketing</option>
              <option value="Mobile Dev">Mobile App Dev</option>
              <option value="AI/ML">AI & Machine Learning</option>
              <option value="Other">Other</option>
            </select>
            {!isProUser && (
              <ProLockOverlay
                onUpgradeClick={onUpgradeClick}
                label="Primary Skill"
              />
            )}
          </div>

          {/* Tone Selector — Pro-only */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Proposal Tone
            </label>
            <div className="flex flex-col space-y-1">
              <div className="flex rounded-lg overflow-hidden border border-gray-300">
                {["Professional", "Friendly", "Confident"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    disabled={!isProUser || loading}
                    onClick={() => setTone(t)}
                    className={`flex-1 py-2 text-xs font-medium transition border-r border-gray-300 last:border-0 disabled:cursor-not-allowed disabled:opacity-50
                      ${
                        tone === t
                          ? "bg-purple-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {!isProUser && (
              <ProLockOverlay
                onUpgradeClick={onUpgradeClick}
                label="Proposal Tone"
              />
            )}
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
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Paste the exact job post text here..."
            required
          />
          {/* Character counter */}
          <div className="text-xs text-right mt-1 text-gray-500 font-medium">
            {jobPost.length} characters
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
            <span className="flex-shrink-0">❌</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 font-semibold flex justify-center items-center shadow-sm text-sm min-h-[48px]"
        >
          {loading ? (
            <>
              {/* Spinner */}
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Drafting with AI...
            </>
          ) : (
            "Generate Custom Proposal"
          )}
        </button>
      </form>

      {/* LOADING SKELETON - Shows while generating */}
      {loading && <ResultsSkeleton />}

      {/* RESULT SECTION */}
      {!loading && proposalResult && proposalResult.proposal && (
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
                  <span>📥</span> Download .txt
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