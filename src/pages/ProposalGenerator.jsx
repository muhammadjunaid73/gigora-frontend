import React, { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner"; // Spinner import kiya

const ProposalGenerator = ({ user }) => {
  const [jobDescription, setJobDescription] = useState("");
  const [generatedProposal, setGeneratedProposal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerateProposal = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;

    setIsLoading(true); // Loading start ho gayi[cite: 1]
    setGeneratedProposal("");

    try {
      // Connecting to backend route in week 1 task 6 setup[cite: 1]
      const response = await fetch("http://localhost:8000/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_post: jobDescription }),
      });

      if (!response.ok) throw new Error("Server communication offline");
      const data = await response.json();
      setGeneratedProposal(data.proposal);
    } catch (error) {
      console.error("Failed to generate:", error);
      // Fallback local response simulation structure if backend is offline[cite: 1]
      setGeneratedProposal(
        `Hi there!\n\nI reviewed your project description: "${jobDescription.substring(0, 40)}..." and I am confident in providing optimized code solutions tailored specifically to your roadmap.\n\nBest regards,\n${user?.name || "Developer"}`,
      );
    } finally {
      setIsLoading(false); // Loading khatam ho gayi[cite: 1]
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedProposal);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Agar loading chal rahi hai, toh LoadingSpinner screen par dikhao[cite: 1]
  if (isLoading) {
    return <LoadingSpinner message="Drafting your tailored AI proposal..." />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <section className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-base font-bold text-[#111827] mb-3">
          Job Post Details
        </h3>
        <form onSubmit={handleGenerateProposal} className="space-y-4">
          <textarea
            rows="12"
            required
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description details here..."
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-sm text-[#111827] resize-y focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
          />
          <button
            type="submit"
            disabled={isLoading || !jobDescription.trim()}
            className="w-full py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-[#1A56DB] hover:bg-blue-700 disabled:opacity-50 transition"
          >
            Generate Proposal
          </button>
        </form>
      </section>

      <section className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-bold text-[#111827]">
            AI Tailored Proposal
          </h3>
          {generatedProposal && (
            <button
              onClick={handleCopy}
              className="text-xs font-bold text-[#1A56DB] bg-[#EFF6FF] px-2.5 py-1.5 rounded-md hover:bg-blue-100"
            >
              {isCopied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
        <div className="flex-1 border border-gray-100 bg-gray-50 rounded-lg p-4 text-sm text-[#111827] whitespace-pre-line leading-relaxed">
          {generatedProposal || (
            <div className="h-full flex items-center justify-center text-gray-400 py-12">
              Ready to analyze and draft assets.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProposalGenerator;
