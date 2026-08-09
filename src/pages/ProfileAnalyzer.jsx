import React, { useState } from "react";
// import { getSupabase } from "../App";

// 📊 Score Card Skeleton
const ScoreCardSkeleton = () => (
  <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl animate-pulse flex flex-col justify-center items-center text-center">
    <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
    <div className="flex items-baseline mb-1">
      <div className="h-10 bg-gray-200 rounded w-16"></div>
      <div className="h-5 bg-gray-200 rounded w-8 ml-1"></div>
    </div>
    <div className="h-3 bg-gray-200 rounded w-32 mt-2"></div>
  </div>
);

// 📋 Analysis Card Skeleton
const AnalysisCardSkeleton = ({ color }) => {
  const borderColor =
    color === "green" ? "border-green-200" : "border-amber-200";
  const bgColor = color === "green" ? "bg-green-50/50" : "bg-amber-50/50";

  return (
    <div
      className={`p-5 border ${borderColor} ${bgColor} rounded-xl animate-pulse`}
    >
      <div className="h-5 bg-gray-200 rounded w-8 mb-1"></div>
      <div className="h-4 bg-gray-200 rounded w-28 mb-1"></div>
      <div className="space-y-2 mt-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
};

// Full Results Skeleton
const ResultsSkeleton = () => (
  <div className="mt-8 pt-6 border-t border-gray-100 space-y-6">
    <div className="h-6 bg-gray-200 rounded w-56 animate-pulse"></div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Good Card Skeleton */}
      <AnalysisCardSkeleton color="green" />

      {/* Improve Card Skeleton */}
      <AnalysisCardSkeleton color="amber" />

      {/* Score Card Skeleton */}
      <ScoreCardSkeleton />
    </div>
  </div>
);

function ProfileAnalyzer({
  isProUser = false,
  onUpgradeClick,
  onTrackUsage, // ✅ Usage tracking callback
  onSaveHistory, // ✅ History saving callback
  onRefresh, // ✅ Refresh dashboard callback
}) {
  // --- STATE MANAGEMENT ---
  const [profileUrl, setProfileUrl] = useState("");
  const [profileDesc, setProfileDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  // --- BACKEND INTEGRATION LAYER (API CALL) ---
  const handleAnalyzeProfile = async (e) => {
    e.preventDefault();

    if (!profileUrl.trim() && !profileDesc.trim()) {
      alert("Please enter a Profile URL or Description to analyze.");
      return;
    }

    // ✅ Check usage before generating
    if (onTrackUsage) {
      const allowed = await onTrackUsage("profile");
      if (!allowed) return; // Usage limit reached, modal will show
    }

    setLoading(true);
    setAnalysisResult(null);
    setErrorMessage("");

    const combinedText = `Profile URL: ${profileUrl.trim()}\n\nProfile Description:\n${profileDesc.trim()}`;

    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileText: combinedText,
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
            : `API Error: ${response.status}`,
        );
      }

      const result = {
        good:
          data.good ||
          "Profile content structure has high readability metrics.",
        improve:
          data.improve ||
          "Try adding key metrics, industry-standard stack keywords, and clear call-to-actions.",
        score: data.score || 8,
      };

      setAnalysisResult(result);

      // ✅ Save to history
      if (onSaveHistory) {
        const outputText = `✅ Strengths:\n${result.good}\n\n💡 Areas to Improve:\n${result.improve}`;
        await onSaveHistory("Profile", outputText, {
          score: result.score,
          hasUrl: !!profileUrl.trim(),
          hasDescription: !!profileDesc.trim(),
        });
      }

      // Show success toast
      setToastMessage("Profile analyzed successfully!");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (error) {
      console.error("API Call error:", error);
      setErrorMessage(error.message);

      // Fallback for demo/development
      setAnalysisResult({
        good: "Your profile structure shows clear expertise signals and relevant keywords.",
        improve:
          "Add more quantifiable achievements and portfolio links to boost credibility.",
        score: 7,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10 border border-gray-100">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce">
          ✅ {toastMessage}
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile Auditor</h2>
        <p className="text-gray-500 text-sm">
          Provide your freelance profile link, bio description, or both to
          initiate the optimization scan.
        </p>
      </div>

      {/* --- INPUT FORM --- */}
      <form onSubmit={handleAnalyzeProfile} className="space-y-4">
        {/* Input 1: Profile URL Textarea */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Profile URL
          </label>
          <textarea
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            rows="2"
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Paste your link here (e.g., https://www.fiverr.com/username)..."
          />
        </div>

        {/* Input 2: Profile Description Textarea */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Profile Description
          </label>
          <textarea
            value={profileDesc}
            onChange={(e) => setProfileDesc(e.target.value)}
            rows="5"
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Or copy-paste your raw about/bio description text here..."
          />
        </div>

        <p className="text-xs text-gray-400 italic font-medium">
          * Note: You can fill either the URL, the description, or both fields.
        </p>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
            <span className="flex-shrink-0">❌</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* SUBMIT BUTTON WITH SPINNER */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-semibold flex justify-center items-center shadow-sm min-h-[48px]"
        >
          {loading ? (
            <>
              {/* Spinner Animation */}
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
              AI Analyzing Profile...
            </>
          ) : (
            "Analyze Profile"
          )}
        </button>
      </form>

      {/* LOADING SKELETON - Shows while analyzing */}
      {loading && <ResultsSkeleton />}

      {/* --- RESULTS DISPLAY: AI SUGGESTION CARDS --- */}
      {!loading && analysisResult && (
        <div className="mt-8 pt-6 border-t border-gray-100 space-y-6">
          <h3 className="text-lg font-bold text-gray-800">
            📊 AI Optimization Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card A: What is Good */}
            <div className="p-5 bg-green-50 border border-green-200 rounded-xl transition-all duration-300 hover:shadow-md">
              <div className="text-xl mb-1">✅</div>
              <h4 className="font-bold text-green-900 text-sm mb-1">
                What is Good
              </h4>
              <p className="text-xs text-green-800 leading-relaxed">
                {analysisResult.good}
              </p>
            </div>

            {/* Card B: What to Improve */}
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl transition-all duration-300 hover:shadow-md">
              <div className="text-xl mb-1">💡</div>
              <h4 className="font-bold text-amber-900 text-sm mb-1">
                What to Improve
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                {analysisResult.improve}
              </p>
            </div>

            {/* Card C: Score Out of 10 */}
            <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl flex flex-col justify-center items-center text-center transition-all duration-300 hover:shadow-md">
              <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider mb-2">
                Overall Score
              </h4>
              <div className="flex items-baseline">
                <span className="text-4xl font-black text-blue-600">
                  {analysisResult.score}
                </span>
                <span className="text-lg text-blue-400 font-bold">/10</span>
              </div>
              <div className="mt-2">
                {/* Score Progress Bar */}
                <div className="w-24 bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(analysisResult.score / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-[10px] text-blue-600 mt-2 font-medium">
                Ranked against benchmark standards
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileAnalyzer;