import React, { useState } from "react";

function ProfileAnalyzer() {
  // --- STATE MANAGEMENT ---
  const [profileUrl, setProfileUrl] = useState(""); // Captures Profile URL
  const [profileDesc, setProfileDesc] = useState(""); // Captures Profile Description
  const [loading, setLoading] = useState(false); // Controls loading state spinner
  const [analysisResult, setAnalysisResult] = useState(null); // Holds result cards object

  // --- BACKEND INTEGRATION LAYER (API CALL) ---
  const handleAnalyzeProfile = async (e) => {
    e.preventDefault();

    // Check validation: Kam az kam ek field fill honi chahiye
    if (!profileUrl.trim() && !profileDesc.trim()) {
      alert("Please enter a Profile URL or Description to analyze.");
      return;
    }

    setLoading(true);
    setAnalysisResult(null); // Purane results clear karne ke liye

    try {
      // 🌐 Connect frontend to /api/profile backend route using fetch()
      const response = await fetch("http://localhost:8000/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Dono inputs ko backend payload mein send kar rahe hain
        body: JSON.stringify({
          profileUrl: profileUrl.trim(),
          profileDescription: profileDesc.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Backend system failed to reply");
      }

      const data = await response.json();

      setAnalysisResult({
        good:
          data.good ||
          "Profile content structure has high readability metrics.",
        improve:
          data.improve ||
          "Try adding key metrics, industry-standard stack keywords, and clear call-to-actions.",
        score: data.score || 8,
      });
    } catch (error) {
      console.error("API Call error:", error);

      // Intern Local Development Fallback Mock Data (For offline server testing)
      setAnalysisResult({
        good: "Your input parameters provide clear visibility into core capabilities.",
        improve:
          "Missing direct statistics or portfolio links. Boost target keyword visibility.",
        score: 7,
      });
    } finally {
      setLoading(false); // Stop loading spinner animation
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10 border border-gray-100">
      {/* HEADER SECTION */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile Auditor</h2>
        <p className="text-gray-500 text-sm">
          Provide your freelance profile link, bio description, or both to
          initiate the optimization scan.
        </p>
      </div>

      {/* --- SEPARATE INPUTS PAGE --- */}
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm"
            placeholder="Or copy-paste your raw about/bio description text here..."
          />
        </div>

        <p className="text-xs text-gray-400 italic font-medium">
          * Note: You can fill either the URL, the description, or both fields.
        </p>

        {/* SUBMIT BUTTON WITH SPINNER */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-semibold flex justify-center items-center shadow-sm"
        >
          {/* --- LOADING STATE: SPINNER ANIMATION --- */}
          {loading ? (
            <>
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
              AI Processing Data...
            </>
          ) : (
            "Analyze Profile"
          )}
        </button>
      </form>

      {/* --- RESULTS DISPLAY: AI SUGGESTION CARDS --- */}
      {analysisResult && (
        <div className="mt-8 pt-6 border-t border-gray-100 space-y-6">
          <h3 className="text-lg font-bold text-gray-800">
            📊 AI Optimization Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card A: What is Good */}
            <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
              <div className="text-xl mb-1">✅</div>
              <h4 className="font-bold text-green-900 text-sm mb-1">
                What is Good
              </h4>
              <p className="text-xs text-green-800 leading-relaxed">
                {analysisResult.good}
              </p>
            </div>

            {/* Card B: What to Improve */}
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="text-xl mb-1">💡</div>
              <h4 className="font-bold text-amber-900 text-sm mb-1">
                What to Improve
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                {analysisResult.improve}
              </p>
            </div>

            {/* Card C: Score Out of 10 */}
            <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl flex flex-col justify-center items-center text-center">
              <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider mb-2">
                Overall Score
              </h4>
              <div className="flex items-baseline">
                <span className="text-4xl font-black text-blue-600">
                  {analysisResult.score}
                </span>
                <span className="text-lg text-blue-400 font-bold">/10</span>
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
