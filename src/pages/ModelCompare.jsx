import React, { useState } from "react";

// Small "PRO" style badge shown on the winning proposal card once
// results are expanded via "See All".
const BestResultBadge = ({ modelName }) => (
  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 border border-green-300 rounded-full text-xs font-bold">
    🏆 Best Result — {modelName}
  </div>
);

function ModelCompare() {
  const [jobPost, setJobPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null); // { results: [...], winner: "Gemini" }
  const [showAll, setShowAll] = useState(false);

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!jobPost.trim()) return;

    setLoading(true);
    setResults(null);
    setShowAll(false);

    try {
      const response = await fetch("http://localhost:8000/api/model-compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_post: jobPost }),
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
          data.detail ? JSON.stringify(data.detail) : "API Error",
        );
      }

      setResults(data);
    } catch (error) {
      console.error("Model compare failed:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const winnerModel = results?.winner;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10 border border-gray-100">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Model Compare</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Run the same job post through Gemini, Groq, and Cohere — see which model
        writes the strongest proposal and how fast each responded.
      </p>

      <form onSubmit={handleCompare} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Job Description
          </label>
          <textarea
            value={jobPost}
            onChange={(e) => setJobPost(e.target.value)}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm"
            placeholder="Paste the job post text here..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 font-semibold text-sm"
        >
          {loading ? "Comparing models..." : "Compare Models"}
        </button>
      </form>

      {results && (
        <div className="mt-8 space-y-6">
          {/* --- COMPARISON TABLE: Model / Score / Speed --- */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                  <th className="p-3 font-semibold">Model</th>
                  <th className="p-3 font-semibold">Score</th>
                  <th className="p-3 font-semibold">Speed</th>
                </tr>
              </thead>
              <tbody>
                {results.results.map((r) => {
                  const isWinner = r.model === winnerModel;
                  return (
                    <tr
                      key={r.model}
                      className={`border-b border-gray-100 last:border-0 ${
                        isWinner ? "bg-green-50" : ""
                      }`}
                    >
                      <td className="p-3 text-sm font-medium text-gray-800 flex items-center gap-2">
                        {isWinner && <span title="Winner">🏆</span>}
                        {r.model}
                        {r.error && (
                          <span className="text-xs text-red-500 font-normal">
                            (failed)
                          </span>
                        )}
                      </td>
                      <td
                        className={`p-3 text-sm font-bold ${
                          isWinner ? "text-green-700" : "text-gray-700"
                        }`}
                      >
                        {r.error ? "—" : `${r.score.toFixed(1)} / 10`}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {r.error ? "—" : `${r.speed_ms}ms`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* --- SEE ALL TOGGLE --- */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="text-sm font-bold text-indigo-600 hover:underline"
            >
              {showAll ? "Hide proposals" : "See All 3 Proposals"}
            </button>
          </div>

          {/* --- EXPANDED SIDE-BY-SIDE PROPOSALS --- */}
          {showAll && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.results.map((r) => {
                const isWinner = r.model === winnerModel;
                return (
                  <div
                    key={r.model}
                    className={`p-4 rounded-xl border ${
                      isWinner
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-800 text-sm">
                        {r.model}
                      </h4>
                      {isWinner && <BestResultBadge modelName={r.model} />}
                    </div>
                    {r.error ? (
                      <p className="text-xs text-red-500">
                        This model failed to respond: {r.error}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-lg border border-gray-100 max-h-64 overflow-y-auto">
                        {r.proposal}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ModelCompare;
