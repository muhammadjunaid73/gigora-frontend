import React, { useState } from "react";

function ProposalGenerator() {
  // 1. All required states correctly defined
  const [jobPost, setJobPost] = useState("");
  const [proposalResult, setProposalResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false); // Copy state add kar di

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
        setProposalResult({ proposal: data });
      } else if (data.proposal) {
        setProposalResult(data);
      } else {
        setProposalResult({ proposal: JSON.stringify(data) });
      }
    } catch (error) {
      console.error("Proposal generation failed:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fixed handleCopy with correct state variables
  const handleCopy = () => {
    if (!proposalResult || !proposalResult.proposal) return;
    navigator.clipboard.writeText(proposalResult.proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      <form onSubmit={handleGenerateProposal} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Job Description / Client Requirements
          </label>
          {/* 3. Fixed value and onChange bindings to match 'jobPost' state */}
          <textarea
            value={jobPost}
            onChange={(e) => setJobPost(e.target.value)}
            rows="6"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm"
            placeholder="Paste the job post text here..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 font-semibold flex justify-center items-center shadow-sm text-sm"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
              Analyzing Requirements & Drafting...
            </>
          ) : (
            "Generate Custom Proposal"
          )}
        </button>
      </form>

      {/* 4. Fixed Result rendering conditions with 'proposalResult' state */}
      {proposalResult && proposalResult.proposal && (
        <div className="mt-8 p-6 bg-indigo-50 border border-indigo-200 rounded-xl relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-indigo-900 flex items-center gap-1">
              ✨ Generated Proposal
            </h3>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-white border border-indigo-300 rounded-lg text-xs text-indigo-700 font-semibold hover:bg-indigo-100 transition shadow-sm"
            >
              {copied ? "Copied! ✓" : "Copy Proposal"}
            </button>
          </div>
          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-lg border border-indigo-100 max-h-96 overflow-y-auto shadow-inner">
            {proposalResult.proposal}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProposalGenerator;
