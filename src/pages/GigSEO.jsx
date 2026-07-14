import React, { useState } from "react";

function GigSEO() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Fiverr");
  const [loading, setLoading] = useState(false);
  const [seoResult, setSeoResult] = useState(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState("");

  const handleGenerateSEO = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setSeoResult(null);

    try {
      const response = await fetch("http://localhost:8000/api/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: topic,
          description: topic,
          category: platform,
        }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Backend returned HTML instead of JSON:", responseText);
        throw new Error(
          `Backend sent non-JSON response (Status: ${response.status}). Check your backend terminal!`,
        );
      }

      if (!response.ok) {
        throw new Error(data.detail || `Backend Error: ${response.status}`);
      }

      // Format Tags properly
      const formattedTags =
        data.tags?.map((t) => (typeof t === "object" ? t.text : t)) || [];

      // Calculate mock SEO Scores if backend doesn't provide them
      const scores = {
        title: Math.min(
          100,
          Math.round((data.optimized_title?.length / 60) * 100),
        ), // Ideal title ~60 chars
        description: Math.min(
          100,
          Math.round((data.optimized_description?.length / 1000) * 100),
        ), // Ideal desc ~1000 chars
        tags: Math.min(100, Math.round((formattedTags.length / 5) * 100)), // 5 tags is ideal
      };

      // Store result as an Object to render specific sections
      setSeoResult({
        title: data.optimized_title || "",
        description: data.optimized_description || "",
        tags: formattedTags,
        tips: data.tips || [],
        scores: scores,
      });
    } catch (error) {
      console.error("SEO generation failed:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Copy to Clipboard Utility
  const handleCopy = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setToastMessage(`${sectionName} Copied!`);
    setTimeout(() => setToastMessage(""), 3000); // Hide toast after 3 seconds
  };

  // Reusable Progress Bar Component
  const ProgressBar = ({ label, score }) => {
    let colorClass = "bg-green-500";
    if (score < 50) colorClass = "bg-red-500";
    else if (score < 80) colorClass = "bg-yellow-500";

    return (
      <div className="mb-3">
        <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
          <span>{label}</span>
          <span>{score}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded h-2.5">
          <div
            className={`h-2.5 rounded transition-all duration-500 ${colorClass}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 relative">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce">
          ✅ {toastMessage}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-2 text-gray-800">
        Gig SEO Optimizer
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        Generate high-ranking titles, tags, and descriptions.
      </p>

      <form onSubmit={handleGenerateSEO} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Platform
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full p-2 border rounded mt-1 bg-gray-50 text-gray-700"
          >
            <option value="Fiverr">Fiverr</option>
            <option value="Upwork">Upwork</option>
            <option value="Freelancer">Freelancer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            What service or keywords are you targeting? (Gig Title Idea)
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows="3"
            className={`w-full p-2 border rounded mt-1 text-gray-700 focus:outline-none focus:ring-2 ${
              topic.length > 80
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-emerald-500"
            }`}
            placeholder="e.g., I will do React Frontend Development..."
            required
          />
          {/* LIVE CHARACTER COUNTER */}
          <div
            className={`text-xs text-right mt-1 font-semibold ${topic.length > 80 ? "text-red-600" : "text-gray-500"}`}
          >
            {topic.length} / 80 characters{" "}
            {topic.length > 80 && "(Exceeds Fiverr Limit!)"}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || topic.length > 80}
          className="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 transition disabled:bg-gray-400 font-semibold"
        >
          {loading
            ? "Optimizing Gig Structure..."
            : "Generate SEO Optimized Assets"}
        </button>
      </form>

      {/* RESULT SECTION */}
      {seoResult && (
        <div className="mt-8 space-y-6">
          {/* 📊 SEO SCORES */}
          <div className="p-4 bg-gray-50 border rounded-lg">
            <h3 className="text-md font-bold text-gray-800 mb-4">
              📈 SEO Health Score
            </h3>
            <ProgressBar
              label="Title Optimization"
              score={seoResult.scores.title}
            />
            <ProgressBar label="Tags Density" score={seoResult.scores.tags} />
            <ProgressBar
              label="Description Length"
              score={seoResult.scores.description}
            />
          </div>

          {/* ✨ OPTIMIZED TITLE */}
          <div className="p-4 border border-emerald-200 rounded-lg bg-emerald-50 relative">
            <button
              onClick={() => handleCopy(seoResult.title, "Title")}
              className="absolute top-2 right-2 text-xs bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-100 transition"
            >
              📋 Copy
            </button>
            <h3 className="text-sm font-bold text-emerald-800 mb-2">
              ✨ Optimized Title
            </h3>
            <p className="text-gray-800 font-medium">{seoResult.title}</p>
          </div>

          {/* 🏷️ TAGS (Colored Badges) */}
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 relative">
            <button
              onClick={() => handleCopy(seoResult.tags.join(", "), "Tags")}
              className="absolute top-2 right-2 text-xs bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-100 transition"
            >
              📋 Copy All
            </button>
            <h3 className="text-sm font-bold text-blue-800 mb-3">
              🏷️ SEO Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {seoResult.tags.map((tag, index) => {
                // Fiverr tags max length is usually 20 chars
                const isValid = tag.length <= 20;
                return (
                  <span
                    key={index}
                    className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${isValid ? "bg-green-500" : "bg-red-500"}`}
                    title={
                      isValid
                        ? "Valid Tag"
                        : "Tag too long for Fiverr (Max 20 chars)"
                    }
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>

          {/* 📝 DESCRIPTION */}
          <div className="p-4 border border-gray-200 rounded-lg relative">
            <button
              onClick={() => handleCopy(seoResult.description, "Description")}
              className="absolute top-2 right-2 text-xs bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-100 transition shadow-sm"
            >
              📋 Copy
            </button>
            <h3 className="text-sm font-bold text-gray-800 mb-2">
              📝 Description
            </h3>
            <div className="text-gray-700 text-sm whitespace-pre-line leading-relaxed mt-4">
              {seoResult.description}
            </div>
          </div>

          {/* 💡 TIPS */}
          {seoResult.tips && seoResult.tips.length > 0 && (
            <div className="p-4 border border-amber-200 rounded-lg bg-amber-50">
              <h3 className="text-sm font-bold text-amber-800 mb-2">
                💡 Pro Tips
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {seoResult.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GigSEO;
