import React, { useState } from "react";

function GigSEO() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Fiverr");
  const [loading, setLoading] = useState(false);
  const [seoResult, setSeoResult] = useState(null);

  const handleGenerateSEO = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setSeoResult(null);

    try {
      // API Key loaded safely
      const apiKey =
        process.env.REACT_APP_GEMINI_API_KEY ||
        "AIzaSyBYmEsLMm57TEJc_8GW3KVvqVISti4oco8";

      const promptText = `Act as an expert freelance SEO specialist. Optimize a ${platform} gig for this topic/service: "${topic}". 
      Provide the output in clean text with clearly marked sections:
      1. Suggested Catchy & Optimized Gig Titles (3 variations)
      2. Highly Optimized Gig Description (incorporating search terms naturally)
      3. Top 5 Search Tags/Keywords`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: promptText }],
              },
            ],
          }),
        },
      );

      const data = await response.json();

      if (data.candidates && data.candidates[0].content.parts[0].text) {
        setSeoResult(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error("Invalid response structure from Gemini API");
      }
    } catch (error) {
      console.error("Gemini SEO generation failed:", error);
      alert("Failed to generate SEO content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">
        Gig SEO Optimizer
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        Generate high-ranking titles, tags, and descriptions using Gemini AI.
      </p>

      <form onSubmit={handleGenerateSEO} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Platform
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full p-2 border rounded mt-1 bg-gray-50"
          >
            <option value="Fiverr">Fiverr</option>
            <option value="Upwork">Upwork</option>
            <option value="Freelancer">Freelancer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            What service or keywords are you targeting?
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows="3"
            className="w-full p-2 border rounded mt-1"
            placeholder="e.g., React Frontend Developer, WordPress Speed Optimization, UI/UX Design for Mobile Apps"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 transition disabled:bg-gray-400 font-semibold"
        >
          {loading
            ? "Optimizing Gig Structure..."
            : "Generate SEO Optimized Assets"}
        </button>
      </form>

      {/* Result Section */}
      {seoResult && (
        <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-lg whitespace-pre-line">
          <h3 className="text-lg font-bold text-emerald-800 mb-4">
            ✨ AI Optimized SEO Output
          </h3>
          <div className="text-gray-700 text-sm leading-relaxed">
            {seoResult}
          </div>
        </div>
      )}
    </div>
  );
}

export default GigSEO;
