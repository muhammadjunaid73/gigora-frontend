import React, { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner"; // 1. Yahan spinner import kiya

const ProfileAnalyzer = () => {
  const [profileInput, setProfileInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Yeh state loading control karti hai
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [auditResult, setAuditResult] = useState({
    score: 0,
    goodPoints: [],
    improvementPoints: [],
  });

  const handleProfileAudit = async (e) => {
    e.preventDefault();
    if (!profileInput.trim()) return;

    setIsAnalyzing(true); // 2. Jab button dabaya, loading start ho gayi (Spinner active)
    try {
      const response = await fetch("http://localhost:8000/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileText: profileInput }),
      });

      if (!response.ok)
        throw new Error("Network issue or backend server offline");
      const data = await response.json();

      setAuditResult({
        score: data.score || 0,
        goodPoints: data.strengths || data.goodPoints || [],
        improvementPoints: data.weaknesses || data.improvementPoints || [],
      });
      setIsAnalyzed(true);
    } catch (error) {
      console.error("Audit failed:", error);
      alert(
        "Backend connected route failed. Check if FastAPI server is running on port 8000.",
      );
    } finally {
      setIsAnalyzing(false); // 3. Kaam khatam hone par loading band ho gayi (Spinner hidden)
    }
  };

  // 4. AGAR LOADING CHAL RAHI HAI, TOH YE WALA COMPONENT SCREEN PAR DIKHAO
  if (isAnalyzing) {
    return <LoadingSpinner message="Analyzing your profile credentials..." />;
  }

  // 5. AGAR LOADING NAHI CHAL RAHI, TOH BAQI KA INTERFACE DIKHAO
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {!isAnalyzed ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 text-[#1A56DB] rounded-lg">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111827]">
                Freelance Profile Auditor
              </h3>
              <p className="text-xs text-[#6B7280]">
                Analyze your marketplace profile text or link to optimize
                conversions.
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileAudit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
                Profile Link or Core Description Asset
              </label>
              <textarea
                rows="8"
                required
                value={profileInput}
                onChange={(e) => setProfileInput(e.target.value)}
                placeholder="Paste your Upwork bio, Fiverr description text..."
                className="w-full p-3.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-[#1A56DB] text-sm text-[#111827] resize-y"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-400 flex items-center">
                Supports text parsing models up to 2,000 words.
              </span>
              <button
                type="submit"
                disabled={isAnalyzing || !profileInput.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-[#1A56DB] hover:bg-blue-700 disabled:opacity-50 transition"
              >
                Run Profile Audit
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex items-center justify-center h-20 w-20 rounded-full bg-[#EFF6FF] border-4 border-[#1A56DB] shrink-0">
                <span className="text-xl font-black text-[#1A56DB]">
                  {auditResult.score}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-black text-[#111827]">
                  Audit Breakdown Complete
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Optimization evaluation completed based on system parameters.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsAnalyzed(false);
                setProfileInput("");
              }}
              className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Audit New Asset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-t-4 border-emerald-500">
              <h4 className="text-sm font-black uppercase tracking-wider text-emerald-700 mb-4">
                What is Good
              </h4>
              <ul className="space-y-3">
                {auditResult.goodPoints.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start text-sm text-[#374151]"
                  >
                    <span className="text-emerald-500 mr-2">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-t-4 border-amber-500">
              <h4 className="text-sm font-black uppercase tracking-wider text-amber-700 mb-4">
                What to Improve
              </h4>
              <ul className="space-y-3">
                {auditResult.improvementPoints.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start text-sm text-[#374151]"
                  >
                    <span className="text-amber-500 mr-2">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAnalyzer;
